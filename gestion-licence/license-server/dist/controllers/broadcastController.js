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
exports.getCurrentBroadcast = exports.uploadBroadcastImage = void 0;
const BroadcastImage_1 = require("../models/BroadcastImage");
const server_1 = require("../server");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadBroadcastImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const broadcastsDir = path_1.default.join(__dirname, '../../public/broadcasts');
        // Clean up: delete all previous files in public/broadcasts/
        if (fs_1.default.existsSync(broadcastsDir)) {
            const files = fs_1.default.readdirSync(broadcastsDir);
            for (const file of files) {
                // Keep the newly uploaded file, delete others
                if (file !== req.file.filename) {
                    try {
                        fs_1.default.unlinkSync(path_1.default.join(broadcastsDir, file));
                    }
                    catch (err) {
                        console.warn(`Could not delete old broadcast file ${file}:`, err);
                    }
                }
            }
        }
        // Clean up: delete all previous records from DB
        yield BroadcastImage_1.BroadcastImage.destroy({ where: {} });
        // Create new record
        const imageUrl = `/api/admin/broadcast/file/${req.file.filename}`;
        const broadcast = yield BroadcastImage_1.BroadcastImage.create({
            filename: req.file.filename,
            imageUrl: imageUrl
        });
        // Push Socket.IO event to all connected clients
        server_1.io.emit('broadcast_image_push', {
            id: broadcast.id,
            imageUrl: imageUrl
        });
        console.log(`[License Server] New broadcast image published: ${broadcast.id}`);
        res.status(201).json({
            message: 'Broadcast image uploaded and pushed successfully',
            broadcast
        });
    }
    catch (error) {
        console.error('Error publishing broadcast image:', error);
        res.status(500).json({ error: 'Failed to publish broadcast image' });
    }
});
exports.uploadBroadcastImage = uploadBroadcastImage;
const getCurrentBroadcast = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const broadcast = yield BroadcastImage_1.BroadcastImage.findOne();
        if (!broadcast) {
            return res.json(null);
        }
        res.json({
            id: broadcast.id,
            imageUrl: broadcast.imageUrl
        });
    }
    catch (error) {
        console.error('Error fetching current broadcast image:', error);
        res.status(500).json({ error: 'Failed to fetch current broadcast image' });
    }
});
exports.getCurrentBroadcast = getCurrentBroadcast;
