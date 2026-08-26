"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const updateController_1 = require("../controllers/updateController");
// Configure multer for file uploads
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const dir = path_1.default.join(__dirname, '../../public/uploads/updates/temp');
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = (0, multer_1.default)({ storage });
const router = (0, express_1.Router)();
// Admin endpoints
router.post('/', upload.fields([{ name: 'installerArchive', maxCount: 1 }]), updateController_1.publishUpdate);
router.get('/', updateController_1.getUpdates);
// Client endpoints (bokeland-school-system polling / interacting)
router.get('/latest/:email', updateController_1.getLatestUpdateForClient);
router.post('/delivery/:delivery_id/acknowledge', updateController_1.acknowledgeUpdate);
router.post('/delivery/:delivery_id/installed', updateController_1.markUpdateInstalled);
exports.default = router;
