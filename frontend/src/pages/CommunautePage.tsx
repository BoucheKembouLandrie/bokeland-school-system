import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, IconButton, Avatar,
    CircularProgress, Chip, Tooltip, Badge
} from '@mui/material';
import {
    Send, Mic, Stop, AttachFile, Close, Reply, WifiOff
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { useSettings } from '../contexts/SettingsContext';
import { BASE_URL } from '../config';

const COMMUNITY_SERVER = 'http://localhost:5007';

interface Message {
    id: number;
    sender_key: string;
    sender_name: string;
    is_admin: boolean;
    content: string;
    type: 'text' | 'image' | 'audio' | 'link';
    file_url: string | null;
    reply_to_id: number | null;
    reply_preview: string | null;
    deleted: boolean;
    created_at: string;
    sender_logo: string | null;
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function hashColor(name: string) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#1976d2', '#388e3c', '#d32f2f', '#7b1fa2', '#f57c00', '#0097a7', '#c62828', '#2e7d32'];
    return colors[Math.abs(hash) % colors.length];
}

const CommunautePage: React.FC = () => {
    const { settings } = useSettings();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [online, setOnline] = useState(navigator.onLine);
    const [onlineCount, setOnlineCount] = useState(0);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [connected, setConnected] = useState(false);
    const [bannedMessage, setBannedMessage] = useState<string | null>(null);
    const schoolEmail = settings?.email || '';
    const [mySenderKey, setMySenderKey] = useState(schoolEmail);
    const [mySenderName, setMySenderName] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    // ── Sync senderKey si settings chargés après le premier rendu ─────────────
    useEffect(() => {
        if (schoolEmail && !mySenderKey) {
            setMySenderKey(schoolEmail);
        }
    }, [schoolEmail, mySenderKey]);

    // ── Scroll au bas ─────────────────────────────────────────────────────────
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    // ── Online/Offline ─────────────────────────────────────────────────────────
    useEffect(() => {
        const on = () => setOnline(true);
        const off = () => setOnline(false);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
    }, []);

    // ── Charger l'historique ───────────────────────────────────────────────────
    useEffect(() => {
        fetch(`${COMMUNITY_SERVER}/api/community/messages`)
            .then(r => r.json())
            .then(data => { setMessages(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    // ── Socket.IO ─────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!schoolEmail) return;
        const logoUrl = settings?.logo_url ? (settings.logo_url.startsWith('http') ? settings.logo_url : `${BASE_URL}${settings.logo_url}`) : null;
        
        const s = io(COMMUNITY_SERVER, {
            auth: { schoolEmail, logoUrl },
            transports: ['websocket', 'polling'],
            forceNew: true,
        });
        s.on('connect', () => setConnected(true));
        s.on('disconnect', () => setConnected(false));
        s.on('connected_as', ({ senderKey, senderName }: { senderKey: string; senderName: string }) => {
            setMySenderKey(senderKey);
            setMySenderName(senderName);
        });
        s.on('new_message', (msg: Message) => setMessages(prev => [...prev.slice(-332), msg]));
        s.on('message_deleted', ({ id }: { id: number }) => {
            setMessages(prev => prev.filter(m => m.id !== id));
        });
        s.on('online_count', (n: number) => setOnlineCount(n));
        s.on('user_typing', ({ name }: { name: string }) => {
            setTypingUser(name);
            setTimeout(() => setTypingUser(null), 3000);
        });
        s.on('user_stop_typing', () => setTypingUser(null));
        s.on('auth_error', (data?: { message: string }) => {
            setConnected(false);
            if (data?.message) setBannedMessage(data.message);
            s.disconnect();
        });
        setSocket(s);
        return () => { s.disconnect(); };
    }, [schoolEmail]);

    // ── Typing indicator ────────────────────────────────────────────────────────
    const handleTyping = (val: string) => {
        setText(val);
        if (socket) {
            socket.emit('typing');
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => socket.emit('stop_typing'), 2000);
        }
    };

    // ── Envoyer texte ──────────────────────────────────────────────────────────
    const sendMessage = () => {
        if (!text.trim() || !socket) return;
        const isLink = /https?:\/\/[^\s]+/.test(text);
        socket.emit('send_message', {
            content: text.trim(),
            type: isLink ? 'link' : 'text',
            reply_to_id: replyTo?.id || null,
            reply_preview: replyTo ? replyTo.content.slice(0, 80) : null,
        });
        setText('');
        setReplyTo(null);
    };

    // ── Upload fichier ──────────────────────────────────────────────────────────
    const handleFileUpload = async (file: File) => {
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${COMMUNITY_SERVER}/api/community/upload`, { method: 'POST', body: fd });
            const { url } = await res.json();
            const type = file.type.startsWith('audio') ? 'audio' : 'image';
            socket?.emit('send_message', {
                content: type === 'image' ? '📷 Image' : '🎵 Audio',
                type,
                file_url: url,
                reply_to_id: replyTo?.id || null,
                reply_preview: replyTo?.content.slice(0, 80) || null,
            });
            setReplyTo(null);
        } catch { /* ignore */ }
    };

    // ── Voice recording ─────────────────────────────────────────────────────────
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            audioChunks.current = [];
            mr.ondataavailable = e => { if (e.data.size > 0) audioChunks.current.push(e.data); };
            mr.onstop = async () => {
                stream.getTracks().forEach(t => t.stop());
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
                await handleFileUpload(file);
            };
            mr.start();
            setMediaRecorder(mr);
            setRecording(true);
        } catch { alert('Microphone non accessible.'); }
    };
    const stopRecording = () => { mediaRecorder?.stop(); setRecording(false); setMediaRecorder(null); };

    // ── Rendu d'un message ──────────────────────────────────────────────────────
    const renderMessage = (msg: Message) => {
        const isMine = mySenderKey !== '' && msg.sender_key === mySenderKey;
        const isAdminSender = !!msg.is_admin;
        const color = isAdminSender ? '#d97706' : hashColor(msg.sender_name);
        return (
            <Box key={msg.id} sx={{ display: 'flex', flexDirection: isMine ? 'row-reverse' : 'row', mb: 1.5, alignItems: 'flex-end', gap: 1 }}>
                {/* Avatar avec logo ou initiales */}
                <Avatar 
                    src={isAdminSender ? '/logo-bokeland-school-system.png' : (msg.sender_logo && msg.sender_logo !== '/default-logo.png' ? msg.sender_logo : undefined)}
                    sx={{ width: 32, height: 32, fontSize: '0.72rem', bgcolor: color, flexShrink: 0, order: isMine ? 1 : 0 }}
                >
                    {!isAdminSender && (!msg.sender_logo || msg.sender_logo === '/default-logo.png') ? getInitials(msg.sender_name) : null}
                </Avatar>
                <Box sx={{ maxWidth: '72%' }}>
                    {/* Nom + couronne TOUJOURS visible */}
                    <Typography sx={{
                        fontSize: '0.7rem',
                        color: isAdminSender ? '#d97706' : color,
                        fontWeight: 700,
                        ml: 1, mb: 0.3,
                        textAlign: isMine ? 'right' : 'left'
                    }}>
                        {isAdminSender ? '👑 ' : ''}{msg.sender_name}
                    </Typography>
                    <Paper elevation={0} sx={{
                        p: '8px 12px',
                        borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: isMine ? '#dcf8c6' : (msg.is_admin ? '#ffe0b2' : '#fff'),
                        border: '1px solid rgba(0,0,0,0.06)',
                        position: 'relative',
                    }}>
                        {/* Reply preview */}
                        {msg.reply_preview && !msg.deleted && (
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.06)', borderRadius: 1, p: '4px 8px', mb: 1, borderLeft: '3px solid #25d366' }}>
                                <Typography sx={{ fontSize: '0.73rem', color: '#555' }}>{msg.reply_preview}</Typography>
                            </Box>
                        )}
                        {/* Contenu */}
                        {msg.type === 'image' && msg.file_url && !msg.deleted ? (
                            <img src={`${COMMUNITY_SERVER}${msg.file_url}`} alt="img"
                                style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                                onClick={() => window.open(`${COMMUNITY_SERVER}${msg.file_url!}`, '_blank')}
                            />
                        ) : msg.type === 'audio' && msg.file_url && !msg.deleted ? (
                            <audio controls src={`${COMMUNITY_SERVER}${msg.file_url}`} style={{ maxWidth: 220, height: 36 }} />
                        ) : msg.type === 'link' && !msg.deleted ? (
                            <Typography sx={{ fontSize: '0.88rem', color: '#1976d2', wordBreak: 'break-all' }}>
                                <a href={msg.content} target="_blank" rel="noreferrer">{msg.content}</a>
                            </Typography>
                        ) : (
                            <Typography sx={{ fontSize: '0.88rem', color: msg.deleted ? '#999' : '#1a1a1a', fontStyle: msg.deleted ? 'italic' : 'normal' }}>
                                {msg.content}
                            </Typography>
                        )}
                        <Typography sx={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', mt: 0.5 }}>
                            {formatTime(msg.created_at)}
                        </Typography>
                    </Paper>
                    {/* Reply button */}
                    {!msg.deleted && (
                        <Tooltip title="Répondre">
                            <IconButton size="small" onClick={() => setReplyTo(msg)} sx={{ ml: isMine ? 0 : 0.5, mr: isMine ? 0.5 : 0, opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                <Reply sx={{ fontSize: 14 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', bgcolor: '#f0f2f5', borderRadius: 0, overflow: 'hidden' }}>
            {/* ── Header ─────────────────────────────────────────────────────── */}
            <Box sx={{ bgcolor: '#075e54', px: 2, py: 1.2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#25d366', width: 40, height: 40 }}>🌍</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Communauté Bokeland</Typography>
                        {mySenderName && (
                            <Chip
                                label={`🏫 ${mySenderName}`}
                                size="small"
                                sx={{ bgcolor: 'rgba(255,255,255,0.18)', color: '#fff', fontSize: '0.62rem', height: 18, fontWeight: 600 }}
                            />
                        )}
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem' }}>
                        {onlineCount} en ligne · {connected ? '🟢 Connecté' : '🔴 Hors ligne'}
                    </Typography>
                </Box>
            </Box>

            {/* ── Status Bar ──────────────────────────────────────────────────── */}
            <Box sx={{
                bgcolor: bannedMessage ? '#d32f2f' : (!online ? '#ff9800' : (connected ? '#25d366' : '#ff9800')),
                color: '#fff', px: 2, py: 0.7, display: 'flex', alignItems: 'center', gap: 1
            }}>
                <WifiOff sx={{ fontSize: 16 }} />
                <Typography sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    {bannedMessage ? bannedMessage : (!online ? 'Pas de connexion Internet.' : (connected ? 'Connecté' : 'Reconnexion en cours…'))}
                </Typography>
            </Box>

            {/* ── Messages ────────────────────────────────────────────────────── */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5, backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2300000010\' fill-opacity=\'0.07\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress size={28} /></Box>}
                {messages.map(renderMessage)}
                {typingUser && (
                    <Typography sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic', pl: 5 }}>
                        {typingUser} est en train d'écrire…
                    </Typography>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* ── Reply preview ───────────────────────────────────────────────── */}
            {replyTo && (
                <Box sx={{ bgcolor: '#e0f2f1', px: 2, py: 0.8, display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #b2dfdb' }}>
                    <Reply sx={{ fontSize: 16, color: '#00897b' }} />
                    <Typography sx={{ fontSize: '0.8rem', flex: 1, color: '#444' }} noWrap>
                        ↩ {replyTo.sender_name} : {replyTo.content}
                    </Typography>
                    <IconButton size="small" onClick={() => setReplyTo(null)}><Close sx={{ fontSize: 16 }} /></IconButton>
                </Box>
            )}

            {/* ── Zone de saisie ──────────────────────────────────────────────── */}
            <Box sx={{ bgcolor: '#f0f2f5', px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                <Tooltip title="Joindre une image">
                    <IconButton size="small" onClick={() => fileInputRef.current?.click()} disabled={!connected}>
                        <AttachFile sx={{ color: '#54656f' }} />
                    </IconButton>
                </Tooltip>

                <TextField
                    fullWidth size="small" multiline maxRows={4}
                    placeholder={connected ? 'Écrire un message…' : 'Hors ligne…'}
                    value={text}
                    onChange={e => handleTyping(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    disabled={!connected}
                    sx={{
                        bgcolor: '#fff', borderRadius: 6,
                        '& .MuiOutlinedInput-root': { borderRadius: 6, fieldset: { border: 'none' } }
                    }}
                />

                {text.trim() ? (
                    <IconButton onClick={sendMessage} disabled={!connected}
                        sx={{ bgcolor: '#25d366', '&:hover': { bgcolor: '#128c7e' }, width: 42, height: 42 }}>
                        <Send sx={{ color: '#fff', fontSize: 20 }} />
                    </IconButton>
                ) : (
                    <Tooltip title={recording ? 'Arrêter l\'enregistrement' : 'Message vocal'}>
                        <IconButton
                            onClick={recording ? stopRecording : startRecording}
                            disabled={!connected}
                            sx={{
                                bgcolor: recording ? '#d32f2f' : '#25d366',
                                '&:hover': { bgcolor: recording ? '#b71c1c' : '#128c7e' },
                                width: 42, height: 42,
                                animation: recording ? 'pulse 1s infinite' : 'none',
                                '@keyframes pulse': { '0%': { opacity: 1 }, '50%': { opacity: 0.6 }, '100%': { opacity: 1 } }
                            }}>
                            {recording ? <Stop sx={{ color: '#fff', fontSize: 20 }} /> : <Mic sx={{ color: '#fff', fontSize: 20 }} />}
                        </IconButton>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};

export default CommunautePage;
