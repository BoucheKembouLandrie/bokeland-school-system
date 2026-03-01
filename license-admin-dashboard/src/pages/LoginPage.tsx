import { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        console.log('handleLogin called with password:', password);
        try {
            setLoading(true);
            setError('');
            console.log('Sending request to:', 'http://localhost:3001/api/admin/login');
            const response = await axios.post('http://localhost:3001/api/admin/login', { password });
            console.log('Response received:', response.data);

            if (response.data.success) {
                localStorage.setItem('adminAuth', 'true');
                console.log('Login successful, calling onLogin');
                onLogin();
                navigate('/');
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.error || 'Login failed');
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
            backgroundColor: '#f5f5f5'
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
                    Admin Dashboard
                </Typography>
                <Typography variant="body2" gutterBottom align="center" color="text.secondary" sx={{ mb: 3 }}>
                    License Management System
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Admin Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    />
                    <Button
                        variant="contained"
                        size="large"
                        onClick={handleLogin}
                        disabled={loading || !password}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default LoginPage;
