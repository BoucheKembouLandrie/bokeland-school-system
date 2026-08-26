import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import licenseRoutes from './routes/licenseRoutes';
import adminRoutes from './routes/adminRoutes';
import updateRoutes from './routes/updateRoutes';
import affiliateRoutes from './routes/affiliateRoutes';
import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Payment } from './models/Payment';
import { Config } from './models/Config';
import { Update } from './models/Update';
import { UpdateDelivery } from './models/UpdateDelivery';
import { Pricing } from './models/Pricing';
import { Affiliate } from './models/Affiliate';
import { Commission } from './models/Commission';
import { BroadcastImage } from './models/BroadcastImage';
import { getPricingByCurrency, getAvailableCurrencies } from './controllers/pricingController';
import { initiatePayment, handleWebhook, checkPaymentStatus, createPayPalOrder, capturePayPalOrder } from './controllers/paymentController';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 3001;

// ─── Socket.IO ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`[License Server] New client connected: ${socket.id}`);

    socket.on('register_client', async (data) => {
        if (data && data.email) {
            socket.join(`client_${data.email}`);
            console.log(`[License Server] Client ${data.email} registered on socket ${socket.id}`);
            try {
                const broadcast = await BroadcastImage.findOne();
                if (broadcast) {
                    console.log(`[License Server] Sending broadcast image ${broadcast.id} to ${data.email}`);
                    socket.emit('broadcast_image_push', {
                        id: broadcast.id,
                        imageUrl: broadcast.imageUrl
                    });
                } else {
                    console.log(`[License Server] No broadcast image found for ${data.email}`);
                }
            } catch (err: any) {
                console.error('Error fetching broadcast on client register:', err.message);
            }
        }
    });

    socket.on('broadcast_already_seen', (data) => {
        if (data) {
            console.log(`[License Server] Client ${data.schoolEmail} already has broadcast image ${data.imageId}`);
        }
    });

    socket.on('disconnect', () => {
        console.log(`[License Server] Client disconnected: ${socket.id}`);
    });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/license', licenseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/updates', updateRoutes);
app.use('/api/affiliate', affiliateRoutes);

// ─── Public Payment & Pricing Routes (no auth — called from Bokeland School) ──
app.get('/api/license/pricing/by-currency', getPricingByCurrency);
app.get('/api/license/pricing/currencies', getAvailableCurrencies);
app.post('/api/license/payment/initiate', initiatePayment);
app.post('/api/license/payments/webhook', handleWebhook);
app.get('/api/license/payments/webhook', (req, res) => res.json({ status: 'ok', message: 'Webhook active' }));
app.get('/api/license/payment/status/:reference', checkPaymentStatus);
app.post('/api/license/paypal/create-order', createPayPalOrder);
app.post('/api/license/paypal/capture-order', capturePayPalOrder);

// ─── Verification endpoint for Community Microservice ─────────
app.post('/api/community-auth/verify', async (req, res) => {
    const { schoolEmail, adminToken } = req.body;
    let senderKey = '';
    let senderName = '';
    let isAdmin = false;

    if (adminToken && (adminToken === process.env.ADMIN_SECRET || adminToken === 'bokeland-admin-secret-2025')) {
        isAdmin = true;
        senderKey = 'admin';
        senderName = '👑 Admin Bokeland';
        return res.json({ isAdmin, senderKey, senderName });
    } else if (schoolEmail) {
        const client = await Client.findOne({ where: { email: schoolEmail } });
        if (!client || (client.status !== 'ACTIVE' && client.status !== 'TRIAL')) {
            return res.status(401).json({ error: 'Licence inactive ou invalide.' });
        }
        if (client.community_banned) {
            return res.status(403).json({ error: 'Cet établissement a été banni de la communauté.' });
        }
        senderKey = schoolEmail;
        senderName = client.school_name;
        return res.json({ isAdmin, senderKey, senderName });
    }

    return res.status(401).json({ error: 'Non autorisé' });
});

app.get('/', (_req, res) => {
    res.send('Leuana School License Server is Running');
});

// ─── Relations DB ─────────────────────────────────────────────────────────────
Client.hasMany(Payment, { foreignKey: 'client_id', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

Update.hasMany(UpdateDelivery, { foreignKey: 'update_id', as: 'deliveries' });
UpdateDelivery.belongsTo(Update, { foreignKey: 'update_id', as: 'update' });

Client.hasMany(UpdateDelivery, { foreignKey: 'client_id', as: 'update_deliveries' });
UpdateDelivery.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
// Force model initialization so they are synced to DB
Affiliate.hasMany(Commission, { foreignKey: 'affiliate_id', as: 'commissions' });
Commission.belongsTo(Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });

Affiliate.hasMany(Client, { foreignKey: 'affiliate_id', as: 'clients' });
Client.belongsTo(Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });

Client.hasMany(Commission, { foreignKey: 'client_id', as: 'commissions' });
Commission.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });
console.log('Loading models...', Pricing.name, Config.name, Affiliate.name, Commission.name, BroadcastImage.name);

// ─── Sync DB & Start ─────────────────────────────────────────────────────────
sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced (with alter=true for new columns)');
    
    // Seed default admin
    const bcrypt = require('bcrypt');
    const { AdminUser } = require('./models/AdminUser');
    try {
        const count = await AdminUser.count();
        if (count === 0) {
            const passwordHash = await bcrypt.hash('Bouche@1990', 10);
            await AdminUser.create({
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@bokelandgroupservices.com',
                is_default: true
            });
            console.log('✅ Default admin user created (admin / Bouche@1990)');
        }
        
        // Seed Default Commission Rate if not exists
        const [config] = await Config.findOrCreate({
            where: { key: 'DEFAULT_COMMISSION_RATE' },
            defaults: { key: 'DEFAULT_COMMISSION_RATE', value: '20' }
        });
        if (config.value === '20') {
             console.log('✅ Default commission rate configured to 20%');
        }
    } catch (err: any) {
        console.error('❌ Failed to seed default admin user:', err.message);
    }

    server.listen(PORT, () => {
        console.log(`License Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
