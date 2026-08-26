"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const licenseRoutes_1 = __importDefault(require("./routes/licenseRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const updateRoutes_1 = __importDefault(require("./routes/updateRoutes"));
const affiliateRoutes_1 = __importDefault(require("./routes/affiliateRoutes"));
const database_1 = require("./config/database");
const Client_1 = require("./models/Client");
const Payment_1 = require("./models/Payment");
const Config_1 = require("./models/Config");
const Update_1 = require("./models/Update");
const UpdateDelivery_1 = require("./models/UpdateDelivery");
const Pricing_1 = require("./models/Pricing");
const Affiliate_1 = require("./models/Affiliate");
const Commission_1 = require("./models/Commission");
const BroadcastImage_1 = require("./models/BroadcastImage");
const pricingController_1 = require("./controllers/pricingController");
const paymentController_1 = require("./controllers/paymentController");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
const PORT = process.env.PORT || 3001;
// ─── Socket.IO ────────────────────────────────────────────────────────────────
exports.io.on('connection', (socket) => {
    console.log(`[License Server] New client connected: ${socket.id}`);
    socket.on('register_client', (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (data && data.email) {
            socket.join(`client_${data.email}`);
            console.log(`[License Server] Client ${data.email} registered on socket ${socket.id}`);
            try {
                const broadcast = yield BroadcastImage_1.BroadcastImage.findOne();
                if (broadcast) {
                    console.log(`[License Server] Sending broadcast image ${broadcast.id} to ${data.email}`);
                    socket.emit('broadcast_image_push', {
                        id: broadcast.id,
                        imageUrl: broadcast.imageUrl
                    });
                }
                else {
                    console.log(`[License Server] No broadcast image found for ${data.email}`);
                }
            }
            catch (err) {
                console.error('Error fetching broadcast on client register:', err.message);
            }
        }
    }));
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
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/public', express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/license', licenseRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/admin/updates', updateRoutes_1.default);
app.use('/api/affiliate', affiliateRoutes_1.default);
// ─── Public Payment & Pricing Routes (no auth — called from Bokeland School) ──
app.get('/api/license/pricing/by-currency', pricingController_1.getPricingByCurrency);
app.get('/api/license/pricing/currencies', pricingController_1.getAvailableCurrencies);
app.post('/api/license/payment/initiate', paymentController_1.initiatePayment);
app.post('/api/license/payments/webhook', paymentController_1.handleWebhook);
app.get('/api/license/payments/webhook', (req, res) => res.json({ status: 'ok', message: 'Webhook active' }));
app.get('/api/license/payment/status/:reference', paymentController_1.checkPaymentStatus);
// ─── Verification endpoint for Community Microservice ─────────
app.post('/api/community-auth/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { schoolEmail, adminToken } = req.body;
    let senderKey = '';
    let senderName = '';
    let isAdmin = false;
    if (adminToken && (adminToken === process.env.ADMIN_SECRET || adminToken === 'bokeland-admin-secret-2025')) {
        isAdmin = true;
        senderKey = 'admin';
        senderName = '👑 Admin Bokeland';
        return res.json({ isAdmin, senderKey, senderName });
    }
    else if (schoolEmail) {
        const client = yield Client_1.Client.findOne({ where: { email: schoolEmail } });
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
}));
app.get('/', (_req, res) => {
    res.send('Leuana School License Server is Running');
});
// ─── Relations DB ─────────────────────────────────────────────────────────────
Client_1.Client.hasMany(Payment_1.Payment, { foreignKey: 'client_id', as: 'payments' });
Payment_1.Payment.belongsTo(Client_1.Client, { foreignKey: 'client_id', as: 'Client' });
Update_1.Update.hasMany(UpdateDelivery_1.UpdateDelivery, { foreignKey: 'update_id', as: 'deliveries' });
UpdateDelivery_1.UpdateDelivery.belongsTo(Update_1.Update, { foreignKey: 'update_id', as: 'update' });
Client_1.Client.hasMany(UpdateDelivery_1.UpdateDelivery, { foreignKey: 'client_id', as: 'update_deliveries' });
UpdateDelivery_1.UpdateDelivery.belongsTo(Client_1.Client, { foreignKey: 'client_id', as: 'client' });
// Force model initialization so they are synced to DB
Affiliate_1.Affiliate.hasMany(Commission_1.Commission, { foreignKey: 'affiliate_id', as: 'commissions' });
Commission_1.Commission.belongsTo(Affiliate_1.Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });
Affiliate_1.Affiliate.hasMany(Client_1.Client, { foreignKey: 'affiliate_id', as: 'clients' });
Client_1.Client.belongsTo(Affiliate_1.Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });
Client_1.Client.hasMany(Commission_1.Commission, { foreignKey: 'client_id', as: 'commissions' });
Commission_1.Commission.belongsTo(Client_1.Client, { foreignKey: 'client_id', as: 'client' });
console.log('Loading models...', Pricing_1.Pricing.name, Config_1.Config.name, Affiliate_1.Affiliate.name, Commission_1.Commission.name, BroadcastImage_1.BroadcastImage.name);
// ─── Sync DB & Start ─────────────────────────────────────────────────────────
database_1.sequelize.sync({ alter: true }).then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Database synced (with alter=true for new columns)');
    // Seed default admin
    const bcrypt = require('bcrypt');
    const { AdminUser } = require('./models/AdminUser');
    try {
        const count = yield AdminUser.count();
        if (count === 0) {
            const passwordHash = yield bcrypt.hash('Bouche@1990', 10);
            yield AdminUser.create({
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@bokelandgroupservices.com',
                is_default: true
            });
            console.log('✅ Default admin user created (admin / Bouche@1990)');
        }
        // Seed Default Commission Rate if not exists
        const [config] = yield Config_1.Config.findOrCreate({
            where: { key: 'DEFAULT_COMMISSION_RATE' },
            defaults: { key: 'DEFAULT_COMMISSION_RATE', value: '20' }
        });
        if (config.value === '20') {
            console.log('✅ Default commission rate configured to 20%');
        }
    }
    catch (err) {
        console.error('❌ Failed to seed default admin user:', err.message);
    }
    server.listen(PORT, () => {
        console.log(`License Server running on port ${PORT}`);
    });
})).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
