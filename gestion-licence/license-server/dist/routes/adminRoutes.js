"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const adminController_1 = require("../controllers/adminController");
const updateController_1 = require("../controllers/updateController");
const paymentRoutes_1 = __importDefault(require("./paymentRoutes"));
const router = (0, express_1.Router)();
// Configure Multer for Logo Upload
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../public/uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const name = file.fieldname === 'signature' ? 'company_signature' : 'company_logo';
        cb(null, name + path_1.default.extname(file.originalname));
    }
});
const upload = (0, multer_1.default)({ storage });
// Configure Multer for Broadcast Upload
const broadcastStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../public/broadcasts');
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'broadcast_' + Date.now() + path_1.default.extname(file.originalname));
    }
});
const uploadBroadcast = (0, multer_1.default)({ storage: broadcastStorage });
const broadcastController_1 = require("../controllers/broadcastController");
// Public authentication endpoints
router.post('/login', adminController_1.adminLogin);
router.post('/forgot-password', adminController_1.forgotPassword);
// Protected admin endpoints (in production, add proper auth middleware)
// Users CRUD
router.get('/users', adminController_1.getAllAdmins);
router.post('/users', adminController_1.createAdmin);
router.put('/users/:id', adminController_1.updateAdmin);
router.delete('/users/:id', adminController_1.deleteAdmin);
// Clients Config
router.get('/clients', adminController_1.getAllClients);
router.get('/stats', adminController_1.getClientStats);
router.put('/clients/:id', adminController_1.updateClientStatus);
router.put('/community-ban', adminController_1.communityBan);
router.delete('/clients/:id', adminController_1.deleteClient);
router.post('/send-email', adminController_1.sendEmailsToClients);
// Updates Management
router.post('/updates', upload.fields([{ name: 'installerArchive', maxCount: 1 }]), updateController_1.publishUpdate);
router.get('/updates', updateController_1.getUpdates);
router.delete('/updates/:id', updateController_1.deleteUpdate);
router.get('/config', adminController_1.getConfig);
router.put('/config', adminController_1.updateConfig);
router.post('/config/logo', upload.single('logo'), adminController_1.uploadLogo);
router.post('/config/signature', upload.single('signature'), adminController_1.uploadSignature);
// Broadcast Info Upload
router.post('/broadcast/upload', uploadBroadcast.single('image'), broadcastController_1.uploadBroadcastImage);
// Serve broadcast image file directly via API (accessible through Nginx proxy)
router.get('/broadcast/file/:filename', (req, res) => {
    const filename = path_1.default.basename(req.params.filename); // Prevent path traversal
    const filepath = path_1.default.join(__dirname, '../../public/broadcasts', filename);
    if (fs_1.default.existsSync(filepath)) {
        res.sendFile(filepath);
    }
    else {
        res.status(404).json({ error: 'Broadcast file not found' });
    }
});
// Affiliates
router.get('/affiliates', adminController_1.getAllAffiliates);
router.post('/affiliates', adminController_1.createAffiliate);
router.put('/affiliates/:id', adminController_1.updateAffiliate);
// Payment routes
router.use('/', paymentRoutes_1.default);
// Cleanup endpoint (test data)
router.delete('/payments/all', adminController_1.deleteAllPayments);
exports.default = router;
