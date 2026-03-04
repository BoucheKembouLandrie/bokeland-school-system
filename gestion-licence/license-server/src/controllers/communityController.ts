import { Request, Response } from 'express';
import { CommunityMessage } from '../models/CommunityMessage';
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// ─── Multer config pour uploads communauté ─────────────────────────────────
const communityUploadDir = path.resolve(process.cwd(), 'public', 'uploads', 'community');
if (!fs.existsSync(communityUploadDir)) {
    fs.mkdirSync(communityUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, communityUploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
});

export const communityUpload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp4'];
        cb(null, allowed.includes(file.mimetype));
    },
});

// ─── GET 333 derniers messages ──────────────────────────────────────────────
export const getMessages = async (_req: Request, res: Response) => {
    try {
        const messages = await CommunityMessage.findAll({
            order: [['created_at', 'ASC']],
            limit: 333,
        });
        // Pour les messages supprimés, masquer le contenu
        const sanitized = messages.map(m => {
            if (m.deleted) {
                return { ...m.toJSON(), content: '🚫 Ce message a été supprimé par l\'administrateur.', file_url: null };
            }
            return m.toJSON();
        });
        res.json(sanitized);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

// ─── POST upload fichier (image ou audio) ───────────────────────────────────
export const uploadMedia = async (req: Request, res: Response) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/community/${req.file.filename}`;
    res.json({ url: fileUrl });
};

// ─── DELETE message (admin seulement — soft delete) ─────────────────────────
export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const msg = await CommunityMessage.findByPk(id);
        if (!msg) return res.status(404).json({ error: 'Message not found' });
        await msg.update({ deleted: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
