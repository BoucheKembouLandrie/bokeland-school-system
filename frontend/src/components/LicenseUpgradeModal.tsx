import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Typography, Button, Box, IconButton, TextField, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { useLicense } from '../contexts/LicenseContext';
import api from '../services/api';

interface LicenseUpgradeModalProps {
    manualOpen?: boolean;
    onManualClose?: () => void;
}

const LicenseUpgradeModal: React.FC<LicenseUpgradeModalProps> = ({ manualOpen, onManualClose }) => {
    const { license, checkLicense } = useLicense();
    const [open, setOpen] = useState(false);

    // Sync internal state with prop
    useEffect(() => {
        if (manualOpen !== undefined) {
            setOpen(manualOpen);
            // Refresh license info (and price) when manually opened
            if (manualOpen) {
                checkLicense(true);
            }
        }
    }, [manualOpen, checkLicense]);

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'initiated' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Get numeric value for calculations
    const price = license.annualSubscriptionRate ? parseInt(license.annualSubscriptionRate) : 144400;
    const formattedPrice = price.toLocaleString('fr-FR').replace(/\s/g, ' '); // Format with spaces

    useEffect(() => {
        // Show modal if in TRIAL mode AND no manual control is active
        // Only run this auto-logic if manualOpen is undefined
        if (manualOpen === undefined && license.status === 'TRIAL') {
            const lastShown = localStorage.getItem('lastUpgradePrompt');
            const now = Date.now();
            const elevenHours = 11 * 60 * 60 * 1000; // 11 hours in milliseconds

            // Show if never shown, or if 11 hours have passed
            if (!lastShown || (now - parseInt(lastShown)) >= elevenHours) {
                setOpen(true);
                // Refresh here too
                checkLicense(true);
                localStorage.setItem('lastUpgradePrompt', now.toString());
            }
        }
    }, [license.status, manualOpen, checkLicense]);

    const handleClose = () => {
        setOpen(false);
        if (onManualClose) onManualClose();
    };

    const handleUpgrade = async () => {
        if (!phoneNumber) {
            setErrorMessage('Veuillez entrer votre numéro Mobile Money');
            return;
        }

        setLoading(true);
        setErrorMessage('');

        try {
            const response = await api.post('/license/pay', {
                amount: price,
                phone_number: phoneNumber
            });

            if (response.data.success) {
                setStatus('initiated');
            }
        } catch (error: any) {
            console.error('Payment error', error);
            setStatus('error');
            setErrorMessage(error.response?.data?.error || 'Erreur lors de l\'initiation du paiement');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, p: 1 }
            }}
        >
            <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                <RocketLaunchIcon sx={{ fontSize: 60, color: '#ff9800', mb: 2 }} />
                <Typography variant="h5" component="div" fontWeight="bold">
                    Profitez de l'offre spéciale !
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Typography variant="body1" align="center" paragraph sx={{ mt: 1 }}>
                    Vous êtes actuellement en <strong>Période d'Essai</strong> ({license.daysRemaining} jours restants).
                </Typography>

                <Typography variant="body2" align="center" color="text.secondary" paragraph>
                    Abonnez-vous dès maintenant pour <strong>444 Jours</strong> à <strong>{formattedPrice} FCFA</strong>. <br />
                    Ces jours seront <strong>ajoutés</strong> à votre période d'essai actuelle !
                </Typography>

                {status === 'error' && (
                    <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>
                )}

                {status === 'initiated' ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography variant="h6" color="primary" gutterBottom>
                            Veuillez valider le paiement sur votre téléphone !
                        </Typography>
                        <CircularProgress sx={{ mb: 2 }} />
                        <Typography variant="body2">
                            Une fois validé, votre licence sera activée automatiquement.
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                checkLicense(true);
                                handleClose();
                            }}
                            sx={{ mt: 3 }}
                        >
                            J'ai validé, vérifier ma licence
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="Numéro Mobile Money (ex: 690...)"
                            variant="outlined"
                            fullWidth
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            disabled={loading}
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleUpgrade}
                            disabled={loading}
                            sx={{
                                borderRadius: 8,
                                px: 4,
                                py: 1.5,
                                fontWeight: 'bold',
                                background: loading ? 'grey' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                boxShadow: loading ? 'none' : '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                width: '100%'
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : `Payer ${formattedPrice} FCFA`}
                        </Button>
                        <Button
                            color="inherit"
                            onClick={handleClose}
                            sx={{ textTransform: 'none', color: 'text.secondary' }}
                        >
                            Peut-être plus tard
                        </Button>
                    </Box>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default LicenseUpgradeModal;
