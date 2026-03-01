import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import api from '../services/api';

const ActivationPage: React.FC = () => {
    const [schoolName, setSchoolName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleActivate = async () => {
        if (!schoolName || !email || !phone) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await api.post('/license/activate', { school_name: schoolName, email, phone });
            setSuccess(true);
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err: any) {
            console.error('Activation failed', err);
            setError(err.response?.data?.error || 'Échec de l\'activation. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            backgroundImage: 'url(/background.jpg)', // Assuming similar background to login
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 2 }}>
                <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Bienvenue
                </Typography>
                <Typography variant="body1" gutterBottom align="center" sx={{ mb: 3, color: '#666' }}>
                    Activez votre logiciel pour commencer votre période d'essai de 33 jours.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Activation réussie ! Redirection...</Alert>}

                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Nom de l'établissement"
                        fullWidth
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        disabled={loading || success}
                    />
                    <TextField
                        label="Adresse Email"
                        type="email"
                        fullWidth
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading || success}
                    />
                    <TextField
                        label="Numéro de Téléphone"
                        type="tel"
                        fullWidth
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading || success}
                        placeholder="+237 6XX XXX XXX"
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleActivate}
                        disabled={loading || success}
                        sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Activer maintenant'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default ActivationPage;
