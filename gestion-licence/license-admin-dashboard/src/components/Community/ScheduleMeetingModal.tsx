import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    Checkbox,
    FormControlLabel,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    CircularProgress,
    InputAdornment,
    Divider,
    IconButton,
    Chip,
} from '@mui/material';
import {
    VideoCall,
    Search,
    Close,
    SelectAll,
    AccessTime,
    Public,
} from '@mui/icons-material';
import dayjs from 'dayjs';

interface Establishment {
    email: string;
    name: string;
    logo_url?: string | null;
}

interface ScheduleMeetingModalProps {
    open: boolean;
    onClose: () => void;
    onSchedule: (meetingData: { title: string; scheduledAtGmt: string; targetEmails: string[] }) => void;
    communityServerUrl: string;
}

export const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({
    open,
    onClose,
    onSchedule,
    communityServerUrl,
}) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));
    const [time, setTime] = useState('14:00');
    const [establishments, setEstablishments] = useState<Establishment[]>([]);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (open) {
            fetchEstablishments();
        }
    }, [open]);

    const fetchEstablishments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${communityServerUrl}/api/community/establishments`);
            if (res.ok) {
                const data: Establishment[] = await res.json();
                setEstablishments(data);
            }
        } catch (err) {
            console.error('Failed to fetch establishments:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleSelect = (email: string) => {
        if (selectedEmails.includes(email)) {
            setSelectedEmails(selectedEmails.filter((e) => e !== email));
            setSelectAll(false);
        } else {
            const next = [...selectedEmails, email];
            setSelectedEmails(next);
            if (next.length === filteredEstablishments.length) {
                setSelectAll(true);
            }
        }
    };

    const handleSelectAllToggle = () => {
        if (selectAll) {
            setSelectedEmails([]);
            setSelectAll(false);
        } else {
            const allEmails = filteredEstablishments.map((e) => e.email);
            setSelectedEmails(allEmails);
            setSelectAll(true);
        }
    };

    const handleSubmit = () => {
        if (!title.trim()) return;

        const combinedDateTime = `${date}T${time}:00Z`;

        onSchedule({
            title: title.trim(),
            scheduledAtGmt: combinedDateTime,
            targetEmails: selectAll ? ['ALL'] : selectedEmails,
        });

        setTitle('');
        setSelectedEmails([]);
        setSelectAll(false);
        onClose();
    };

    const filteredEstablishments = establishments.filter(
        (e) =>
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, p: 1, maxHeight: '90vh', bgcolor: '#1a1d24', color: '#fff' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <VideoCall sx={{ color: '#7C6EF1', fontSize: 32 }} />
                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#7C6EF1' }}>
                        Programmer une réunion en ligne
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small" sx={{ color: '#aaa' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

            <DialogContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        label="Titre de la réunion"
                        placeholder="Ex: Réunion de présentation des nouvelles fonctionnalités"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        required
                        sx={{ input: { color: 'white' }, label: { color: '#aaa' } }}
                    />

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{ input: { color: 'white' }, label: { color: '#aaa' } }}
                        />
                        <TextField
                            label="Heure (Format GMT)"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccessTime fontSize="small" sx={{ color: '#aaa' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ input: { color: 'white' }, label: { color: '#aaa' } }}
                        />
                    </Box>

                    <Chip
                        icon={<Public fontSize="small" />}
                        label="L'heure choisie est en Format GMT. Les participants convertiront selon leur fuseau horaire local."
                        color="info"
                        variant="outlined"
                        sx={{ fontSize: '0.78rem', py: 0.5 }}
                    />

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                Sélectionner les établissements participants :
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={selectAll}
                                        onChange={handleSelectAllToggle}
                                        icon={<SelectAll sx={{ color: '#aaa' }} />}
                                        checkedIcon={<SelectAll sx={{ color: '#7C6EF1' }} />}
                                    />
                                }
                                label={<Typography variant="caption" sx={{ fontWeight: 700 }}>Tout sélectionner</Typography>}
                            />
                        </Box>

                        <TextField
                            size="small"
                            placeholder="Rechercher un établissement..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search fontSize="small" sx={{ color: '#aaa' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 1, input: { color: 'white' } }}
                        />

                        <Box
                            sx={{
                                maxHeight: 440,
                                overflowY: 'auto',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 2,
                                bgcolor: '#12141a',
                                '&::-webkit-scrollbar': { width: '6px' },
                                '&::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.05)', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb': { background: '#7C6EF1', borderRadius: '4px' },
                                '&::-webkit-scrollbar-thumb:hover': { background: '#6859d3' },
                            }}
                        >
                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress size={28} />
                                </Box>
                            ) : filteredEstablishments.length === 0 ? (
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', py: 3 }}>
                                    Aucun établissement trouvé.
                                </Typography>
                            ) : (
                                <List disablePadding>
                                    {filteredEstablishments.map((est) => {
                                        const isChecked = selectedEmails.includes(est.email);
                                        return (
                                            <ListItem
                                                key={est.email}
                                                onClick={() => handleToggleSelect(est.email)}
                                                sx={{ py: 0.5, borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}
                                            >
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <Checkbox
                                                        edge="start"
                                                        checked={isChecked}
                                                        tabIndex={-1}
                                                        disableRipple
                                                        size="small"
                                                        sx={{ color: '#aaa', '&.Mui-checked': { color: '#7C6EF1' } }}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={est.name}
                                                    secondary={est.email}
                                                    primaryTypographyProps={{ fontSize: '0.82rem', fontWeight: 600, color: 'white' }}
                                                    secondaryTypographyProps={{ fontSize: '0.74rem', color: '#aaa' }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2, color: '#aaa', borderColor: '#aaa' }}>
                    Annuler
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!title.trim() || (!selectAll && selectedEmails.length === 0)}
                    sx={{ bgcolor: '#7C6EF1', color: 'white', borderRadius: 2, '&:hover': { bgcolor: '#6859d3' } }}
                >
                    Valider et envoyer
                </Button>
            </DialogActions>
        </Dialog>
    );
};
