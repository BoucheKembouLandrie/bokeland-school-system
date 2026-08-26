"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const axios_1 = __importDefault(require("axios"));
const node_cron_1 = __importDefault(require("node-cron"));
const sequelize_1 = require("sequelize");
const database_1 = require("./config/database");
const CommunityMessage_1 = require("./models/CommunityMessage");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5007;
const LICENSE_SERVER_URL = process.env.LICENSE_SERVER_URL || 'http://localhost:5005';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ─── Upload Configuration ───────────────────────────────────────────
const uploadDir = path_1.default.resolve(__dirname, '../../public/uploads/community');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads/community', express_1.default.static(uploadDir));
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 25 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = [
            'image/jpeg', 'image/png', 'image/gif', 'image/webp',
            'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp4',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/zip',
            'application/x-zip-compressed'
        ];
        cb(null, allowed.includes(file.mimetype));
    },
});
// ─── REST API Routes ───────────────────────────────────────────────
app.get('/api/community/messages', async (_req, res) => {
    try {
        const messages = await CommunityMessage_1.CommunityMessage.findAll({
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
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
app.post('/api/community/upload', upload.single('file'), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/community/${req.file.filename}`;
    res.json({ url: fileUrl });
});
// ─── Socket.IO Configuration ─────────────────────────────────────────
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const connectedUsers = new Map();
io.on('connection', async (socket) => {
    const { schoolEmail, adminToken, logoUrl } = socket.handshake.auth;
    let senderKey = '';
    let senderName = '';
    let isAdmin = false;
    let senderLogo = logoUrl || null;
    try {
        // Authenticate via license-server
        const authPayload = {};
        if (adminToken)
            authPayload.adminToken = adminToken;
        if (schoolEmail)
            authPayload.schoolEmail = schoolEmail;
        const response = await axios_1.default.post(`${LICENSE_SERVER_URL}/api/community-auth/verify`, authPayload, { timeout: 3000 });
        isAdmin = response.data.isAdmin;
        senderKey = response.data.senderKey;
        senderName = response.data.senderName;
    }
    catch (err) {
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
    const getUniqueUsersList = () => {
        const usersMap = new Map();
        for (const [sid, user] of connectedUsers.entries()) {
            if (!usersMap.has(user.senderKey)) {
                usersMap.set(user.senderKey, { ...user, isOnline: true });
            }
        }
        return Array.from(usersMap.values());
    };
    socket.emit('connected_as', { senderKey, senderName, isAdmin, senderLogo });
    io.to('community').emit('online_count', getUniqueUsersCount());
    io.to('community').emit('online_users', getUniqueUsersList());
    socket.on('send_message', async (data) => {
        try {
            const msg = await CommunityMessage_1.CommunityMessage.create({
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
        }
        catch (err) {
            socket.emit('error', { message: 'Erreur envoi message' });
        }
    });
    socket.on('delete_message', async (data) => {
        try {
            const msg = await CommunityMessage_1.CommunityMessage.findByPk(data.id);
            if (msg) {
                if (!isAdmin && msg.sender_key !== senderKey)
                    return;
                await msg.destroy();
                io.to('community').emit('message_deleted', { id: data.id });
            }
        }
        catch (err) {
            socket.emit('error', { message: 'Erreur suppression' });
        }
    });
    socket.on('edit_message', async (data) => {
        try {
            const msg = await CommunityMessage_1.CommunityMessage.findByPk(data.id);
            if (msg) {
                if (!isAdmin && msg.sender_key !== senderKey)
                    return;
                msg.content = data.content + ' (modifié)';
                await msg.save();
                io.to('community').emit('message_edited', msg.toJSON());
            }
        }
        catch (err) {
            socket.emit('error', { message: 'Erreur modification' });
        }
    });
    socket.on('toggle_reaction', async (data) => {
        try {
            const msg = await CommunityMessage_1.CommunityMessage.findByPk(data.id);
            if (msg) {
                const reactions = msg.reactions ? { ...msg.reactions } : {};
                if (!reactions[data.emoji])
                    reactions[data.emoji] = [];
                const userIndex = reactions[data.emoji].indexOf(senderKey);
                if (userIndex > -1) {
                    reactions[data.emoji].splice(userIndex, 1);
                    if (reactions[data.emoji].length === 0) {
                        delete reactions[data.emoji];
                    }
                }
                else {
                    reactions[data.emoji].push(senderKey);
                }
                // Sequelize requires replacing the object to detect changes in JSON if not deep-cloned properly, though spreading works
                msg.reactions = { ...reactions };
                // Set changed required for JSON fields in some Sequelize versions
                msg.changed('reactions', true);
                await msg.save();
                io.to('community').emit('message_reacted', { id: msg.id, reactions: msg.reactions });
            }
        }
        catch (err) {
            console.error('[Socket] reaction error:', err);
            socket.emit('error', { message: 'Erreur réaction' });
        }
    });
    socket.on('block_user', async (data) => {
        if (!isAdmin)
            return;
        try {
            // Call License Server to ban client
            await axios_1.default.put(`${process.env.LICENSE_SERVER_URL || 'http://localhost:5005'}/api/admin/community-ban`, { email: data.targetSenderKey });
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
        }
        catch (err) {
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
        const getUniqueUsersList = () => {
            const usersMap = new Map();
            for (const [sid, user] of connectedUsers.entries()) {
                if (!usersMap.has(user.senderKey)) {
                    usersMap.set(user.senderKey, { ...user, isOnline: true });
                }
            }
            return Array.from(usersMap.values());
        };
        io.to('community').emit('online_users', getUniqueUsersList());
    });
});
app.get('/', (_req, res) => {
    res.send('Community Server is Running');
});
// ─── Auto-Deletion Job (33 Days) ───────────────────────────────────────
node_cron_1.default.schedule('0 0 * * *', async () => {
    console.log('[Cron] Running daily cleanup of old community messages...');
    try {
        const thirtyThreeDaysAgo = new Date();
        thirtyThreeDaysAgo.setDate(thirtyThreeDaysAgo.getDate() - 33);
        const oldMessages = await CommunityMessage_1.CommunityMessage.findAll({
            where: {
                created_at: {
                    [sequelize_1.Op.lt]: thirtyThreeDaysAgo
                }
            }
        });
        let deletedCount = 0;
        let filesRemoved = 0;
        for (const msg of oldMessages) {
            // Delete associated file if it exists
            if (msg.file_url) {
                const fileName = path_1.default.basename(msg.file_url);
                const filePath = path_1.default.join(uploadDir, fileName);
                if (fs_1.default.existsSync(filePath)) {
                    fs_1.default.unlinkSync(filePath);
                    filesRemoved++;
                }
            }
            await msg.destroy();
            deletedCount++;
        }
        console.log(`[Cron] Cleanup complete: ${deletedCount} messages deleted, ${filesRemoved} files removed.`);
    }
    catch (err) {
        console.error('[Cron] Error during daily cleanup:', err);
    }
});
// ─── DB Sync & Start Server ──────────────────────────────────────────
database_1.sequelize.sync({ alter: true }).then(() => {
    console.log('Community Database synced with schema changes');
    server.listen(PORT, () => {
        console.log(`Community Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
