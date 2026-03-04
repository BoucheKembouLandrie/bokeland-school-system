import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import licenseRoutes from './routes/licenseRoutes';
import adminRoutes from './routes/adminRoutes';
import communityRoutes from './routes/communityRoutes';
import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Payment } from './models/Payment';
import { Config } from './models/Config';
import { CommunityMessage } from './models/CommunityMessage';
import path from 'path';

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3001;

// ─── Socket.IO ────────────────────────────────────────────────────────────────
const io = new SocketIOServer(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Map socketId → { senderKey, senderName, isAdmin }
const connectedUsers = new Map<string, { senderKey: string; senderName: string; isAdmin: boolean }>();

io.on('connection', async (socket) => {
    const { schoolEmail, adminToken } = socket.handshake.auth;
    let senderKey = '';
    let senderName = '';
    let isAdmin = false;

    if (adminToken === process.env.ADMIN_SECRET || adminToken === 'bokeland-admin-secret-2025') {
        isAdmin = true;
        senderKey = 'admin';
        senderName = '👑 Admin Bokeland';
    } else if (schoolEmail) {
        // Vérifier que la licence est active ou trial
        const client = await Client.findOne({
            where: { email: schoolEmail },
        });
        if (!client || (client.status !== 'ACTIVE' && client.status !== 'TRIAL')) {
            socket.emit('auth_error', { message: 'Licence inactive ou invalide.' });
            socket.disconnect();
            return;
        }
        senderKey = schoolEmail;
        senderName = client.school_name;
    } else {
        socket.disconnect();
        return;
    }

    connectedUsers.set(socket.id, { senderKey, senderName, isAdmin });
    socket.join('community');

    // Envoyer le nombre d'utilisateurs connectés
    io.to('community').emit('online_count', connectedUsers.size);

    // ── send_message ──────────────────────────────────────────────────────────
    socket.on('send_message', async (data: {
        content: string;
        type: 'text' | 'image' | 'audio' | 'link';
        file_url?: string;
        reply_to_id?: number;
        reply_preview?: string;
    }) => {
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
            });
            io.to('community').emit('new_message', msg.toJSON());
        } catch (err) {
            socket.emit('error', { message: 'Erreur envoi message' });
        }
    });

    // ── delete_message (admin only) ────────────────────────────────────────────
    socket.on('delete_message', async (data: { id: number }) => {
        if (!isAdmin) return;
        try {
            const msg = await CommunityMessage.findByPk(data.id);
            if (msg) {
                await msg.update({ deleted: true });
                io.to('community').emit('message_deleted', { id: data.id });
            }
        } catch (err) {
            socket.emit('error', { message: 'Erreur suppression' });
        }
    });

    // ── typing indicator ──────────────────────────────────────────────────────
    socket.on('typing', () => {
        socket.to('community').emit('user_typing', { name: senderName });
    });
    socket.on('stop_typing', () => {
        socket.to('community').emit('user_stop_typing', { name: senderName });
    });

    // ── disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', () => {
        connectedUsers.delete(socket.id);
        io.to('community').emit('online_count', connectedUsers.size);
    });
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/license', licenseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (_req, res) => {
    res.send('Leuana School License Server is Running');
});

// ─── Relations DB ─────────────────────────────────────────────────────────────
Client.hasMany(Payment, { foreignKey: 'client_id', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

// ─── Sync DB & Start ─────────────────────────────────────────────────────────
sequelize.sync().then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
        console.log(`License Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});

