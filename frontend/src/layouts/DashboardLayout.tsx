import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon, Dashboard, People, School, Payment, EventAvailable, Settings, ExitToApp, Book, AccountBalance, AccountCircle, Assignment, PriceChange, DateRange } from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../App';
import SchoolYearSelector from '../components/SchoolYearSelector';
import { useTranslation } from 'react-i18next';

import { useSettings } from '../contexts/SettingsContext';
import { BASE_URL } from '../config';
import LicenseUpgradeModal from '../components/LicenseUpgradeModal';

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, hasPermission } = useAuthContext();
    const { settings } = useSettings();

    // Define menu items with specific colors for icons and translations
    const menuItems = [
        { text: t('sidebar.dashboard'), title: t('titles.dashboard'), icon: <Dashboard />, path: '/', color: '#1976d2' }, // Blue
        { text: t('sidebar.classes'), title: t('titles.classes'), icon: <AccountBalance />, path: '/classes', color: '#e65100' }, // Orange
        { text: t('sidebar.staff'), title: t('titles.staff'), icon: <People />, path: '/staff', color: '#c2185b' }, // Pink (Admin color)
        { text: t('sidebar.subjects'), title: t('titles.subjects'), icon: <Book />, path: '/subjects', color: '#00897b' }, // Teal
        { text: t('sidebar.students'), title: t('titles.students'), icon: <School />, path: '/students', color: '#5e35b1' }, // Deep Purple
        { text: t('sidebar.planning'), title: t('titles.planning'), icon: <DateRange />, path: '/planning', color: '#2e7d32' }, // Green
        { text: t('sidebar.exams'), title: t('titles.exams'), icon: <Assignment />, path: '/examens', color: '#d32f2f' }, // Red
        { text: t('sidebar.payments'), title: t('titles.payments'), icon: <Payment />, path: '/payments', color: '#fbc02d' }, // Yellow
        { text: t('sidebar.attendance'), title: t('titles.attendance'), icon: <EventAvailable />, path: '/attendance', color: '#1e88e5' }, // Blue
        { text: t('sidebar.users'), title: t('titles.users'), icon: <AccountCircle />, path: '/users', color: '#8e24aa' }, // Purple
        { text: t('sidebar.expenses'), title: t('titles.expenses'), icon: <PriceChange />, path: '/expenses', color: '#795548' }, // Brown
        { text: t('sidebar.settings'), title: t('titles.settings'), icon: <Settings />, path: '/settings', color: '#607d8b' }, // Blue Grey
    ];

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Map menu paths to permission keys
    const getPermissionKey = (path: string): string => {
        const pathMap: { [key: string]: string } = {
            '/students': 'eleves',
            '/classes': 'classes',
            '/teachers': 'enseignants',
            '/subjects': 'matieres',
            '/examens': 'examens',
            '/grades': 'notes',
            '/payments': 'paiements',
            '/attendance': 'presences',
            '/users': 'utilisateurs',
            '/settings': 'parametres',
            '/administration': 'administration',
            '/reports': 'rapports',
            '/planning': 'planning',
        };
        return pathMap[path] || path.substring(1);
    };

    // Filter menu items based on user permissions
    const filteredMenuItems = menuItems.filter(item => {
        if (item.path === '/') return true; // Dashboard always visible
        return hasPermission(getPermissionKey(item.path));
    });

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <SchoolYearSelector />
            <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <img
                    src={settings?.logo_url
                        ? (settings.logo_url === '/default-logo.png'
                            ? '/default-logo.png'
                            : (settings.logo_url.startsWith('http') ? settings.logo_url : `${BASE_URL}${settings.logo_url}`))
                        : "/logo.jpg"}
                    alt={settings?.school_name || "BOKELAND SCHOOL SYSTEM Management Software"}
                    style={{ width: '111px', height: '111px', objectFit: 'contain' }}
                />
            </Toolbar>
            <List sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {filteredMenuItems.map((item) => {
                    const isSelected = location.pathname === item.path;
                    return (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isSelected}
                                sx={{
                                    '&.Mui-selected': {
                                        backgroundColor: `${item.color}15`, // Very light background of the icon color
                                        borderRight: `4px solid ${item.color}`,
                                        '&:hover': {
                                            backgroundColor: `${item.color}25`,
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: item.color, minWidth: 40 }}>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontWeight: isSelected ? 'bold' : 'medium',
                                        color: isSelected ? item.color : 'textPrimary'
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
                <ListItem disablePadding sx={{ mt: 2, borderTop: '1px solid #eee' }}>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon sx={{ color: '#d32f2f', minWidth: 40 }}><ExitToApp /></ListItemIcon>
                        <ListItemText primary={t('sidebar.logout')} primaryTypographyProps={{ color: '#d32f2f' }} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#9e9e9e', fontSize: '0.7rem' }}>
                    {t('sidebar.version')} 1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: '#fff',
                    color: '#333',
                    boxShadow: '0px 1px 4px rgba(0,0,0,0.1)',
                    borderRadius: 0
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {(() => {
                            const currentItem = menuItems.find(item => item.path === location.pathname);
                            return currentItem?.title || currentItem?.text || t('titles.dashboard');
                        })()}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: '1px solid #eee' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
            >
                <Toolbar />
                <LicenseUpgradeModal />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
