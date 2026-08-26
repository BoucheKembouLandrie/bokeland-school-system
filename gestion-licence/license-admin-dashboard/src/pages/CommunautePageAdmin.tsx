import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box, Typography, Paper, TextField, IconButton, Avatar,
    CircularProgress, Tooltip, Chip,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button,
    AvatarGroup, Popover, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem
} from '@mui/material';
import EmojiPicker from 'emoji-picker-react';
import {
    Send, Mic, Stop, Close, Reply, WifiOff, Delete, Block, Edit,
    Add, EmojiEmotions, InsertPhoto, Description, AddReaction, InsertDriveFile, VideoCall
} from '@mui/icons-material';
import { io, Socket } from 'socket.io-client';
import { COMMUNITY_SERVER } from '../config';
import { ScheduleMeetingModal } from '../components/Community/ScheduleMeetingModal';

const ADMIN_TOKEN = 'bokeland-admin-secret-2025';

interface Message {
    id: number;
    sender_key: string;
    sender_name: string;
    is_admin: boolean;
    content: string;
    type: 'text' | 'image' | 'audio' | 'link' | 'document';
    file_url: string | null;
    reply_to_id: number | null;
    reply_preview: string | null;
    deleted: boolean;
    created_at: string;
    sender_logo: string | null;
    reactions?: Record<string, string[]>;
}

interface OnlineUser {
    senderKey: string;
    senderName: string;
    isAdmin: boolean;
    senderLogo: string | null;
}

