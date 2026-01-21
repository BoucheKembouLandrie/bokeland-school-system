import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useState } from 'react';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
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
