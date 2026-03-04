import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, IconButton, Avatar,
    CircularProgress, Tooltip, Badge, Chip
} from '@mui/material';
import {
    Send, Mic, Stop, AttachFile, Close, Reply, WifiOff, Delete
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';

const LICENSE_SERVER = 'http://localhost:5005';
const ADMIN_TOKEN = 'bokeland-admin-secret-2025';

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

interface CommunautePageAdminProps {
    onUnreadChange?: (count: number) => void;
}

const CommunautePageAdmin: React.FC<CommunautePageAdminProps> = ({ onUnreadChange }) => {
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

    useEffect(() => {
        const on = () => setOnline(true);
        const off = () => setOnline(false);
        window.addEventListener('online', on);
        window.addEventListener('offline', off);
        return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
    }, []);

    useEffect(() => {
        fetch(`${LICENSE_SERVER}/api/community/messages`)
            .then(r => r.json())
            .then(data => { setMessages(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const s = io(LICENSE_SERVER, {
            auth: { adminToken: ADMIN_TOKEN },
            transports: ['websocket'],
        });
        s.on('connect', () => setConnected(true));
        s.on('disconnect', () => setConnected(false));
        s.on('new_message', (msg: Message) => {
            setMessages(prev => [...prev.slice(-332), msg]);
            onUnreadChange?.(1);
        });
        s.on('message_deleted', ({ id }: { id: number }) => {
            setMessages(prev => prev.map(m => m.id === id
                ? { ...m, deleted: true, content: '🚫 Ce message a été supprimé par l\'administrateur.', file_url: null }
                : m
            ));
        });
        s.on('online_count', (n: number) => setOnlineCount(n));
        s.on('user_typing', ({ name }: { name: string }) => {
            setTypingUser(name);
            setTimeout(() => setTypingUser(null), 3000);
        });
        setSocket(s);
        return () => { s.disconnect(); };
    }, [onUnreadChange]);

    const handleTyping = (val: string) => {
        setText(val);
        if (socket) {
            socket.emit('typing');
            if (typingTimer.current) clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(() => socket.emit('stop_typing'), 2000);
        }
    };

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

    const handleFileUpload = async (file: File) => {
        const fd = new FormData();
        fd.append('file', file);
        try {
            const res = await fetch(`${LICENSE_SERVER}/api/community/upload`, { method: 'POST', body: fd });
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

    const deleteMessage = (id: number) => {
        socket?.emit('delete_message', { id });
    };

    const renderMessage = (msg: Message) => {
        const isAdminMsg = msg.sender_key === 'admin';
        const color = isAdminMsg ? '#d97706' : hashColor(msg.sender_name);
        return (
            <Box key={msg.id} sx={{ display: 'flex', flexDirection: isAdminMsg ? 'row-reverse' : 'row', mb: 1, alignItems: 'flex-end', gap: 1 }}>
                {!isAdminMsg && (
                    <Avatar sx={{ width: 32, height: 32, fontSize: '0.72rem', bgcolor: color, flexShrink: 0 }}>
                        {getInitials(msg.sender_name)}
                    </Avatar>
                )}
                <Box sx={{ maxWidth: '72%' }}>
                    {!isAdminMsg && (
                        <Typography sx={{ fontSize: '0.7rem', color, fontWeight: 700, ml: 1, mb: 0.3 }}>
                            {msg.sender_name}
                        </Typography>
                    )}
                    <Paper elevation={0} sx={{
                        p: '8px 12px',
                        borderRadius: isAdminMsg ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        bgcolor: isAdminMsg ? '#ffe0b2' : (msg.is_admin ? '#fff3e0' : '#fff'),
                        border: '1px solid rgba(0,0,0,0.06)',
                    }}>
                        {msg.reply_preview && !msg.deleted && (
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.06)', borderRadius: 1, p: '4px 8px', mb: 1, borderLeft: '3px solid #d97706' }}>
                                <Typography sx={{ fontSize: '0.73rem', color: '#555' }}>{msg.reply_preview}</Typography>
                            </Box>
                        )}
                        {msg.type === 'image' && msg.file_url && !msg.deleted ? (
                            <img src={`${LICENSE_SERVER}${msg.file_url}`} alt="img"
                                style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                                onClick={() => window.open(`${LICENSE_SERVER}${msg.file_url!}`, '_blank')}
                            />
                        ) : msg.type === 'audio' && msg.file_url && !msg.deleted ? (
                            <audio controls src={`${LICENSE_SERVER}${msg.file_url}`} style={{ maxWidth: 220, height: 36 }} />
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
                    {/* Actions admin */}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3 }}>
                        {!msg.deleted && (
                            <Tooltip title="Répondre">
                                <IconButton size="small" onClick={() => setReplyTo(msg)} sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
                                    <Reply sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!msg.deleted && !isAdminMsg && (
                            <Tooltip title="Supprimer ce message">
                                <IconButton size="small" onClick={() => deleteMessage(msg.id)}
                                    sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: '#d32f2f' } }}>
                                    <Delete sx={{ fontSize: 14 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', bgcolor: '#f0f2f5', borderRadius: 2, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ bgcolor: '#075e54', px: 2, py: 1.2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#d97706', width: 40, height: 40 }}>👑</Avatar>
                <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>Communauté Bokeland</Typography>
                        <Chip label="ADMIN" size="small" sx={{ bgcolor: '#d97706', color: '#fff', fontSize: '0.65rem', height: 18 }} />
                    </Box>
                    <Typography sx={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.72rem' }}>
                        {onlineCount} en ligne · {connected ? '🟢 Connecté' : '🔴 Hors ligne'}
                    </Typography>
                </Box>
            </Box>

            {(!online || !connected) && (
                <Box sx={{ bgcolor: '#ff9800', px: 2, py: 0.7, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <WifiOff sx={{ fontSize: 16, color: '#fff' }} />
                    <Typography sx={{ color: '#fff', fontSize: '0.8rem' }}>
                        {!online ? 'Pas de connexion Internet.' : 'Reconnexion en cours…'}
                    </Typography>
                </Box>
            )}

            {/* Messages */}
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5 }}>
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}><CircularProgress size={28} /></Box>}
                {messages.map(renderMessage)}
                {typingUser && (
                    <Typography sx={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic', pl: 5 }}>
                        {typingUser} est en train d'écrire…
                    </Typography>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Reply preview */}
            {replyTo && (
                <Box sx={{ bgcolor: '#fff3e0', px: 2, py: 0.8, display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #ffe0b2' }}>
                    <Reply sx={{ fontSize: 16, color: '#d97706' }} />
                    <Typography sx={{ fontSize: '0.8rem', flex: 1, color: '#444' }} noWrap>
                        ↩ {replyTo.sender_name} : {replyTo.content}
                    </Typography>
                    <IconButton size="small" onClick={() => setReplyTo(null)}><Close sx={{ fontSize: 16 }} /></IconButton>
                </Box>
            )}

            {/* Zone de saisie */}
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
                    sx={{ bgcolor: '#fff', borderRadius: 6, '& .MuiOutlinedInput-root': { borderRadius: 6, fieldset: { border: 'none' } } }}
                />
                {text.trim() ? (
                    <IconButton onClick={sendMessage} disabled={!connected}
                        sx={{ bgcolor: '#d97706', '&:hover': { bgcolor: '#b45309' }, width: 42, height: 42 }}>
                        <Send sx={{ color: '#fff', fontSize: 20 }} />
                    </IconButton>
                ) : (
                    <Tooltip title={recording ? 'Arrêter' : 'Message vocal'}>
                        <IconButton onClick={recording ? stopRecording : startRecording} disabled={!connected}
                            sx={{
                                bgcolor: recording ? '#d32f2f' : '#d97706',
                                '&:hover': { bgcolor: recording ? '#b71c1c' : '#b45309' },
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

export default CommunautePageAdmin;