const QUICK_REACTIONS = ['👍', '❤️', '😂', '😢', '🙏', '🎉'];

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
    const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
    const [typingUser, setTypingUser] = useState<string | null>(null);
    const [replyTo, setReplyTo] = useState<Message | null>(null);
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [connected, setConnected] = useState(false);
    const [mySenderKey, setMySenderKey] = useState('admin');
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

    const handleScheduleMeeting = (meetingData: { title: string; scheduledAtGmt: string; targetEmails: string[] }) => {
        if (socket) {
            socket.emit('schedule_meeting', {
                title: meetingData.title,
                scheduled_at_gmt: meetingData.scheduledAtGmt,
                target_emails: meetingData.targetEmails,
            });
            alert('Réunion planifiée et envoyée aux établissements !');
        }
    };
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        type: 'delete' | 'block' | 'edit' | null;
        msgId?: number;
        senderKey?: string;
        senderName?: string;
        preview?: string;
    }>({ open: false, type: null });
    const [editingMessage, setEditingMessage] = useState<Message | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const photoInputRef = useRef<HTMLInputElement>(null);
    const docInputRef = useRef<HTMLInputElement>(null);
    const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    const [onlineUsersAnchorEl, setOnlineUsersAnchorEl] = useState<HTMLElement | null>(null);
    const [attachmentAnchorEl, setAttachmentAnchorEl] = useState<HTMLElement | null>(null);
    const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
    const [reactionAnchorEl, setReactionAnchorEl] = useState<HTMLElement | null>(null);
    const [reactionMsgId, setReactionMsgId] = useState<number | null>(null);
    const reactionMsgRef = useRef<number | null>(null);

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
        fetch(`${COMMUNITY_SERVER}/api/community/messages`)
            .then(r => r.json())
            .then(data => { setMessages(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const s = io(COMMUNITY_SERVER, {
            auth: { adminToken: ADMIN_TOKEN },
            transports: ['polling', 'websocket'],
        });
        s.on('connect', () => setConnected(true));
        s.on('disconnect', () => setConnected(false));
        s.on('connected_as', ({ senderKey }: { senderKey: string }) => setMySenderKey(senderKey));
        s.on('new_message', (msg: Message) => {
            setMessages(prev => [...prev.slice(-332), msg]);
            onUnreadChange?.(1);
        });
        s.on('message_deleted', ({ id }: { id: number }) => {
            setMessages(prev => prev.filter(m => m.id !== id));
        });
        s.on('message_edited', (editedMsg: Message) => {
            setMessages(prev => prev.map(m => m.id === editedMsg.id ? editedMsg : m));
        });
        s.on('message_reacted', ({ id, reactions }: { id: number, reactions: Record<string, string[]> }) => {
            setMessages(prev => prev.map(m => m.id === id ? { ...m, reactions } : m));
        });
        s.on('online_count', (n: number) => setOnlineCount(n));
        s.on('online_users', (users: OnlineUser[]) => setOnlineUsers(users));
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

        if (editingMessage) {
            socket.emit('edit_message', { id: editingMessage.id, content: text.trim() });
            setText('');
            setEditingMessage(null);
            return;
        }

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
            const res = await fetch(`${COMMUNITY_SERVER}/api/community/upload`, { method: 'POST', body: fd });
            const { url } = await res.json();
            let type: 'image' | 'audio' | 'document' = 'document';
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('audio/')) type = 'audio';

            socket?.emit('send_message', {
                content: type === 'image' ? '📷 Image' : (type === 'audio' ? '🎵 Audio' : '📄 Document'),
                type,
                file_url: url,
                reply_to_id: replyTo?.id || null,
                reply_preview: replyTo?.content.slice(0, 80) || null,
            });
            setReplyTo(null);
        } catch { /* ignore */ }
    };

    const handleReaction = (emoji: string, msgId?: number) => {
        const targetId = msgId ?? reactionMsgRef.current ?? reactionMsgId;
        if (targetId && socket) {
            socket.emit('toggle_reaction', { id: targetId, emoji });
        }
        setReactionAnchorEl(null);
        setReactionMsgId(null);
        reactionMsgRef.current = null;
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

    const deleteMessage = (id: number, preview: string) => {
        setConfirmDialog({ open: true, type: 'delete', msgId: id, preview });
    };

    const blockUser = (targetSenderKey: string, targetSchoolName: string) => {
        setConfirmDialog({ open: true, type: 'block', senderKey: targetSenderKey, senderName: targetSchoolName });
    };

    const handleConfirmAction = () => {
        if (confirmDialog.type === 'delete' && confirmDialog.msgId) {
            socket?.emit('delete_message', { id: confirmDialog.msgId });
        } else if (confirmDialog.type === 'block' && confirmDialog.senderKey) {
            socket?.emit('block_user', { targetSenderKey: confirmDialog.senderKey });
        } else if (confirmDialog.type === 'edit' && confirmDialog.msgId) {
            const msg = messages.find(m => m.id === confirmDialog.msgId);
            if (msg) {
                setEditingMessage(msg);
                setText(msg.content.replace(' (modifié)', ''));
            }
        }
        setConfirmDialog({ open: false, type: null });
    };
    const handleCancelConfirm = () => setConfirmDialog({ open: false, type: null });

    const renderMessageContent = (content: string, isDeleted = false) => {
        const isPureEmoji = !isDeleted && /^(\p{Emoji}\s*)+$/u.test(content.trim()) && content.trim().length <= 8;
        if (isDeleted) {
            return (
                <Typography sx={{ fontSize: '0.88rem', color: '#999', fontStyle: 'italic' }}>
                    {content}
                </Typography>
            );
        }
        const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
        const parts = content.split(urlRegex);
        const parseFormatters = (text: string) => {
            const boldRegex = /(\*[^*]+\*)/g;
            const subParts = text.split(boldRegex);
            return subParts.map((subPart, i) => {
                if (subPart.startsWith('*') && subPart.endsWith('*')) {
                    const innerText = subPart.slice(1, -1);
                    return <strong key={i}>{parseItalics(innerText)}</strong>;
                }
                return parseItalics(subPart);
            });
        };
        const parseItalics = (text: string) => {
            const italicRegex = /(_[^_]+_)/g;
            const parts = text.split(italicRegex);
            return parts.map((part, i) => {
                if (part.startsWith('_') && part.endsWith('_')) {
                    return <em key={i}>{part.slice(1, -1)}</em>;
                }
                return part;
            });
        };
        return (
            <Typography component="div" sx={{
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                fontSize: isPureEmoji ? '2.2rem' : '0.88rem',
                color: '#1a1a1a',
                lineHeight: isPureEmoji ? 1.2 : 1.5
            }}>
                {parts.map((part, index) => {
                    if (urlRegex.test(part)) {
                        const href = part.startsWith('http') ? part : `https://${part}`;
                        return (
                            <a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#1976d2', textDecoration: 'underline', fontWeight: 600 }}
                            >
                                {part}
                            </a>
                        );
                    }
                    return parseFormatters(part);
                })}
            </Typography>
        );
    };

    const renderMessage = (msg: Message) => {
        const isAdminMsg = msg.sender_key === mySenderKey;
        const isAdminSender = !!msg.is_admin;
        const color = isAdminSender ? '#d97706' : hashColor(msg.sender_name);
        return (
            <Box key={msg.id} sx={{ display: 'flex', flexDirection: isAdminMsg ? 'row-reverse' : 'row', mb: 1.5, alignItems: 'flex-start', gap: 1 }}>
                {/* Avatar avec logo ou initiales */}
                <Avatar 
                    src={isAdminSender ? '/logo-bokeland-school-system.png' : (msg.sender_logo && msg.sender_logo !== '/default-logo.png' ? msg.sender_logo : undefined)}
                    sx={{ width: 32, height: 32, fontSize: '0.72rem', bgcolor: color, flexShrink: 0, order: isAdminMsg ? 1 : 0 }}
                >
                    {!isAdminSender && (!msg.sender_logo || msg.sender_logo === '/default-logo.png') ? getInitials(msg.sender_name) : null}
                </Avatar>
                <Box sx={{ maxWidth: '72%' }}>
                    {/* Nom + couronne — TOUJOURS visible */}
                    <Typography sx={{
                        fontSize: '0.7rem',
                        color: isAdminSender ? '#d97706' : color,
                        fontWeight: 700,
                        ml: 1, mb: 0.3,
                        textAlign: isAdminMsg ? 'right' : 'left'
                    }}>
                        {isAdminSender ? '👑 ' : '🏫 '}{msg.sender_name}
                    </Typography>
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
                        {msg.type === 'document' && msg.file_url && !msg.deleted ? (
                            <Box 
                                sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 2, cursor: 'pointer', mb: 0.5, border: '1px solid rgba(0,0,0,0.08)' }}
                                onClick={() => window.open(`${COMMUNITY_SERVER}${msg.file_url!}`, '_blank')}
                            >
                                <InsertDriveFile sx={{ color: '#f44336', fontSize: 28 }} />
                                <Box sx={{ flex: 1, overflow: 'hidden' }}>
                                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }} noWrap>
                                        Document
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: '#1976d2' }}>Télécharger</Typography>
                                </Box>
                            </Box>
                        ) : msg.type === 'image' && msg.file_url && !msg.deleted ? (
                            <img src={`${COMMUNITY_SERVER}${msg.file_url}`} alt="img"
                                style={{ maxWidth: 220, maxHeight: 220, borderRadius: 8, display: 'block', cursor: 'pointer' }}
                                onClick={() => window.open(`${COMMUNITY_SERVER}${msg.file_url!}`, '_blank')}
                            />
                        ) : msg.type === 'audio' && msg.file_url && !msg.deleted ? (
                            <audio controls src={`${COMMUNITY_SERVER}${msg.file_url}`} style={{ maxWidth: 220, height: 36 }} />
                        ) : (msg.type === 'text' || msg.type === 'link') ? (
                            (() => {
                                const isEdited = !msg.deleted && msg.content.endsWith(' (modifié)');
                                const displayContent = isEdited ? msg.content.slice(0, -10) : msg.content;
                                return (
                                    <>
                                        {renderMessageContent(displayContent, msg.deleted)}
                                        {isEdited && (
                                            <Typography sx={{ fontSize: '0.63rem', color: '#aaa', fontStyle: 'italic', mt: 0.2 }}>
                                                modifié
                                            </Typography>
                                        )}
                                    </>
                                );
                            })()
                        ) : null}
                        <Typography sx={{ fontSize: '0.65rem', color: '#999', textAlign: 'right', mt: 0.5 }}>
                            {formatTime(msg.created_at)}
                        </Typography>
                    </Paper>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: isAdminMsg ? 'flex-end' : 'flex-start', mt: 0.5, gap: 0.5 }}>
                        {/* Reactions Bar inside message object */}
                        {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.2, alignSelf: isAdminMsg ? 'flex-end' : 'flex-start' }}>
                                {Object.entries(msg.reactions).map(([ej, users]) => (
                                    <Chip 
                                        key={ej} label={`${ej} ${users.length}`} size="small" 
                                        onClick={() => handleReaction(ej, msg.id)}
                                        sx={{ 
                                            height: 28, fontSize: '0.95rem',
                                            px: 0.5,
                                            bgcolor: users.includes(mySenderKey) ? '#ffe0b2' : 'rgba(255,255,255,0.9)',
                                            border: users.includes(mySenderKey) ? '1.5px solid #d97706' : '1px solid rgba(0,0,0,0.12)',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                            '&:hover': { bgcolor: users.includes(mySenderKey) ? '#ffcc80' : '#f5f5f5', transform: 'scale(1.05)' },
                                            transition: 'all 0.15s ease',
                                            cursor: 'pointer',
                                        }} 
                                    />
                                ))}
                            </Box>
                        )}
                    </Box>
                    {/* Actions admin */}
                    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.3, justifyContent: isAdminMsg ? 'flex-end' : 'flex-start' }}>
                        {!msg.deleted && (
                            <Tooltip title="Réagir">
                                <IconButton size="small" onClick={(e) => { 
                                    setReactionAnchorEl(e.currentTarget); 
                                    setReactionMsgId(msg.id);
                                    reactionMsgRef.current = msg.id;
                                }} sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#1976d2' } }}>
                                    <AddReaction sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!msg.deleted && (
                            <Tooltip title="Répondre">
                                <IconButton size="small" onClick={() => setReplyTo(msg)} sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#1976d2' } }}>
                                    <Reply sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {/* Actions sur ses PROPRES messages (admin) : Modifier + Supprimer */}
                        {!msg.deleted && isAdminMsg && msg.type === 'text' && (
                            <Tooltip title="Modifier ce message">
                                <IconButton size="small" onClick={() => setConfirmDialog({ open: true, type: 'edit', msgId: msg.id, preview: msg.content })}
                                    sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#1976d2' } }}>
                                    <Edit sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {!msg.deleted && isAdminMsg && (
                            <Tooltip title="Supprimer ce message">
                                <IconButton size="small" onClick={() => deleteMessage(msg.id, msg.content)}
                                    sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#f57c00' } }}>
                                    <Delete sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        )}
                        {/* Actions sur les messages des AUTRES : Supprimer + Bannir */}
                        {!msg.deleted && !isAdminMsg && (
                            <>
                                <Tooltip title="Supprimer ce message">
                                    <IconButton size="small" onClick={() => deleteMessage(msg.id, msg.content)}
                                        sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#f57c00' } }}>
                                        <Delete sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Bannir cet établissement">
                                    <IconButton size="small" onClick={() => blockUser(msg.sender_key, msg.sender_name)}
                                        sx={{ color: '#555', opacity: 0.7, '&:hover': { opacity: 1, color: '#d32f2f' } }}>
                                        <Block sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 114px)', bgcolor: '#f0f2f5', borderRadius: 0, borderTop: 'none', overflow: 'hidden' }}>
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
                {/* ── Liste des connectés ──────────────────────────────────────── */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AvatarGroup 
                        max={5} 
                        sx={{ 
                            cursor: 'pointer',
                            '& .MuiAvatar-root': { width: 30, height: 30, fontSize: '0.75rem', borderColor: '#075e54' } 
                        }}
                        onClick={(e) => setOnlineUsersAnchorEl(e.currentTarget)}
                    >
                        {onlineUsers.map((u, i) => (
                            <Tooltip key={i} title={u.senderName}>
                                <Avatar 
                                    src={u.isAdmin ? '/logo-bokeland-school-system.png' : (u.senderLogo && u.senderLogo !== '/default-logo.png' ? u.senderLogo : undefined)}
                                    sx={{ bgcolor: u.isAdmin ? '#d97706' : hashColor(u.senderName) }}
                                >
                                    {!u.isAdmin && (!u.senderLogo || u.senderLogo === '/default-logo.png') ? getInitials(u.senderName) : null}
                                </Avatar>
                            </Tooltip>
                        ))}
                    </AvatarGroup>
                    <Popover
                        open={Boolean(onlineUsersAnchorEl)}
                        anchorEl={onlineUsersAnchorEl}
                        onClose={() => setOnlineUsersAnchorEl(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        PaperProps={{ sx: { width: 280, maxHeight: 400 } }}
                    >
                        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #eee', bgcolor: '#f9f9f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#075e54' }}>
                                Membres en ligne ({onlineCount})
                            </Typography>
                            <IconButton size="small" onClick={() => setOnlineUsersAnchorEl(null)}>
                                <Close sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Box>
                        <List sx={{ p: 0 }}>
                            {onlineUsers.map((u, i) => (
                                <ListItem key={i} divider={i !== onlineUsers.length - 1} sx={{ py: 1 }}>
                                    <ListItemAvatar>
                                        <Avatar 
                                            src={u.isAdmin ? '/logo-bokeland-school-system.png' : (u.senderLogo && u.senderLogo !== '/default-logo.png' ? u.senderLogo : undefined)}
                                            sx={{ bgcolor: u.isAdmin ? '#d97706' : hashColor(u.senderName), width: 36, height: 36, fontSize: '0.85rem' }}
                                        >
                                            {!u.isAdmin && (!u.senderLogo || u.senderLogo === '/default-logo.png') ? getInitials(u.senderName) : null}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                {u.isAdmin && '👑'}
                                                <Typography sx={{ fontWeight: u.senderKey === mySenderKey ? 'bold' : 'normal', fontSize: '0.85rem', color: u.isAdmin ? '#d97706' : '#333' }}>
                                                    {u.senderName} {u.senderKey === mySenderKey ? '(Vous)' : ''}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Typography sx={{ fontSize: '0.7rem', color: '#25d366', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                En ligne
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Popover>
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

            {/* ── Confirmation Dialog ─────────────────────────────────────── */}
            <Dialog open={confirmDialog.open} onClose={handleCancelConfirm} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {confirmDialog.type === 'delete' && <><Delete sx={{ color: 'error.main' }} /> Supprimer le message</>}
                    {confirmDialog.type === 'edit'   && <><Edit sx={{ color: 'primary.main' }} /> Modifier le message</>}
                    {confirmDialog.type === 'block'  && <><Block sx={{ color: 'error.main' }} /> Bannir l’établissement</>}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText component="div">
                        {confirmDialog.type === 'delete' && (
                            <>
                                Êtes-vous sûr(e) de vouloir <strong>supprimer</strong> ce message ?<br />
                                <Box component="span" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary', fontSize: '0.85rem', mt: 1 }}>
                                    « {confirmDialog.preview?.slice(0, 80)}{(confirmDialog.preview?.length ?? 0) > 80 ? '…' : ''} »
                                </Box>
                                <Box component="span" sx={{ display: 'block', color: 'error.main', fontSize: '0.85rem', fontWeight: 600, mt: 1 }}>
                                    ⚠️ Cette action est irréversible.
                                </Box>
                            </>
                        )}
                        {confirmDialog.type === 'edit' && (
                            <>
                                Souhaitez-vous <strong>modifier</strong> ce message ?
                                <Box component="span" sx={{ display: 'block', fontStyle: 'italic', color: 'text.secondary', fontSize: '0.85rem', mt: 1 }}>
                                    « {confirmDialog.preview?.slice(0, 80)}{(confirmDialog.preview?.length ?? 0) > 80 ? '…' : ''} »
                                </Box>
                            </>
                        )}
                        {confirmDialog.type === 'block' && (
                            <>
                                Voulez-vous vraiment <strong>bannir</strong> l’établissement
                                <Box component="span" sx={{ fontWeight: 700, color: 'error.main' }}> « {confirmDialog.senderName} » </Box>
                                de la communauté ?<br />
                                <Box component="span" sx={{ display: 'block', color: 'error.main', fontSize: '0.85rem', fontWeight: 600, mt: 1 }}>
                                    ⚠️ Tous ses messages seront supprimés et il ne pourra plus rejoindre.
                                </Box>
                            </>
                        )}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCancelConfirm} variant="outlined" size="small">Annuler</Button>
                    <Button
                        onClick={handleConfirmAction}
                        variant="contained"
                        color={confirmDialog.type === 'edit' ? 'primary' : 'error'}
                        size="small"
                        autoFocus
                    >
                        {confirmDialog.type === 'delete' && 'Oui, supprimer'}
                        {confirmDialog.type === 'edit'   && 'Oui, modifier'}
                        {confirmDialog.type === 'block'  && 'Oui, bannir'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ── Menu Reactions ────────────────────────────────────────────── */}
            <Popover 
                anchorEl={reactionAnchorEl} open={Boolean(reactionAnchorEl)} 
                onClose={() => { setReactionAnchorEl(null); }}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                PaperProps={{ sx: { p: 1, display: 'flex', gap: 1, borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' } }}
            >
                {QUICK_REACTIONS.map(ej => (
                    <IconButton key={ej} size="small" 
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleReaction(ej)}
                        sx={{ opacity: 1, transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.3)' } }}
                    >
                        <Typography sx={{ 
                            fontSize: '1.5rem', 
                            opacity: 1, 
                            color: '#000', 
                            fontFamily: '"Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif' 
                        }}>{ej}</Typography>
                    </IconButton>
                ))}
            </Popover>

            {/* Reply / Edit preview */}
            {(replyTo || editingMessage) && (
                <Box sx={{ bgcolor: '#fff3e0', px: 2, py: 0.8, display: 'flex', alignItems: 'center', gap: 1, borderTop: '1px solid #ffe0b2' }}>
                    {editingMessage ? <Edit sx={{ fontSize: 16, color: '#d97706' }} /> : <Reply sx={{ fontSize: 16, color: '#d97706' }} />}
                    <Typography sx={{ fontSize: '0.8rem', flex: 1, color: '#444' }} noWrap>
                        {editingMessage
                            ? `✏️ Modification : ${editingMessage.content.replace(' (modifié)', '')}`
                            : `↩ ${replyTo?.sender_name} : ${replyTo?.content}`}
                    </Typography>
                    <IconButton size="small" onClick={() => { setReplyTo(null); setEditingMessage(null); setText(''); }}>
                        <Close sx={{ fontSize: 16 }} />
                    </IconButton>
                </Box>
            )}

            {/* Zone de saisie */}
            <Box sx={{ bgcolor: '#f0f2f5', px: 1.5, py: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                
                <input type="file" accept="image/*,video/*" ref={photoInputRef} style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />
                <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" ref={docInputRef} style={{ display: 'none' }}
                    onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} />

                <Tooltip title="Joindre un fichier">
                    <IconButton size="small" onClick={(e) => setAttachmentAnchorEl(e.currentTarget)} disabled={!connected} sx={{ p: 0.5 }}>
                        <Add sx={{ color: '#54656f', fontSize: 28 }} />
                    </IconButton>
                </Tooltip>

                <Menu 
                    anchorEl={attachmentAnchorEl} open={Boolean(attachmentAnchorEl)} onClose={() => setAttachmentAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    PaperProps={{ sx: { bgcolor: '#1e2028', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 3, minWidth: 230, mb: 1, boxShadow: '0 8px 30px rgba(0,0,0,0.5)' } }}
                >
                    <MenuItem onClick={() => { photoInputRef.current?.click(); setAttachmentAnchorEl(null); }} sx={{ py: 1.2, '&:hover': { bgcolor: 'rgba(124, 110, 241, 0.15)' } }}>
                        <InsertPhoto sx={{ color: '#60a5fa', mr: 2 }} />
                        <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>Photos & vidéos</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { docInputRef.current?.click(); setAttachmentAnchorEl(null); }} sx={{ py: 1.2, '&:hover': { bgcolor: 'rgba(124, 110, 241, 0.15)' } }}>
                        <Description sx={{ color: '#c084fc', mr: 2 }} />
                        <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>Document</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { setAttachmentAnchorEl(null); setIsScheduleModalOpen(true); }} sx={{ py: 1.2, '&:hover': { bgcolor: 'rgba(124, 110, 241, 0.15)' } }}>
                        <VideoCall sx={{ color: '#34d399', mr: 2 }} />
                        <Typography sx={{ color: '#ffffff', fontWeight: 600, fontSize: '0.88rem' }}>Programmer une réunion</Typography>
                    </MenuItem>
                </Menu>

                <Tooltip title="Emojis">
                    <IconButton size="small" onClick={(e) => setEmojiAnchorEl(e.currentTarget)} disabled={!connected} sx={{ p: 0.5 }}>
                        <EmojiEmotions sx={{ color: '#54656f', fontSize: 26 }} />
                    </IconButton>
                </Tooltip>
                
                <Popover
                    open={Boolean(emojiAnchorEl)} anchorEl={emojiAnchorEl} onClose={() => setEmojiAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }} transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <EmojiPicker onEmojiClick={(e) => setText(prev => prev + e.emoji)} />
                </Popover>

                <TextField
                    fullWidth size="small" multiline maxRows={4}
                    placeholder={connected ? 'Écrire un message…' : 'Hors ligne…'}
                    value={text}
                    onChange={e => handleTyping(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    disabled={!connected}
                    sx={{
                        bgcolor: '#fff',
                        borderRadius: 6,
                        '& .MuiOutlinedInput-root': { borderRadius: 6, fieldset: { border: 'none' } },
                        '& .MuiInputBase-input': { color: '#1a1a1a' },
                        '& .MuiInputBase-input::placeholder': { color: '#888', opacity: 1 },
                    }}
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

            {/* Schedule Meeting Modal */}
            <ScheduleMeetingModal
                open={isScheduleModalOpen}
                onClose={() => setIsScheduleModalOpen(false)}
                onSchedule={handleScheduleMeeting}
                communityServerUrl={COMMUNITY_SERVER}
            />
        </Box>
    );
};

export default CommunautePageAdmin;
