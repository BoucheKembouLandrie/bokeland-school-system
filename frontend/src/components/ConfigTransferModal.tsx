import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Typography, Button, Box, MenuItem, TextField,
    Alert, CircularProgress
} from '@mui/material';
import { Settings } from '@mui/icons-material';
import api from '../services/api';
import { useSchoolYear } from '../contexts/SchoolYearContext';
import { useTranslation } from 'react-i18next';

interface ConfigTransferModalProps {
    open: boolean;
    onClose: () => void;
}

const ConfigTransferModal: React.FC<ConfigTransferModalProps> = ({ open, onClose }) => {
    const { t } = useTranslation();
    const { currentYear } = useSchoolYear();

    const [years, setYears] = useState<any[]>([]);
    const [sourceYearId, setSourceYearId] = useState<string>('');
    const [targetYearId, setTargetYearId] = useState<string>('');
    const [configCount, setConfigCount] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [transferring, setTransferring] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Load years and set current year as source
    useEffect(() => {
        if (open) {
            fetchYears();
            if (currentYear) {
                setSourceYearId(currentYear.id.toString());
            }
            setMessage(null);
        }
    }, [open, currentYear]);

    // Fetch configuration count when source year changes
    useEffect(() => {
        if (sourceYearId) {
            fetchConfigCount();
        }
    }, [sourceYearId]);

    const fetchYears = async () => {
        try {
            const res = await api.get('/school-years');
            setYears(res.data);
        } catch (error) {
            console.error('Error fetching years:', error);
        }
    };

    const fetchConfigCount = async () => {
        try {
            setLoading(true);
            const res = await api.get('/exam-rules', {
                headers: { 'x-school-year-id': sourceYearId }
            });
            setConfigCount(res.data.length);
        } catch (error) {
            console.error('Error fetching configurations:', error);
            setConfigCount(0);
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!sourceYearId || !targetYearId) {
            setMessage({ type: 'error', text: t('dashboard.transferModals.messages.selectYears') });
            return;
        }

        if (sourceYearId === targetYearId) {
            setMessage({ type: 'error', text: t('dashboard.transferModals.messages.diffYears') });
            return;
        }

        try {
            setTransferring(true);
            setMessage(null);

            const response = await api.post('/exam-rules/transfer', {
                sourceYearId: parseInt(sourceYearId),
                targetYearId: parseInt(targetYearId)
            });

            setMessage({
                type: 'success',
                text: t('dashboard.transferModals.messages.successConfig', { transferred: response.data.transferred })
            });

            // Reset target year selection after successful transfer
            setTimeout(() => {
                setTargetYearId('');
                fetchConfigCount();
            }, 2000);

        } catch (error: any) {
            console.error('Transfer error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.error || t('dashboard.transferModals.messages.errorConfig')
            });
        } finally {
            setTransferring(false);
        }
    };

    const handleClose = () => {
        setSourceYearId('');
        setTargetYearId('');
        setConfigCount(0);
        setMessage(null);
        onClose();
    };

    const sourceYear = years.find(y => y.id.toString() === sourceYearId);
    const targetYear = years.find(y => y.id.toString() === targetYearId);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Settings />
                {t('dashboard.transferModals.titles.config')}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {message && (
                        <Alert severity={message.type} onClose={() => setMessage(null)}>
                            {message.text}
                        </Alert>
                    )}

                    <TextField
                        select
                        label={t('dashboard.transferModals.sourceYear')}
                        value={sourceYearId}
                        onChange={(e) => setSourceYearId(e.target.value)}
                        fullWidth
                        required
                    >
                        {years.map((year) => (
                            <MenuItem key={year.id} value={year.id.toString()}>
                                {year.name}
                            </MenuItem>
                        ))}
                    </TextField>

                    {loading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                                {t('dashboard.transferModals.loadingConfig')}
                            </Typography>
                        </Box>
                    ) : sourceYearId && (
                        <Alert severity="info">
                            <strong>{configCount}</strong> {t('dashboard.transferModals.foundConfig', { count: configCount, year: sourceYear?.name }).split(configCount.toString()).slice(1).join('')}
                        </Alert>
                    )}

                    {/* Hacky way to handle partial translation with dynamic values if not purely using interpolation. 
                        Actually, t() handles interpolation nicely. Let's fix the alert content to use t() fully.
                     */}
                    {/* Re-rendering Alert properly with t() */}
                    {!loading && sourceYearId && (
                        <Alert severity="info">
                            <span dangerouslySetInnerHTML={{ __html: t('dashboard.transferModals.foundConfig', { count: configCount, year: sourceYear?.name }).replace(configCount.toString(), `<strong>${configCount}</strong>`) }} />
                        </Alert>
                    )}

                    <TextField
                        select
                        label={t('dashboard.transferModals.targetYear')}
                        value={targetYearId}
                        onChange={(e) => setTargetYearId(e.target.value)}
                        fullWidth
                        required
                        disabled={!sourceYearId || configCount === 0}
                    >
                        {years
                            .filter(y => y.id.toString() !== sourceYearId)
                            .map((year) => (
                                <MenuItem key={year.id} value={year.id.toString()}>
                                    {year.name}
                                </MenuItem>
                            ))}
                    </TextField>

                    {sourceYearId && targetYearId && (
                        <Alert severity="warning">
                            {t('dashboard.transferModals.messages.configWarning', { source: sourceYear?.name, target: targetYear?.name })}
                        </Alert>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, gap: 1 }}>
                <Button onClick={handleClose} disabled={transferring}>
                    {t('dashboard.transferModals.cancel')}
                </Button>
                <Button
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={!sourceYearId || !targetYearId || configCount === 0 || transferring}
                    sx={{ bgcolor: '#1976d2' }}
                >
                    {transferring ? (
                        <>
                            <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                            {t('dashboard.transferModals.transferring')}
                        </>
                    ) : (
                        t('dashboard.transferModals.transfer')
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfigTransferModal;
