import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import axios from 'axios';
import cron from 'node-cron';
import { Op } from 'sequelize';
import { sequelize } from './config/database';
import { CommunityMessage } from './models/CommunityMessage';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5007;
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'http://localhost:5005';

app.use(cors());
app.use(express.json());

// ─── Upload Configuration ───────────────────────────────────────────
const uploadDir = path.resolve(__dirname, '../../public/uploads/community');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads/community', express.static(uploadDir));

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp4'];
        cb(null, allowed.includes(file.mimetype));
    },
});

// ─── REST API Routes ───────────────────────────────────────────────
app.get('/api/community/messages', async (_req, res) => {
    try {
        const messages = await CommunityMessage.findAll({
            order: [['created_at', 'ASC']],
            limit: 333,
        });
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
});

app.post('/api/community/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/community/${req.file.filename}`;
    res.json({ url: fileUrl });
});

// ─── Socket.IO Configuration ─────────────────────────────────────────
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const connectedUsers = new Map<string, { senderKey: string; senderName: string; isAdmin: boolean; senderLogo: string | null }>();

io.on('connection', async (socket) => {
    const { schoolEmail, adminToken, logoUrl } = socket.handshake.auth;
    let senderKey = '';
    let senderName = '';
    let isAdmin = false;
    let senderLogo: string | null = logoUrl || null;

    try {
        // Authenticate via license-server
        const authPayload: any = {};
        if (adminToken) authPayload.adminToken = adminToken;
        if (schoolEmail) authPayload.schoolEmail = schoolEmail;

        const response = await axios.post(`${LICENSE_SERVER_URL}/api/community-auth/verify`, authPayload, { timeout: 3000 });
        
        isAdmin = response.data.isAdmin;
        senderKey = response.data.senderKey;
        senderName = response.data.senderName;

    } catch (err: any) {
        console.error('[Socket] Auth error:', err.message);
        let errorMsg = 'Non autorisé ou licence invalide.';
        if (err.response?.status === 403 && err.response?.data?.error) {
            errorMsg = err.response.data.error;
        }
        socket.emit('auth_error', { message: errorMsg });
        socket.disconnect();
        return;
    }

    connectedUsers.set(socket.id, { senderKey, senderName, isAdmin, senderLogo });
    socket.join('community');

    const getUniqueUsersCount = () => {
        const uniqueKeys = new Set(Array.from(connectedUsers.values()).map(u => u.senderKey));
        return uniqueKeys.size;
    };

    socket.emit('connected_as', { senderKey, senderName, isAdmin, senderLogo });
    io.to('community').emit('online_count', getUniqueUsersCount());

    socket.on('send_message', async (data: any) => {
        try {
            const msg = await CommunityMessage.create({
                sender_key: senderKey,
                sender_name: senderName,
                is_admin: isAdmin,
                content: data.content || '',
                type: data.type || 'text',
                file_url: data.file_url || null,
                reply_to_id: data.reply_to_id || null,
                reply_preview: data.reply_preview || null,
                sender_logo: senderLogo,
            });
            io.to('community').emit('new_message', msg.toJSON());
        } catch (err) {
            socket.emit('error', { message: 'Erreur envoi message' });
        }
    });

    socket.on('delete_message', async (data: { id: number }) => {
        if (!isAdmin) return;
        try {
            const msg = await CommunityMessage.findByPk(data.id);
            if (msg) {
                await msg.destroy();
                io.to('community').emit('message_deleted', { id: data.id });
            }
        } catch (err) {
            socket.emit('error', { message: 'Erreur suppression' });
        }
    });

    socket.on('block_user', async (data: { targetSenderKey: string }) => {
        if (!isAdmin) return;
        try {
            // Call License Server to ban client
            await axios.put(`${process.env.LICENSE_SERVER_URL || 'http://localhost:5005'}/api/admin/community-ban`, { email: data.targetSenderKey });
            
            // Disconnect any active sockets from this user
            for (const [sid, user] of connectedUsers.entries()) {
                if (user.senderKey === data.targetSenderKey) {
                    const targetSocket = io.sockets.sockets.get(sid);
                    if (targetSocket) {
                        targetSocket.emit('auth_error', { message: 'Vous avez été banni de la communauté.' });
                        targetSocket.disconnect(true);
                    }
                }
            }
        } catch (err) {
            console.error('[Socket] block_user error:', err);
            socket.emit('error', { message: 'Erreur lors du blocage' });
        }
    });

    socket.on('typing', () => {
        socket.to('community').emit('user_typing', { name: senderName });
    });
    
    socket.on('stop_typing', () => {
        socket.to('community').emit('user_stop_typing', { name: senderName });
    });

    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        const uniqueKeys = new Set(Array.from(connectedUsers.values()).map(u => u.senderKey));
        io.to('community').emit('online_count', uniqueKeys.size);
    });
});

app.get('/', (_req, res) => {
    res.send('Community Server is Running');
});

// ─── Auto-Deletion Job (33 Days) ───────────────────────────────────────
cron.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily cleanup of old community messages...');
    try {
        const thirtyThreeDaysAgo = new Date();
        thirtyThreeDaysAgo.setDate(thirtyThreeDaysAgo.getDate() - 33);

        const oldMessages = await CommunityMessage.findAll({
            where: {
                created_at: {
                    [Op.lt]: thirtyThreeDaysAgo
                }
            }
        });

        let deletedCount = 0;
        let filesRemoved = 0;

        for (const msg of oldMessages) {
            // Delete associated file if it exists
            if (msg.file_url) {
                const fileName = path.basename(msg.file_url);
                const filePath = path.join(uploadDir, fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    filesRemoved++;
                }
            }
            await msg.destroy();
            deletedCount++;
        }

        console.log(`[Cron] Cleanup complete: ${deletedCount} messages deleted, ${filesRemoved} files removed.`);
    } catch (err) {
        console.error('[Cron] Error during daily cleanup:', err);
    }
});

// ─── DB Sync & Start Server ──────────────────────────────────────────
sequelize.sync({ alter: true }).then(() => {
    console.log('Community Database synced with schema changes');
    server.listen(PORT, () => {
        console.log(`Community Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
