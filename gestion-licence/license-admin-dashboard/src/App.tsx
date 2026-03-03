import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useState } from 'react';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: { main: '#7C6EF1' },
        secondary: { main: '#2DD4BF' },
        background: {
            default: '#0F1117',
            paper: 'rgba(255,255,255,0.05)',
        },
        success: { main: '#34D399' },
        error: { main: '#F87171' },
        warning: { main: '#FBBF24' },
        info: { main: '#60A5FA' },
        text: {
            primary: '#F1F5F9',
            secondary: '#94A3B8',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
        h4: { fontWeight: 700, letterSpacing: '-0.5px' },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 16 },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    backdropFilter: 'blur(12px)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(124,110,241,0.2)',
                        border: '1px solid rgba(124,110,241,0.4)',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 12,
                    padding: '10px 20px',
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #7C6EF1 0%, #5B4FCC 100%)',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #8F82F5 0%, #6B5EDD 100%)',
                        boxShadow: '0 4px 20px rgba(124,110,241,0.4)',
                    },
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: { fontWeight: 600, borderRadius: 8 },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background 0.15s ease',
                    '&:hover': {
                        backgroundColor: 'rgba(124,110,241,0.08) !important',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: '#94A3B8',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.72rem',
                    letterSpacing: '0.08em',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                },
                body: {
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    background: 'rgba(20,20,35,0.97)',
                    border: '1px solid rgba(124,110,241,0.25)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: 20,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                    '&:hover fieldset': { borderColor: 'rgba(124,110,241,0.5)' },
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    minWidth: 100,
                    '&.Mui-selected': { color: '#7C6EF1' },
                },
            },
        },
    },
});

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('adminAuth') === 'true';
    });

    const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
        return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles styles={{
                '@import': "url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap')",
                body: {
                    background: 'linear-gradient(135deg, #0F1117 0%, #151825 50%, #0F1117 100%)',
                    minHeight: '100vh',
                },
                '::-webkit-scrollbar': { width: 6 },
                '::-webkit-scrollbar-track': { background: 'rgba(255,255,255,0.02)' },
                '::-webkit-scrollbar-thumb': { background: 'rgba(124,110,241,0.4)', borderRadius: 3 },
            }} />
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <DashboardPage onLogout={() => {
                                    setIsAuthenticated(false);
                                    localStorage.removeItem('adminAuth');
                                }} />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
