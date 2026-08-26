import { useState } from 'react';
import { API_URL } from '../config';
import { Box, TextField, Button, Typography, Alert, InputAdornment, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Lock, Shield, Visibility, VisibilityOff, AccountCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IconButton } from '@mui/material';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Forgot password states
    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotUsername, setForgotUsername] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);
    const [forgotMessage, setForgotMessage] = useState('');
    const [forgotError, setForgotError] = useState('');

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await axios.post(`${API_URL}/api/admin/login`, { username, password });
            if (response.data.success) {
                localStorage.setItem('adminAuth', 'true');
                // Store token if needed
                localStorage.setItem('adminToken', response.data.token);
                onLogin();
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Identifiants incorrects');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        try {
            setForgotLoading(true);
            setForgotError('');
            setForgotMessage('');
            const res = await axios.post(`${API_URL}/api/admin/forgot-password`, { username: forgotUsername });
            setForgotMessage(res.data.message);
        } catch (err: any) {
            setForgotError(err.response?.data?.error || 'Erreur lors de la réinitialisation');
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            background: 'radial-gradient(ellipse at 30% 30%, rgba(124,110,241,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, rgba(45,212,191,0.1) 0%, transparent 60%), linear-gradient(135deg, #0F1117 0%, #151825 100%)',
        }}>
            {/* Left panel */}
            <Box sx={{
                flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', px: 6,
                borderRight: '1px solid rgba(255,255,255,0.05)',
            }}>
                <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
                    <Box sx={{
                        width: 72, height: 72, borderRadius: 4, mb: 3, mx: 'auto',
                        background: 'linear-gradient(135deg, #7C6EF1, #2DD4BF)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(124,110,241,0.45)',
                    }}>
                        <Shield sx={{ fontSize: 38, color: '#fff' }} />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '2rem', letterSpacing: '-0.5px', mb: 1.5, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        License Admin
                    </Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem', lineHeight: 1.6 }}>
                        Gérez les licences et abonnements de vos clients depuis ce tableau de bord sécurisé.
                    </Typography>

                    {/* Feature pills */}
                    {['Gestion des clients', 'Suivi des paiements', 'Configuration globale', 'Multi-administrateurs'].map((f) => (
                        <Box key={f} sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: 8, bgcolor: 'rgba(124,110,241,0.1)', border: '1px solid rgba(124,110,241,0.2)', m: 0.5, mt: 1.5 }}>
                            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C6EF1', boxShadow: '0 0 6px #7C6EF1' }} />
                            <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Right panel — form */}
            <Box sx={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', alignItems: 'center', px: { xs: 3, md: 8 },
            }}>
                <Box sx={{ width: '100%', maxWidth: 380 }}>
                    {/* Mobile logo */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 4 }}>
                        <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(124,110,241,0.4)' }}>
                            <Shield sx={{ fontSize: 24, color: '#fff' }} />
                        </Box>
                        <Typography sx={{ fontWeight: 800, fontSize: '1.2rem' }}>License Admin</Typography>
                    </Box>

                    <Typography sx={{ fontWeight: 700, fontSize: '1.6rem', letterSpacing: '-0.3px', mb: 0.5 }}>
                        Connexion
                    </Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mb: 4 }}>
                        Connectez-vous pour administrer les serveurs
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2, bgcolor: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.25)', color: '#F87171' }}>
                            {error}
                        </Alert>
                    )}

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Nom d'utilisateur"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle sx={{ color: 'text.secondary', fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            label="Mot de passe"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock sx={{ color: 'text.secondary', fontSize: 18 }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)} edge="end">
                                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                            <Button 
                                variant="text" 
                                size="small" 
                                onClick={() => {
                                    setForgotOpen(true);
                                    setForgotMessage('');
                                    setForgotError('');
                                    setForgotUsername(username);
                                }}
                                sx={{ textTransform: 'none', color: 'text.secondary' }}
                            >
                                Mot de passe oublié ?
                            </Button>
                        </Box>

                        <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            onClick={handleLogin}
                            disabled={loading || !password || !username}
                            sx={{
                                py: 1.5, mt: 1, fontSize: '0.95rem', fontWeight: 700,
                                background: 'linear-gradient(135deg, #7C6EF1 0%, #5B4FCC 100%)',
                                '&:hover': { background: 'linear-gradient(135deg, #8F82F5 0%, #6B5EDD 100%)', boxShadow: '0 4px 24px rgba(124,110,241,0.5)' },
                                '&.Mui-disabled': { opacity: 0.5 },
                            }}
                        >
                            {loading ? <CircularProgress size={20} color="inherit" /> : 'Se connecter'}
                        </Button>
                    </Box>

                    <Typography sx={{ mt: 4, fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
                        Bokeland School System © {new Date().getFullYear()}
                    </Typography>
                </Box>
            </Box>

            {/* Forgot Password Dialog */}
            <Dialog open={forgotOpen} onClose={() => setForgotOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Mot de passe oublié</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Entrez votre nom d'utilisateur. Un mot de passe temporaire sera directement envoyé à l'adresse e-mail associée (admin@bokelandgroupservices.com).
                    </Typography>
                    
                    {forgotError && <Alert severity="error" sx={{ mb: 2 }}>{forgotError}</Alert>}
                    {forgotMessage && <Alert severity="success" sx={{ mb: 2 }}>{forgotMessage}</Alert>}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Nom d'utilisateur"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={forgotUsername}
                        onChange={(e) => setForgotUsername(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleForgotPassword()}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 0 }}>
                    <Button onClick={() => setForgotOpen(false)} color="inherit" disabled={forgotLoading}>Annuler</Button>
                    <Button onClick={handleForgotPassword} variant="contained" disabled={!forgotUsername || forgotLoading}>
                        {forgotLoading ? <CircularProgress size={20} color="inherit" /> : 'Réinitialiser'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default LoginPage;
