import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Avatar,
    Paper,
    TextField,
    Button,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Badge,
    Chip,
} from '@mui/material';
import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
    ScreenShare,
    StopScreenShare,
    Chat,
    PanTool,
    CallEnd,
    People,
    Send,
    Close,
    Warning,
} from '@mui/icons-material';
import { Socket } from 'socket.io-client';

interface Participant {
    socketId: string;
    senderKey: string;
    senderName: string;
    senderLogo?: string | null;
    isHandRaised?: boolean;
    stream?: MediaStream;
}

interface ChatMessage {
    senderKey: string;
    senderName: string;
    message: string;
    timestamp: string;
}

interface OnlineMeetingRoomProps {
    open: boolean;
    onClose: () => void;
    socket: Socket | null;
    meetingId: string;
    meetingTitle: string;
    currentUserKey: string;
    currentUserName: string;
    currentUserLogo?: string | null;
    isHost: boolean;
}

export const OnlineMeetingRoom: React.FC<OnlineMeetingRoomProps> = ({
    open,
    onClose,
    socket,
    meetingId,
    meetingTitle,
    currentUserKey,
    currentUserName,
    currentUserLogo,
    isHost,
}) => {
    const [isMicOn, setIsMicOn] = useState(true);
    const [isCamOn, setIsCamOn] = useState(true);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isHandRaised, setIsHandRaised] = useState(false);
    const [activeTab, setActiveTab] = useState<'people' | 'chat' | null>('people');
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [confirmDisconnectOpen, setConfirmDisconnectOpen] = useState(false);

    const localStreamRef = useRef<MediaStream | null>(null);
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const screenStreamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        if (open && socket) {
            initializeLocalMedia();
            socket.emit('join_meeting_room', { meetingId, participantLogo: currentUserLogo });

            socket.on('user_joined_meeting', (data: any) => {
                setParticipants((prev) => {
                    if (prev.some((p) => p.senderKey === data.senderKey)) return prev;
                    return [...prev, data];
                });
            });

            socket.on('participant_hand_raised', (data: any) => {
                setParticipants((prev) =>
                    prev.map((p) =>
                        p.senderKey === data.senderKey ? { ...p, isHandRaised: data.isHandRaised } : p
                    )
                );
            });

            socket.on('new_meeting_chat_message', (data: ChatMessage) => {
                setChatMessages((prev) => [...prev, data]);
            });

            socket.on('user_left_meeting', (data: any) => {
                setParticipants((prev) => prev.filter((p) => p.senderKey !== data.senderKey));
            });

            socket.on('meeting_cancelled_by_host', (data: any) => {
                alert(data.message || "L'initiateur a annulé la réunion.");
                cleanupAndClose();
            });

            return () => {
                socket.off('user_joined_meeting');
                socket.off('participant_hand_raised');
                socket.off('new_meeting_chat_message');
                socket.off('user_left_meeting');
                socket.off('meeting_cancelled_by_host');
            };
        }
    }, [open, socket, meetingId]);

    const initializeLocalMedia = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.warn('Media devices not fully available:', err);
        }
    };

    const toggleMic = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !isMicOn;
                setIsMicOn(!isMicOn);
            }
        } else {
            setIsMicOn(!isMicOn);
        }
    };

    const toggleCam = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !isCamOn;
                setIsCamOn(!isCamOn);
            }
        } else {
            setIsCamOn(!isCamOn);
        }
    };

    const toggleScreenShare = async () => {
        if (isScreenSharing) {
            if (screenStreamRef.current) {
                screenStreamRef.current.getTracks().forEach((track) => track.stop());
                screenStreamRef.current = null;
            }
            setIsScreenSharing(false);
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                screenStreamRef.current = screenStream;
                setIsScreenSharing(true);
                screenStream.getVideoTracks()[0].onended = () => {
                    setIsScreenSharing(false);
                };
            } catch (err) {
                console.error('Screen sharing error:', err);
            }
        }
    };

    const toggleHandRaise = () => {
        const nextState = !isHandRaised;
        setIsHandRaised(nextState);
        if (socket) {
            socket.emit('meeting_raise_hand', { meetingId, isHandRaised: nextState });
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !socket) return;
        socket.emit('meeting_chat_message', { meetingId, message: newMessage.trim() });
        setNewMessage('');
    };

    const handleEmojiClick = (emoji: string) => {
        setNewMessage((prev) => prev + emoji);
    };

    const confirmLeaveMeeting = () => {
        if (socket) {
            socket.emit('leave_meeting_room', { meetingId, isHost });
        }
        cleanupAndClose();
    };

    const cleanupAndClose = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((t) => t.stop());
            localStreamRef.current = null;
        }
        if (screenStreamRef.current) {
            screenStreamRef.current.getTracks().forEach((t) => t.stop());
            screenStreamRef.current = null;
        }
        setConfirmDisconnectOpen(false);
        onClose();
    };

    const allJoined = [
        {
            socketId: 'self',
            senderKey: currentUserKey,
            senderName: `${currentUserName} (Vous)`,
            senderLogo: currentUserLogo,
            isHandRaised,
        },
        ...participants,
    ];

    return (
        <Dialog fullScreen open={open} onClose={() => setConfirmDisconnectOpen(true)} PaperProps={{ sx: { bgcolor: '#202124', color: 'white' } }}>
            {/* Header Bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 1.5, bgcolor: '#171717', borderBottom: '1px solid #333' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#9c27b0' }}>
                        {meetingTitle || 'Réunion en ligne'}
                    </Typography>
                    {isHost && <Chip label="Hôte" size="small" color="secondary" sx={{ fontWeight: 'bold' }} />}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton color={activeTab === 'people' ? 'secondary' : 'default'} onClick={() => setActiveTab(activeTab === 'people' ? null : 'people')}>
                        <Badge badgeContent={allJoined.length} color="secondary">
                            <People sx={{ color: activeTab === 'people' ? '#ab47bc' : 'white' }} />
                        </Badge>
                    </IconButton>
                    <IconButton color={activeTab === 'chat' ? 'secondary' : 'default'} onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}>
                        <Badge badgeContent={chatMessages.length} color="primary">
                            <Chat sx={{ color: activeTab === 'chat' ? '#ab47bc' : 'white' }} />
                        </Badge>
                    </IconButton>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', height: 'calc(100vh - 140px)', position: 'relative' }}>
                {/* Video Tiles Grid */}
                <Box
                    sx={{
                        flex: 1,
                        p: 2,
                        display: 'grid',
                        gridTemplateColumns: allJoined.length === 1 ? '1fr' : allJoined.length <= 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
                        gap: 2,
                        alignItems: 'center',
                        justifyItems: 'center',
                        overflowY: 'auto',
                    }}
                >
                    {allJoined.map((p) => (
                        <Paper
                            key={p.senderKey}
                            elevation={4}
                            sx={{
                                width: '100%',
                                height: '100%',
                                minHeight: 220,
                                maxHeight: 420,
                                bgcolor: '#3c4043',
                                borderRadius: 3,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                border: p.isHandRaised ? '3px solid #ffb74d' : '1px solid #5f6368',
                            }}
                        >
                            {p.socketId === 'self' && isCamOn ? (
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <Avatar
                                    src={p.senderLogo || undefined}
                                    sx={{ width: 90, height: 90, fontSize: '2.5rem', bgcolor: '#7C6EF1', border: '3px solid white' }}
                                >
                                    {p.senderName.charAt(0)}
                                </Avatar>
                            )}

                            {/* Participant Label */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 12,
                                    left: 12,
                                    bgcolor: 'rgba(0,0,0,0.65)',
                                    backdropFilter: 'blur(4px)',
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                }}
                            >
                                <Typography variant="caption" sx={{ color: 'white', fontWeight: 600 }}>
                                    {p.senderName}
                                </Typography>
                                {p.isHandRaised && <PanTool sx={{ color: '#ffb74d', fontSize: 16 }} />}
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Right Side Panel (People / Chat) */}
                {activeTab && (
                    <Paper
                        elevation={6}
                        sx={{
                            width: 340,
                            bgcolor: '#28292c',
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            borderLeft: '1px solid #3c4043',
                        }}
                    >
                        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #3c4043' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                {activeTab === 'people' ? `Participants (${allJoined.length})` : 'Tchat de réunion'}
                            </Typography>
                            <IconButton size="small" onClick={() => setActiveTab(null)} sx={{ color: 'white' }}>
                                <Close />
                            </IconButton>
                        </Box>

                        {activeTab === 'people' ? (
                            <List sx={{ flex: 1, overflowY: 'auto' }}>
                                {allJoined.map((p) => (
                                    <ListItem key={p.senderKey} sx={{ borderBottom: '1px solid #333' }}>
                                        <ListItemAvatar>
                                            <Avatar src={p.senderLogo || undefined} sx={{ bgcolor: '#7C6EF1' }}>
                                                {p.senderName.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={p.senderName}
                                            secondary={p.isHandRaised ? '✋ Main levée' : 'En réunion'}
                                            primaryTypographyProps={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}
                                            secondaryTypographyProps={{ color: p.isHandRaised ? '#ffb74d' : '#aaa', fontSize: '0.75rem' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {chatMessages.map((msg, idx) => (
                                        <Box key={idx} sx={{ bgcolor: msg.senderKey === currentUserKey ? '#4a148c' : '#3c4043', p: 1.5, borderRadius: 2 }}>
                                            <Typography variant="caption" sx={{ fontWeight: 700, color: '#ce93d8', display: 'block' }}>
                                                {msg.senderName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'white', mt: 0.3 }}>
                                                {msg.message}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>

                                {/* Quick Emojis & Input */}
                                <Box sx={{ p: 1.5, borderTop: '1px solid #3c4043', bgcolor: '#1f2022' }}>
                                    <Box sx={{ display: 'flex', gap: 0.8, mb: 1 }}>
                                        {['👍', '👏', '❤️', '😊', '🎉', '🙋‍♂️'].map((emoji) => (
                                            <IconButton key={emoji} size="small" onClick={() => handleEmojiClick(emoji)} sx={{ bgcolor: '#333' }}>
                                                <Typography variant="body2">{emoji}</Typography>
                                            </IconButton>
                                        ))}
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <TextField
                                            size="small"
                                            placeholder="Envoyer un message..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            fullWidth
                                            sx={{ bgcolor: '#333', borderRadius: 1, input: { color: 'white' } }}
                                        />
                                        <IconButton color="secondary" onClick={handleSendMessage} sx={{ bgcolor: '#7b1fa2' }}>
                                            <Send />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Paper>
                )}
            </Box>

            {/* Bottom Control Bar */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 80,
                    bgcolor: '#171717',
                    borderTop: '1px solid #333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2.5,
                    zIndex: 10,
                }}
            >
                {/* 1. Micro */}
                <Tooltip title={isMicOn ? 'Désactiver le micro' : 'Activer le micro'}>
                    <IconButton
                        onClick={toggleMic}
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: isMicOn ? '#3c4043' : '#ea4335',
                            color: 'white',
                            '&:hover': { bgcolor: isMicOn ? '#505458' : '#d93025' },
                        }}
                    >
                        {isMicOn ? <Mic /> : <MicOff />}
                    </IconButton>
                </Tooltip>

                {/* 2. Camera */}
                <Tooltip title={isCamOn ? 'Désactiver la caméra' : 'Activer la caméra'}>
                    <IconButton
                        onClick={toggleCam}
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: isCamOn ? '#3c4043' : '#ea4335',
                            color: 'white',
                            '&:hover': { bgcolor: isCamOn ? '#505458' : '#d93025' },
                        }}
                    >
                        {isCamOn ? <Videocam /> : <VideocamOff />}
                    </IconButton>
                </Tooltip>

                {/* 3. Screen Share */}
                <Tooltip title={isScreenSharing ? 'Arrêter le partage' : 'Partager votre écran'}>
                    <IconButton
                        onClick={toggleScreenShare}
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: isScreenSharing ? '#1a73e8' : '#3c4043',
                            color: 'white',
                            '&:hover': { bgcolor: isScreenSharing ? '#1557b0' : '#505458' },
                        }}
                    >
                        {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
                    </IconButton>
                </Tooltip>

                {/* 4. Chat & Emoji */}
                <Tooltip title="Tchat & Émoticônes">
                    <IconButton
                        onClick={() => setActiveTab(activeTab === 'chat' ? null : 'chat')}
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: activeTab === 'chat' ? '#ab47bc' : '#3c4043',
                            color: 'white',
                            '&:hover': { bgcolor: '#8e24aa' },
                        }}
                    >
                        <Chat />
                    </IconButton>
                </Tooltip>

                {/* 5. Raised Hand */}
                <Tooltip title={isHandRaised ? 'Baisser la main' : 'Lever la main'}>
                    <IconButton
                        onClick={toggleHandRaise}
                        sx={{
                            width: 50,
                            height: 50,
                            bgcolor: isHandRaised ? '#ffb74d' : '#3c4043',
                            color: isHandRaised ? '#000' : 'white',
                            '&:hover': { bgcolor: '#ffa726' },
                        }}
                    >
                        <PanTool />
                    </IconButton>
                </Tooltip>

                {/* 6. Leave Meeting */}
                <Tooltip title="Quitter la réunion">
                    <IconButton
                        onClick={() => setConfirmDisconnectOpen(true)}
                        sx={{
                            width: 56,
                            height: 56,
                            bgcolor: '#ea4335',
                            color: 'white',
                            '&:hover': { bgcolor: '#d93025' },
                        }}
                    >
                        <CallEnd />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Disconnect Confirmation Dialog */}
            <Dialog open={confirmDisconnectOpen} onClose={() => setConfirmDisconnectOpen(false)} PaperProps={{ sx: { borderRadius: 3, p: 1, bgcolor: '#1a1d24', color: 'white' } }}>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#f87171' }}>
                    <Warning color="error" />
                    Quitter la réunion
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">
                        {isHost
                            ? "Voulez-vous vraiment quitter la réunion ? En tant qu'initiateur, quitter cette réunion l'annulera pour tous les participants."
                            : "Voulez-vous vraiment vous déconnecter de cette réunion en ligne ?"}
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setConfirmDisconnectOpen(false)} variant="outlined" sx={{ color: '#aaa', borderColor: '#aaa' }}>
                        Annuler
                    </Button>
                    <Button onClick={confirmLeaveMeeting} variant="contained" color="error" sx={{ bgcolor: '#ea4335' }}>
                        Quitter
                    </Button>
                </DialogActions>
            </Dialog>
        </Dialog>
    );
};
