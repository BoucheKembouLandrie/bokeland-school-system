import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { publishUpdate, getUpdates, getLatestUpdateForClient, acknowledgeUpdate, markUpdateInstalled } from '../controllers/updateController';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../../public/uploads/updates/temp');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = Router();

// Admin endpoints
router.post('/', upload.fields([{ name: 'installerArchive', maxCount: 1 }]), publishUpdate);
router.get('/', getUpdates);

// Client endpoints (bokeland-school-system polling / interacting)
router.get('/latest/:email', getLatestUpdateForClient);
router.post('/delivery/:delivery_id/acknowledge', acknowledgeUpdate);
router.post('/delivery/:delivery_id/installed', markUpdateInstalled);

export default router;
