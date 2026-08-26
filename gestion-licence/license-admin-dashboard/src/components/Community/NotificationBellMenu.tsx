import React, { useState } from 'react';
import {
    IconButton,
    Badge,
    Popover,
    Box,
    Typography,
    Button,
    List,
    ListItem,
    Divider,
    Chip,
    Tooltip,
} from '@mui/material';
import { Notifications, EventAvailable, AccessTime, CheckCircle, Cancel, Public } from '@mui/icons-material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface MeetingNotif {
    meeting_id: string;
    initiator_key: string;
    initiator_name: string;
    title: string;
    scheduled_at_gmt: string;
}

interface NotificationBellMenuProps {
    notifications: MeetingNotif[];
    onReject: (meetingId: string) => void;
    onAccept: (meeting: MeetingNotif) => void;
}

export const NotificationBellMenu: React.FC<NotificationBellMenuProps> = ({
    notifications,
    onReject,
    onAccept,
}) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    const triggerAudioAlert = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime);
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.8);
        } catch {
            // Audio fallback
        }
    };

    const handleAcceptClick = (notif: MeetingNotif) => {
        onAccept(notif);
        triggerAudioAlert();
    };

    return (
        <>
            <Tooltip title="Notifications de Réunions">
                <IconButton onClick={handleClick} sx={{ color: '#7C6EF1', bgcolor: 'rgba(124, 110, 241, 0.15)', '&:hover': { bgcolor: 'rgba(124, 110, 241, 0.3)' } }}>
                    <Badge badgeContent={notifications.length} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: { width: 380, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', p: 1, bgcolor: '#1a1d24', color: '#fff' }
                }}
            >
                <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#7C6EF1' }}>
                        Notifications ({notifications.length})
                    </Typography>
                    <Chip label="GMT Auto Convert" size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                </Box>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                <List sx={{ maxHeight: 360, overflowY: 'auto', p: 0 }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ p: 3, textAlign: 'center' }}>
                            <EventAvailable sx={{ color: '#aaa', fontSize: 40, mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                                Aucune notification de réunion en attente.
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notif) => {
                            const gmtDate = dayjs.utc(notif.scheduled_at_gmt);
                            const localDateStr = gmtDate.local().format('DD/MM/YYYY à HH:mm');
                            const gmtDateStr = gmtDate.format('DD/MM/YYYY à HH:mm [GMT]');

                            return (
                                <ListItem
                                    key={notif.meeting_id}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                        p: 1.5,
                                        borderBottom: '1px solid rgba(255,255,255,0.08)',
                                        '&:last-child': { borderBottom: 'none' }
                                    }}
                                >
                                    <Box sx={{ width: '100%', mb: 1 }}>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#fff' }}>
                                            {notif.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" display="block">
                                            Créée par : <strong>{notif.initiator_name}</strong>
                                        </Typography>

                                        <Box sx={{ mt: 1, p: 1, bgcolor: 'rgba(124, 110, 241, 0.1)', borderRadius: 1.5, borderLeft: '3px solid #7C6EF1' }}>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#7C6EF1', fontWeight: 700 }}>
                                                <AccessTime fontSize="inherit" /> Votre zone locale : {localDateStr}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#aaa', mt: 0.3 }}>
                                                <Public fontSize="inherit" /> Format initial GMT : {gmtDateStr}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end', mt: 0.5 }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            color="error"
                                            startIcon={<Cancel fontSize="small" />}
                                            onClick={() => onReject(notif.meeting_id)}
                                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.78rem' }}
                                        >
                                            Rejeter
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            startIcon={<CheckCircle fontSize="small" />}
                                            onClick={() => handleAcceptClick(notif)}
                                            sx={{ borderRadius: 2, textTransform: 'none', fontSize: '0.78rem', bgcolor: '#34d399', '&:hover': { bgcolor: '#059669' } }}
                                        >
                                            Valider
                                        </Button>
                                    </Box>
                                </ListItem>
                            );
                        })
                    )}
                </List>
            </Popover>
        </>
    );
};
