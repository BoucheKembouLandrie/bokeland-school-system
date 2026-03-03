import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminLogin, getAllClients, getClientStats, updateClientStatus, deleteClient, getConfig, updateConfig, uploadLogo, uploadSignature, deleteAllPayments } from '../controllers/adminController';
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


// Public login endpoint
router.post('/login', adminLogin);

// Protected admin endpoints (in production, add proper auth middleware)
router.get('/clients', getAllClients);
router.get('/stats', getClientStats);
router.put('/clients/:id', updateClientStatus);
router.delete('/clients/:id', deleteClient);
router.get('/config', getConfig);
router.put('/config', updateConfig);
router.post('/config/logo', upload.single('logo'), uploadLogo);
router.post('/config/signature', upload.single('signature'), uploadSignature);

// Payment routes
router.use('/', paymentRoutes);

// Cleanup endpoint (test data)
router.delete('/payments/all', deleteAllPayments);

export default router;
