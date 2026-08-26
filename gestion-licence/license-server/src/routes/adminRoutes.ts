import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminLogin, getAllAdmins, createAdmin, updateAdmin, deleteAdmin, forgotPassword, getAllClients, getClientStats, updateClientStatus, deleteClient, getConfig, updateConfig, uploadLogo, uploadSignature, deleteAllPayments, communityBan, getAllAffiliates, updateAffiliate, createAffiliate, sendEmailsToClients } from '../controllers/adminController';
import { getUpdates, publishUpdate, deleteUpdate } from '../controllers/updateController';
import paymentRoutes from './paymentRoutes';

const router = Router();

// Configure Multer for Logo Upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const name = file.fieldname === 'signature' ? 'company_signature' : 'company_logo';
        cb(null, name + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Configure Multer for Broadcast Upload
const broadcastStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../public/broadcasts');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, 'broadcast_' + Date.now() + path.extname(file.originalname));
    }
});
const uploadBroadcast = multer({ storage: broadcastStorage });

import { uploadBroadcastImage } from '../controllers/broadcastController';

// Public authentication endpoints
router.post('/login', adminLogin);
router.post('/forgot-password', forgotPassword);

// Protected admin endpoints (in production, add proper auth middleware)

// Users CRUD
router.get('/users', getAllAdmins);
router.post('/users', createAdmin);
router.put('/users/:id', updateAdmin);
router.delete('/users/:id', deleteAdmin);

// Clients Config
router.get('/clients', getAllClients);
router.get('/stats', getClientStats);
router.put('/clients/:id', updateClientStatus);
router.put('/community-ban', communityBan);
router.delete('/clients/:id', deleteClient);
router.post('/send-email', sendEmailsToClients);

// Updates Management
router.post('/updates', upload.fields([{ name: 'installerArchive', maxCount: 1 }]), publishUpdate);
router.get('/updates', getUpdates);
router.delete('/updates/:id', deleteUpdate);

router.get('/config', getConfig);
router.put('/config', updateConfig);
router.post('/config/logo', upload.single('logo'), uploadLogo);
router.post('/config/signature', upload.single('signature'), uploadSignature);

// Broadcast Info Upload
router.post('/broadcast/upload', uploadBroadcast.single('image'), uploadBroadcastImage);

// Serve broadcast image file directly via API (accessible through Nginx proxy)
router.get('/broadcast/file/:filename', (req, res) => {
    const filename = path.basename(req.params.filename); // Prevent path traversal
    const filepath = path.join(__dirname, '../../public/broadcasts', filename);
    if (fs.existsSync(filepath)) {
        res.sendFile(filepath);
    } else {
        res.status(404).json({ error: 'Broadcast file not found' });
    }
});

// Affiliates
router.get('/affiliates', getAllAffiliates);
router.post('/affiliates', createAffiliate);
router.put('/affiliates/:id', updateAffiliate);

// Payment routes
router.use('/', paymentRoutes);

// Cleanup endpoint (test data)
router.delete('/payments/all', deleteAllPayments);

export default router;
