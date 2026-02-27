import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Grid, Typography, Button, Box, MenuItem, TextField,
    Checkbox, List, ListItem, ListItemText, ListItemIcon, ListItemButton,
    Paper, LinearProgress, Alert
} from '@mui/material';
import api from '../services/api';
import { useSchoolYear } from '../contexts/SchoolYearContext';
import { useTranslation } from 'react-i18next';

interface StaffTransferModalProps {
    open: boolean;
    onClose: () => void;
}

const StaffTransferModal: React.FC<StaffTransferModalProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const { currentYear } = useSchoolYear();

    // Source State
    const [sourceStaff, setSourceStaff] = useState<any[]>([]);
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Destination State
    const [years, setYears] = useState<any[]>([]);
    const [destYearId, setDestYearId] = useState<string>('');
    const [destStaff, setDestStaff] = useState<any[]>([]);

    // UI/Loading State
    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initial Data Load
    useEffect(() => {
        if (open) {
            fetchInitialData();
            fetchYears();
        }
    }, [open, currentYear]);

    const fetchInitialData = async () => {
        try {
            const response = await api.get('/staff');
            setSourceStaff(response.data);
        } catch (error) {
            console.error('Error fetching source staff', error);
        }
    };

    const fetchYears = async () => {
        try {
            const res = await api.get('/school-years');
            setYears(res.data);
        } catch (e) { console.error(e); }
    };

    // Fetch Destination Staff when Year Changes
    useEffect(() => {
        if (!destYearId) {
            setDestStaff([]);
            return;
        }
        const fetchDestStaff = async () => {
            try {
                const res = await api.get('/staff', {
                    headers: { 'x-school-year-id': destYearId }
                });
                setDestStaff(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDestStaff();
    }, [destYearId]);

    // Selection Logic
    const handleToggleStaff = (id: number) => {
        setSelectedStaffIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedStaffIds([]);
        } else {
            setSelectedStaffIds(sourceStaff.map(s => s.id));
        }
        setSelectAll(!selectAll);
    };

    // Update selectAll checkbox when individual selections change
    useEffect(() => {
        if (sourceStaff.length > 0 && selectedStaffIds.length === sourceStaff.length) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedStaffIds, sourceStaff]);

    // Transfer Action
    const handleTransfer = async () => {
        if (!destYearId || selectedStaffIds.length === 0) return;

        setTransferring(true);
        setMessage(null);

        try {
            const payload = {
                staffIds: selectedStaffIds,
                destYearId: destYearId
            };

            const res = await api.post('/staff/action/transfer', payload);

            setMessage({ type: 'success', text: `${t('dashboard.transferModals.messages.success')} ${res.data.count} ${t('dashboard.sidebar.staff').toLowerCase()} transféré(s).` });

            // Refresh Destination List
            const destRes = await api.get('/staff', {
                headers: { 'x-school-year-id': destYearId }
            });

            setDestStaff(destRes.data);
            setSelectedStaffIds([]);
            setSelectAll(false);

        } catch (error) {
            setMessage({ type: 'error', text: t('dashboard.transferModals.messages.error') });
            console.error(error);
        } finally {
            setTransferring(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <DialogTitle>{t('dashboard.transferModals.titles.staff')}</DialogTitle>
            <DialogContent dividers>
                {transferring && <LinearProgress sx={{ mb: 2 }} />}
                {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}

                <Grid container spacing={3} sx={{ height: '600px' }}>

                    {/* LEFT: SOURCE */}
                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Typography variant="h6" gutterBottom>{t('dashboard.transferModals.source')}</Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('dashboard.transferModals.select.staff')}</Typography>
                        </Box>

                        {/* Select All Checkbox */}
                        <Box sx={{ mb: 1 }}>
                            <ListItem disablePadding sx={{ borderBottom: '1px solid #ddd', bgcolor: '#f5f5f5' }}>
                                <ListItemButton onClick={handleSelectAll}>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={selectAll}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={t('dashboard.transferModals.select.allStaff')} primaryTypographyProps={{ fontWeight: 'bold' }} />
                                </ListItemButton>
                            </ListItem>
                        </Box>

                        {/* Staff List */}
                        <Paper sx={{ flexGrow: 1, overflow: 'auto', border: '1px solid #ddd' }}>
                            <List dense>
                                {sourceStaff.map((staff) => (
                                    <ListItem
                                        key={staff.id}
                                        disablePadding
                                        sx={{ borderBottom: '1px solid #eee' }}
                                    >
                                        <ListItemButton onClick={() => handleToggleStaff(staff.id)}>
                                            <ListItemIcon>
                                                <Checkbox
                                                    edge="start"
                                                    checked={selectedStaffIds.includes(staff.id)}
                                                    tabIndex={-1}
                                                    disableRipple
                                                />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={`${staff.nom} ${staff.prenom}`}
                                                secondary={`${staff.titre} - ${staff.email || staff.tel}`}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                                {sourceStaff.length === 0 && !loading && (
                                    <Typography sx={{ p: 2, color: 'text.secondary' }}>{t('dashboard.transferModals.empty.staff')}</Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>

                    {/* RIGHT: DESTINATION */}
                    <Grid size={{ xs: 6 }} sx={{ display: 'flex', flexDirection: 'column', height: '100%', borderLeft: '1px solid #eee', pl: 3 }}>
                        <Typography variant="h6" gutterBottom>{t('dashboard.transferModals.destination')}</Typography>

                        <Box sx={{ mb: 2 }}>
                            <TextField
                                select
                                label={t('dashboard.transferModals.schoolYear')}
                                fullWidth
                                value={destYearId}
                                onChange={(e) => setDestYearId(e.target.value)}
                            >
                                {years.map((y) => (
                                    <MenuItem key={y.id} value={y.id}>{y.name}</MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('dashboard.transferModals.destinationLabel.staff')}</Typography>

                        <Paper sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#f5f5f5', border: '1px solid #ddd' }}>
                            <List dense>
                                {destStaff.map((staff, idx) => (
                                    <ListItem key={staff.id || idx} sx={{
                                        borderBottom: '1px solid #eee'
                                    }}>
                                        <ListItemText
                                            primary={`${staff.nom} ${staff.prenom}`}
                                            secondary={`${staff.titre} - ${staff.email || staff.tel}`}
                                        />
                                    </ListItem>
                                ))}
                                {destStaff.length === 0 && (
                                    <Typography sx={{ p: 2, color: 'text.secondary' }}>{t('dashboard.transferModals.empty.staff')}</Typography>
                                )}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('dashboard.transferModals.cancel')}</Button>
                <Button
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={transferring || selectedStaffIds.length === 0 || !destYearId}
                >
                    {t('dashboard.transferModals.validate')} {selectedStaffIds.length > 0 && `(${selectedStaffIds.length})`}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StaffTransferModal;
