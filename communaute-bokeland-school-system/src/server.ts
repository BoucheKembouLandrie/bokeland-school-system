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
import { MeetingNotification } from './models/MeetingNotification';
import { MeetingRoom } from './models/MeetingRoom';

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

app.get('/api/community/establishments', async (_req, res) => {
    try {
        const response = await axios.get(`${LICENSE_SERVER_URL}/api/clients`, { timeout: 4000 });
        const clients = response.data.map((c: any) => ({
            email: c.email || c.school_email,
            name: c.nom_etablissement || c.school_name || c.name || c.email,
            logo_url: c.logo_url || null,
        })).filter((c: any) => c.email);
        res.json(clients);
    } catch {
        const connectedList = Array.from(connectedUsers.values()).map(u => ({
            email: u.senderKey,
            name: u.senderName,
            logo_url: u.senderLogo,
        }));
        res.json(connectedList);
    }
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

    // Deliver & Purge pending meeting notifications for this connecting user immediately
    try {
        const pendingNotifs = await MeetingNotification.findAll({
            where: {
                [Op.or]: [
                    { target_school_email: senderKey },
                    { target_school_email: 'ALL' }
                ]
            }
        });
        if (pendingNotifs.length > 0) {
            socket.emit('meeting_notifications_pending', pendingNotifs.map(n => n.toJSON()));
            for (const notif of pendingNotifs) {
                // Immediately delete from DB memory after sending to client
                await notif.destroy();
            }
        }
    } catch (err) {
        console.error('[Socket] Error delivering pending meeting notifications:', err);
    }

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
        try {
            const msg = await CommunityMessage.findByPk(data.id);
            if (msg) {
                if (!isAdmin && msg.sender_key !== senderKey) return;
                await msg.destroy();
                io.to('community').emit('message_deleted', { id: data.id });
            }
        } catch (err) {
            socket.emit('error', { message: 'Erreur suppression' });
        }
    });

    socket.on('edit_message', async (data: { id: number, content: string }) => {
        try {
            const msg = await CommunityMessage.findByPk(data.id);
            if (msg) {
                if (!isAdmin && msg.sender_key !== senderKey) return;
                msg.content = data.content + ' (modifié)';
                await msg.save();
                io.to('community').emit('message_edited', msg.toJSON());
            }
        } catch (err) {
            socket.emit('error', { message: 'Erreur modification' });
        }
    });

    socket.on('toggle_reaction', async (data: { id: number, emoji: string }) => {
        try {
            const msg = await CommunityMessage.findByPk(data.id);
            if (msg) {
                const reactions = msg.reactions ? { ...msg.reactions } : {};
                if (!reactions[data.emoji]) reactions[data.emoji] = [];
                
                const userIndex = reactions[data.emoji].indexOf(senderKey);
                if (userIndex > -1) {
                    reactions[data.emoji].splice(userIndex, 1);
                    if (reactions[data.emoji].length === 0) {
                        delete reactions[data.emoji];
                    }
                } else {
                    reactions[data.emoji].push(senderKey);
                }
                
                // Sequelize requires replacing the object to detect changes in JSON if not deep-cloned properly, though spreading works
                msg.reactions = { ...reactions };
                
                // Set changed required for JSON fields in some Sequelize versions
                msg.changed('reactions', true);
                
                await msg.save();
                io.to('community').emit('message_reacted', { id: msg.id, reactions: msg.reactions });
            }
        } catch (err) {
            console.error('[Socket] reaction error:', err);
            socket.emit('error', { message: 'Erreur réaction' });
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

    socket.on('schedule_meeting', async (data: { title: string, scheduled_at_gmt: string, target_emails: string[] }) => {
        try {
            const meetingId = `meeting_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
            await MeetingRoom.create({
                id: meetingId,
                title: data.title,
                host_key: senderKey,
                host_name: senderName,
                scheduled_at_gmt: data.scheduled_at_gmt,
                is_active: true,
            });

            const targetEmails = Array.isArray(data.target_emails) && data.target_emails.length > 0
                ? data.target_emails
                : ['ALL'];

            const notifPayload = {
                meeting_id: meetingId,
                initiator_key: senderKey,
                initiator_name: senderName,
                title: data.title,
                scheduled_at_gmt: data.scheduled_at_gmt,
            };

            // Broadcast to all connected sockets
            io.to('community').emit('meeting_notification_received', notifPayload);

            // Store in temporary DB queue for offline clients
            for (const targetEmail of targetEmails) {
                await MeetingNotification.create({
                    meeting_id: meetingId,
                    initiator_key: senderKey,
                    initiator_name: senderName,
                    target_school_email: targetEmail,
                    title: data.title,
                    scheduled_at_gmt: data.scheduled_at_gmt,
                });
            }

            socket.emit('meeting_scheduled_success', {
                meeting_id: meetingId,
                initiator_key: senderKey,
                initiator_name: senderName,
                title: data.title,
                scheduled_at_gmt: data.scheduled_at_gmt,
            });
        } catch (err) {
            console.error('[Socket] schedule_meeting error:', err);
            socket.emit('error', { message: 'Erreur lors de la programmation de la réunion' });
        }
    });

    socket.on('join_meeting_room', async (data: { meetingId: string, participantLogo?: string }) => {
        socket.join(`room_${data.meetingId}`);
        socket.to(`room_${data.meetingId}`).emit('user_joined_meeting', {
            socketId: socket.id,
            senderKey,
            senderName,
            senderLogo: data.participantLogo || senderLogo,
        });
    });

    socket.on('webrtc_signal', (data: { targetSocketId: string, signal: any }) => {
        io.to(data.targetSocketId).emit('webrtc_signal', {
            senderSocketId: socket.id,
            signal: data.signal,
            senderKey,
            senderName,
        });
    });

    socket.on('meeting_raise_hand', (data: { meetingId: string, isHandRaised: boolean }) => {
        io.to(`room_${data.meetingId}`).emit('participant_hand_raised', {
            senderKey,
            senderName,
            isHandRaised: data.isHandRaised,
        });
    });

    socket.on('meeting_chat_message', (data: { meetingId: string, message: string }) => {
        io.to(`room_${data.meetingId}`).emit('new_meeting_chat_message', {
            senderKey,
            senderName,
            message: data.message,
            timestamp: new Date().toISOString(),
        });
    });

    socket.on('leave_meeting_room', async (data: { meetingId: string, isHost: boolean }) => {
        socket.leave(`room_${data.meetingId}`);
        if (data.isHost) {
            io.to(`room_${data.meetingId}`).emit('meeting_cancelled_by_host', {
                message: "L'initiateur a quitté la réunion. La réunion est terminée."
            });
            await MeetingRoom.update({ is_active: false }, { where: { id: data.meetingId } });
        } else {
            io.to(`room_${data.meetingId}`).emit('user_left_meeting', {
                socketId: socket.id,
                senderKey,
                senderName,
            });
        }
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
