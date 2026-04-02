import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import licenseRoutes from './routes/licenseRoutes';
import adminRoutes from './routes/adminRoutes';
import updateRoutes from './routes/updateRoutes';
import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Payment } from './models/Payment';
import { Config } from './models/Config';
import { Update } from './models/Update';
import { UpdateDelivery } from './models/UpdateDelivery';
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

    socket.on('register_client', (data) => {
        if (data && data.email) {
            socket.join(`client_${data.email}`);
            console.log(`[License Server] Client ${data.email} registered on socket ${socket.id}`);
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

// ─── Sync DB & Start ─────────────────────────────────────────────────────────
sequelize.sync().then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
        console.log(`License Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

