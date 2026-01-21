import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { adminLogin, getAllClients, getClientStats, updateClientStatus, deleteClient, getConfig, updateConfig, uploadLogo } from '../controllers/adminController';
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
        // Always name it logo.png or similar to keep it simple, or preserve extension
        // For simplicity and knowing we want ONE logo, let's call it 'logo.png' or keep original name 
        // to avoid browser caching issues, maybe adding timestamp? 
        // Let's stick to a fixed name 'company_logo.png' to avoid piling up files, 
        // OR rely on the controller to save the path. 
        // User requested: "quand on le change, ca supprime l'endroit dans la base de donnees" (implies replacement)
        cb(null, 'company_logo' + path.extname(file.originalname));
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

// Payment routes
router.use('/', paymentRoutes);

export default router;
