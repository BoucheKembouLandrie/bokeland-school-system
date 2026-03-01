import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { Box, Button, Dialog, DialogContent, Typography, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CelebrationIcon from '@mui/icons-material/Celebration';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

interface LicenseState {
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED' | 'NOT_REGISTERED' | 'UNKNOWN';
    daysRemaining?: number;
    expirationDate?: string;
    message?: string;
    annualSubscriptionRate?: string;
}

interface NotificationState {
    open: boolean;
    type: 'success' | 'info';
    title: string;
    message: string;
}

interface LicenseContextType {
    license: LicenseState;
    checkLicense: (force?: boolean) => Promise<void>;
}

const LicenseContext = createContext<LicenseContextType>({
    license: { status: 'UNKNOWN' },
    checkLicense: async () => { },
});

export const useLicense = () => useContext(LicenseContext);

export const LicenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [license, setLicense] = useState<LicenseState>({ status: 'UNKNOWN' });
    const [showBlocker, setShowBlocker] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({
        open: false,
        type: 'info',
        title: '',
        message: ''
    });

    const checkLicense = async (force: boolean = false) => {
        try {
            // We use a specific endpoint to check status without triggering the interceptor loop potentially
            const response = await api.get(`/license/status${force ? '?force=true' : ''}`);

            // Map snake_case backend response to camelCase frontend state
            const mappedData: LicenseState = {
                status: response.data.status,
                daysRemaining: response.data.days_remaining,
                expirationDate: response.data.expiration_date,
                message: response.data.message,
                annualSubscriptionRate: response.data.annual_subscription_rate
            };

            setLicense(mappedData);

            setLicense(mappedData);

            if (mappedData.status === 'EXPIRED') {
                setShowBlocker(true);
            } else {
                setShowBlocker(false);
            }

            // Notification Logic for Extension
            const previousExpiration = localStorage.getItem('last_known_expiration');
            console.log('DEBUG: Notification Check', { previousExpiration, newExpiration: mappedData.expirationDate });

            if (previousExpiration && mappedData.expirationDate && mappedData.expirationDate !== previousExpiration) {
                // If date changed and it's in the future compared to old one (extension)
                const oldDate = new Date(previousExpiration);
                const newDate = new Date(mappedData.expirationDate);

                console.log('DEBUG: Comparing dates', { oldDate, newDate, isGreater: newDate > oldDate });

                if (newDate.getTime() > oldDate.getTime()) { // Safe comparison using timestamps
                    setNotification({
                        open: true,
                        type: 'success',
                        title: 'Félicitations !',
                        message: 'Votre abonnement a été prolongé avec succès. Merci de votre confiance.'
                    });
                }
            }
            if (mappedData.expirationDate) {
                localStorage.setItem('last_known_expiration', mappedData.expirationDate);
            }

        } catch (error: any) {
            console.error('Check License Error Handler:', error);
            const data = error.response?.data;
            console.log('DEBUG: Error Data Received:', data);

            // If the check fails (e.g. 403 from interceptor), define state based on error code or status
            if (data?.code === 'LICENSE_NOT_ACTIVATED' || data?.status === 'NOT_REGISTERED') {
                setLicense({ status: 'NOT_REGISTERED' });
            } else if (data?.code === 'LICENSE_EXPIRED' || data?.status === 'EXPIRED') {
                setLicense({ status: 'EXPIRED', message: data?.message });
                setShowBlocker(true);
            }
        }
    };

    useEffect(() => {
        checkLicense(true); // Initial check

        // Poll every 5 seconds to detect changes in real-time
        // This satisfies the requirement "Leuana school en permanence travaille sur sa connexion"
        const intervalId = setInterval(() => {
            checkLicense(true);
        }, 5000);

        // Setup interceptor listener for updates from any request headers
        const interceptor = api.interceptors.response.use(
            (response) => {
                const days = response.headers['x-days-remaining'];
                if (days !== undefined) {
                    setLicense(prev => ({ ...prev, daysRemaining: parseInt(days) }));
                }

                const rate = response.headers['x-subscription-rate'];
                if (rate) {
                    setLicense(prev => ({ ...prev, annualSubscriptionRate: rate }));

                    const lastKnownRate = localStorage.getItem('last_known_rate');
                    if (lastKnownRate && lastKnownRate !== rate) {
                        setNotification({
                            open: true,
                            type: 'info',
                            title: 'Mise à jour des tarifs',
                            message: `Les tarifs d'abonnement ont été mis à jour. Nouveau tarif: ${rate} FCFA`
                        });
                    }
                    localStorage.setItem('last_known_rate', rate);
                }

                return response;
            },
            (error) => {
                const data = error.response?.data;
                // Robust check for Banned/Expired status
                if (error.response?.status === 403) {
                    if (data?.code === 'LICENSE_EXPIRED' || data?.status === 'EXPIRED') {
                        setLicense({ status: 'EXPIRED', message: data.message });
                        setShowBlocker(true);
                    } else if (data?.code === 'LICENSE_NOT_ACTIVATED') {
                        setLicense({ status: 'NOT_REGISTERED' });
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            clearInterval(intervalId); // Cleanup
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        if (license.status === 'EXPIRED') {
            setShowBlocker(true);
        }
    }, [license.status]);

    const handleRenew = () => {
        // Here you would integrate the payment link
        window.open('https://payment-link-example.com', '_blank');
        setNotification({
            open: true,
            type: 'info',
            title: 'Paiement',
            message: 'Après le paiement, veuillez attendre quelques instants pour la validation automatique.'
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    return (
        <LicenseContext.Provider value={{ license, checkLicense }}>
            {children}

            {/* Notification Popup */}
            <Dialog
                open={notification.open}
                onClose={handleCloseNotification}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2,
                        textAlign: 'center',
                        maxWidth: 450
                    }
                }}
            >
                <Box sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <IconButton onClick={handleCloseNotification}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    {notification.type === 'success' ? (
                        <CelebrationIcon sx={{ fontSize: 60, color: '#ffb300' }} /> // Party color
                    ) : (
                        <InfoIcon sx={{ fontSize: 60, color: '#1976d2' }} />
                    )}

                    <Typography variant="h5" component="div" fontWeight="bold" gutterBottom>
                        {notification.title}
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        {notification.message}
                    </Typography>

                    <Button
                        variant="contained"
                        color={notification.type === 'success' ? "success" : "primary"}
                        onClick={handleCloseNotification}
                        sx={{ mt: 2, borderRadius: 20, px: 4 }}
                    >
                        {notification.type === 'success' ? "Génial !" : "Compris"}
                    </Button>
                </DialogContent>
            </Dialog>

            {/* Blocking Overlay */}
            <Dialog
                open={showBlocker}
                fullScreen
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }
                }}
            >
                <DialogContent sx={{ textAlign: 'center', maxWidth: 600 }}>
                    <LockIcon sx={{ fontSize: 80, color: '#ff9800', mb: 2 }} />
                    <Typography variant="h3" gutterBottom color="warning.main" fontWeight="bold">
                        Licence Expirée
                    </Typography>
                    <Typography variant="h6" color="textSecondary" paragraph>
                        {license.message || "Votre licence a expiré."}
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Pour continuer à utiliser le logiciel et accéder à vos données, vous devez renouveler votre abonnement.
                    </Typography>
                    <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            onClick={handleRenew}
                            sx={{ py: 2, fontSize: '1.2rem' }}
                        >
                            Renouveler l'abonnement (444 Jours)
                        </Button>
                        <Button variant="outlined" onClick={() => checkLicense(true)}>
                            J'ai payé, rafraîchir
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </LicenseContext.Provider>
    );
};
