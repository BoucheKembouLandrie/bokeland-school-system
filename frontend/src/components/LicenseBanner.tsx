import React, { useState } from 'react';
import { Box, Button, Typography, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useLicense } from '../contexts/LicenseContext';
import LicenseUpgradeModal from './LicenseUpgradeModal';
import { useTranslation } from 'react-i18next';

const LicenseBanner: React.FC = () => {
    const { license, checkLicense } = useLicense();
    const [modalOpen, setModalOpen] = useState(false);
    const { t } = useTranslation();

    const handleRefresh = async () => {
        await checkLicense();
    };

    return (
        <>
            <Paper
                elevation={0}
                sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '4px',
                        height: '100%',
                        background: 'linear-gradient(180deg, #4481eb 0%, #04befe 100%)',
                        borderTopLeftRadius: '3px',
                        borderBottomLeftRadius: '3px',
                    }
                }}
            >
                {/* Left Side: Status & Refresh */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: 'rgba(68, 129, 235, 0.1)',
                            color: '#4481eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                transform: 'rotate(180deg)',
                                bgcolor: 'rgba(68, 129, 235, 0.2)',
                            }
                        }}
                        onClick={handleRefresh}
                    >
                        <RefreshIcon fontSize="small" />
                    </Box>

                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem', display: 'block', mb: 0.2 }}>
                            {t('licenseBanner.refreshText')}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.1, display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                            {t('licenseBanner.timeLeft')}
                            <Box component="span" sx={{
                                background: 'linear-gradient(45deg, #4481eb, #04befe)',
                                backgroundClip: 'text',
                                textFillColor: 'transparent',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontSize: '1.25rem',
                                fontWeight: 800,
                                ml: 0.5
                            }}>
                                {license.daysRemaining !== undefined ? license.daysRemaining : '--'}
                            </Box>
                            <Box component="span" sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>
                                {t('licenseBanner.days')}
                            </Box>
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Box sx={{
                                bgcolor: license.status === 'ACTIVE' ? '#e8f5e9' : license.status === 'TRIAL' ? '#fff3e0' : '#ffebee',
                                color: license.status === 'ACTIVE' ? '#2e7d32' : license.status === 'TRIAL' ? '#e65100' : '#c62828',
                                px: 1, py: 0.2, borderRadius: 1, fontSize: '0.7rem', fontWeight: 700, border: '1px solid currentColor'
                            }}>
                                {license.status === 'ACTIVE' ? t('licenseBanner.status.active') : license.status === 'TRIAL' ? t('licenseBanner.status.trial') : license.status === 'EXPIRED' ? t('licenseBanner.status.expired') : license.status}
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Right Side: CTA */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body2" sx={{ textAlign: 'right', fontSize: '0.8rem', color: 'text.secondary', display: { xs: 'none', md: 'block' } }}>
                        {t('licenseBanner.needTime')} <br />
                        <Box component="span" sx={{ color: 'text.primary', fontWeight: 500 }}>
                            {t('licenseBanner.extendNow')}
                        </Box>
                    </Typography>

                    <Button
                        onClick={() => setModalOpen(true)}
                        size="small"
                        sx={{
                            background: 'linear-gradient(45deg, #11998e 0%, #38ef7d 100%)',
                            color: 'white',
                            textTransform: 'none',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            px: 2.5,
                            py: 0.8,
                            borderRadius: '50px',
                            boxShadow: '0 4px 10px rgba(56, 239, 125, 0.3)',
                            minWidth: 'auto',
                            transition: 'transform 0.2s',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #0e857b 0%, #2ecc71 100%)',
                                transform: 'translateY(-1px)',
                                boxShadow: '0 6px 15px rgba(56, 239, 125, 0.4)',
                            }
                        }}
                    >
                        {t('licenseBanner.renewHere')}
                    </Button>
                </Box>
            </Paper>

            <LicenseUpgradeModal manualOpen={modalOpen} onManualClose={() => setModalOpen(false)} />
        </>
    );
};

export default LicenseBanner;
