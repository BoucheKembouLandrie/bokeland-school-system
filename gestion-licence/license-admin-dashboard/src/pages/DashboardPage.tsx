import { useEffect, useState } from 'react';
import {
    Box, AppBar, Toolbar, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
    Grid, Card, CardContent, Tabs, Tab, Avatar
} from '@mui/material';
import {
    Edit, Delete, Logout, Group, CheckCircle, AccessTime, Cancel,
    Business, Phone, Email, LocationOn, CalendarToday, Shield
} from '@mui/icons-material';
import axios from 'axios';
import FinancesPage from './FinancesPage';

interface Client {
    id: number;
    machine_id: string;
    school_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    trial_start_date: string;
    subscription_end_date: string;
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED';
    last_checkin?: string;
}

interface Stats {
    total: number;
    active: number;
    trial: number;
    expired: number;
}

interface DashboardPageProps {
    onLogout: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { color: string; bg: string; dot: string; label: string }> = {
        ACTIVE: { color: '#34D399', bg: 'rgba(52,211,153,0.12)', dot: '#34D399', label: 'Actif' },
        TRIAL: { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', dot: '#60A5FA', label: 'Essai' },
        EXPIRED: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', dot: '#F87171', label: 'Expiré' },
        BANNED: { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', dot: '#94A3B8', label: 'Banni' },
    };
    const c = configs[status] || configs.BANNED;
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: 8, backgroundColor: c.bg }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
            <Typography sx={{ color: c.color, fontSize: '0.78rem', fontWeight: 700 }}>{c.label}</Typography>
        </Box>
    );
};

const StatCard = ({ icon, label, value, gradient, glow }: { icon: React.ReactNode; label: string; value: number; gradient: string; glow: string }) => (
    <Card sx={{ position: 'relative', overflow: 'hidden', cursor: 'default' }}>
        <Box sx={{
            position: 'absolute', top: -20, right: -20, width: 90, height: 90,
            borderRadius: '50%', background: gradient, opacity: 0.15, filter: 'blur(20px)'
        }} />
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
                <Avatar sx={{ width: 38, height: 38, background: gradient, boxShadow: `0 4px 15px ${glow}` }}>
                    {icon}
                </Avatar>
            </Box>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage = ({ onLogout }: DashboardPageProps) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, trial: 0, expired: 0 });
    const [editDialog, setEditDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [extensionDays, setExtensionDays] = useState('');
    const [annualRate, setAnnualRate] = useState('144000');
    const [configLoading, setConfigLoading] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [sigFile, setSigFile] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            const [clientsRes, statsRes, configRes] = await Promise.all([
                axios.get('http://localhost:5005/api/admin/clients'),
                axios.get('http://localhost:5005/api/admin/stats'),
                axios.get('http://localhost:5005/api/admin/config')
            ]);
            setClients(clientsRes.data);
            setStats(statsRes.data);
            setAnnualRate(configRes.data.annual_subscription_rate);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setNewStatus(client.status);
        setExtensionDays('');
        setEditDialog(true);
    };

    const handleSave = async () => {
        if (!selectedClient) return;
        try {
            const days = extensionDays ? parseInt(extensionDays) : 0;
            if (days > 0 && newStatus === 'TRIAL' && days > 33) { alert("Max 33 jours pour un essai."); return; }
            if (days > 0 && newStatus === 'ACTIVE' && days > 444) { alert("Max 444 jours pour un abonnement actif."); return; }
            const payload: any = { status: newStatus };
            if (days > 0) payload.days = days;
            await axios.put(`http://localhost:5005/api/admin/clients/${selectedClient.id}`, payload);
            setEditDialog(false);
            fetchData();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Supprimer ce client ?')) return;
        try { await axios.delete(`http://localhost:5005/api/admin/clients/${id}`); fetchData(); }
        catch (error) { console.error('Error deleting client', error); }
    };

    const handleUpdateRate = async () => {
        setConfigLoading(true);
        try {
            await axios.put('http://localhost:5005/api/admin/config', { annual_subscription_rate: annualRate });
            alert('Tarif mis à jour ✓');
        } catch { alert('Erreur lors de la mise à jour'); }
        finally { setConfigLoading(false); }
    };

    const handleUpload = async (file: File, field: 'logo' | 'signature') => {
        const formData = new FormData();
        formData.append(field, file);
        try {
            await axios.post(`http://localhost:5005/api/admin/config/${field}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert(`${field === 'logo' ? 'Logo' : 'Signature'} mis à jour ✓`);
            fetchData();
        } catch { alert('Erreur lors du téléchargement'); }
    };

    const navGradient = 'linear-gradient(135deg, #1a1535 0%, #0e1320 100%)';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* ─── NAVBAR ─── */}
            <AppBar position="static" elevation={0} sx={{
                background: navGradient,
                borderBottom: '1px solid rgba(124,110,241,0.2)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}>
                <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: 'linear-gradient(135deg, #7C6EF1, #2DD4BF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(124,110,241,0.4)'
                        }}>
                            <Shield sx={{ fontSize: 20, color: '#fff' }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>
                                License Admin
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                                Bokeland School System
                            </Typography>
                        </Box>
                    </Box>
                    <Button
                        onClick={onLogout}
                        startIcon={<Logout sx={{ fontSize: 16 }} />}
                        sx={{
                            color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem',
                            '&:hover': { color: '#F87171', background: 'rgba(248,113,113,0.1)' }
                        }}
                    >
                        Déconnexion
                    </Button>
                </Toolbar>

                {/* Tabs */}
                <Tabs
                    value={currentTab}
                    onChange={(_, v) => setCurrentTab(v)}
                    sx={{
                        px: { xs: 2, md: 4 },
                        '& .MuiTabs-indicator': {
                            background: 'linear-gradient(90deg, #7C6EF1, #2DD4BF)',
                            height: 3, borderRadius: 2,
                        },
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.45)', minHeight: 48 },
                        '& .Mui-selected': { color: '#fff !important' },
                    }}
                >
                    <Tab icon={<Group sx={{ fontSize: 17 }} />} iconPosition="start" label="Clients" />
                    <Tab icon={<Shield sx={{ fontSize: 17 }} />} iconPosition="start" label="Finances" />
                    <Tab icon={<Business sx={{ fontSize: 17 }} />} iconPosition="start" label="Configuration" />
                </Tabs>
            </AppBar>

            {/* ─── TAB: CLIENTS ─── */}
            {currentTab === 0 && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    {/* Stat Cards */}
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<Group sx={{ fontSize: 20, color: '#fff' }} />} label="Total Clients" value={stats.total} gradient="linear-gradient(135deg,#7C6EF1,#5B4FCC)" glow="rgba(124,110,241,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<CheckCircle sx={{ fontSize: 20, color: '#fff' }} />} label="Actifs" value={stats.active} gradient="linear-gradient(135deg,#34D399,#059669)" glow="rgba(52,211,153,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<AccessTime sx={{ fontSize: 20, color: '#fff' }} />} label="En Essai" value={stats.trial} gradient="linear-gradient(135deg,#60A5FA,#3B82F6)" glow="rgba(96,165,250,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<Cancel sx={{ fontSize: 20, color: '#fff' }} />} label="Expirés" value={stats.expired} gradient="linear-gradient(135deg,#F87171,#DC2626)" glow="rgba(248,113,113,0.35)" />
                        </Grid>
                    </Grid>

                    {/* Table */}
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Clients enregistrés</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{clients.length} établissement{clients.length > 1 ? 's' : ''}</Typography>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ '& .MuiTableCell-head': { background: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell>École</TableCell>
                                        <TableCell>Localisation</TableCell>
                                        <TableCell>Téléphone</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell>Expiration</TableCell>
                                        <TableCell>Dernier Check-in</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients.map((client) => {
                                        const location = [client.city, client.country].filter(Boolean).join(', ');
                                        const expDate = new Date(client.subscription_end_date);
                                        const now = new Date();
                                        const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                        return (
                                            <TableRow key={client.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{
                                                            width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700,
                                                            background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)'
                                                        }}>
                                                            {client.school_name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{client.school_name}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary' }}>{location || '—'}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem' }}>{client.phone || '—'}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem', color: '#7C6EF1' }}>{client.email}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><StatusBadge status={client.status} /></TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.83rem', fontWeight: 600 }}>{expDate.toLocaleDateString('fr-FR')}</Typography>
                                                        {client.status === 'ACTIVE' && daysLeft > 0 && (
                                                            <Typography sx={{ fontSize: '0.72rem', color: daysLeft < 30 ? '#FBBF24' : '#34D399' }}>
                                                                {daysLeft}j restants
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarToday sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                            {client.last_checkin ? new Date(client.last_checkin).toLocaleString('fr-FR') : 'Jamais'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                        <IconButton size="small" onClick={() => handleEdit(client)} sx={{
                                                            bgcolor: 'rgba(124,110,241,0.12)', '&:hover': { bgcolor: 'rgba(124,110,241,0.25)' }
                                                        }}>
                                                            <Edit sx={{ fontSize: 16, color: '#7C6EF1' }} />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(client.id)} sx={{
                                                            bgcolor: 'rgba(248,113,113,0.1)', '&:hover': { bgcolor: 'rgba(248,113,113,0.22)' }
                                                        }}>
                                                            <Delete sx={{ fontSize: 16, color: '#F87171' }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {clients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                                <Typography sx={{ color: 'text.secondary' }}>Aucun client enregistré</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {/* ─── TAB: FINANCES ─── */}
            {currentTab === 1 && <FinancesPage />}

            {/* ─── TAB: CONFIGURATION ─── */}
            {currentTab === 2 && (
                <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 680, mx: 'auto' }}>
                    {/* Tarif */}
                    <Paper sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar sx={{ background: 'linear-gradient(135deg,#7C6EF1,#5B4FCC)', width: 42, height: 42 }}>
                                <Shield sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Tarification</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Prix annuel affiché aux clients</Typography>
                            </Box>
                        </Box>
                        <TextField
                            fullWidth
                            label="Tarif Annuel d'Abonnement (FCFA)"
                            type="number"
                            value={annualRate}
                            onChange={(e) => setAnnualRate(e.target.value)}
                            sx={{ mb: 3 }}
                            helperText="Ce montant sera affiché lors du renouvellement de licence."
                        />
                        <Button variant="contained" color="primary" onClick={handleUpdateRate} disabled={configLoading} fullWidth sx={{ py: 1.5 }}>
                            {configLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                        </Button>
                    </Paper>

                    {/* Logo */}
                    <Paper sx={{ p: 4, borderRadius: 4, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar sx={{ background: 'linear-gradient(135deg,#2DD4BF,#059669)', width: 42, height: 42 }}>
                                <Business sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Logo de l'Entreprise</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>PNG recommandé — Visible sur les factures PDF</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: '100%', height: 120, borderRadius: 3, border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                bgcolor: 'rgba(255,255,255,0.02)'
                            }}>
                                <img
                                    src="http://localhost:5005/uploads/company_logo.png"
                                    alt="Logo"
                                    style={{ maxHeight: 100, maxWidth: '80%', objectFit: 'contain' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </Box>
                            <input accept="image/*" style={{ display: 'none' }} id="logo-input" type="file"
                                onChange={(e) => { if (e.target.files?.[0]) { setLogoFile(e.target.files[0]); } }} />
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <label htmlFor="logo-input" style={{ flex: 1 }}>
                                    <Button variant="outlined" component="span" fullWidth startIcon={<Edit />}
                                        sx={{ borderColor: 'rgba(124,110,241,0.4)', color: '#7C6EF1' }}>
                                        {logoFile ? logoFile.name : 'Choisir un fichier'}
                                    </Button>
                                </label>
                                {logoFile && (
                                    <Button variant="contained" onClick={() => handleUpload(logoFile, 'logo')}
                                        sx={{ background: 'linear-gradient(135deg,#7C6EF1,#5B4FCC)' }}>
                                        Uploader
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>

                    {/* Signature */}
                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                            <Avatar sx={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', width: 42, height: 42 }}>
                                <Edit sx={{ fontSize: 20 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Signature de l'Entreprise</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>PNG transparent — Apparaît en bas des reçus</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Box sx={{
                                width: '100%', height: 120, borderRadius: 3, border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                bgcolor: 'rgba(255,255,255,0.02)'
                            }}>
                                <img
                                    src="http://localhost:5005/uploads/company_signature.png"
                                    alt="Signature"
                                    style={{ maxHeight: 100, maxWidth: '80%', objectFit: 'contain' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </Box>
                            <input accept="image/*" style={{ display: 'none' }} id="sig-input" type="file"
                                onChange={(e) => { if (e.target.files?.[0]) { setSigFile(e.target.files[0]); } }} />
                            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                <label htmlFor="sig-input" style={{ flex: 1 }}>
                                    <Button variant="outlined" component="span" fullWidth startIcon={<Edit />}
                                        sx={{ borderColor: 'rgba(251,191,36,0.4)', color: '#FBBF24' }}>
                                        {sigFile ? sigFile.name : 'Choisir un fichier'}
                                    </Button>
                                </label>
                                {sigFile && (
                                    <Button variant="contained" onClick={() => handleUpload(sigFile, 'signature')}
                                        sx={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', color: '#1a1a1a' }}>
                                        Uploader
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* ─── EDIT DIALOG ─── */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', width: 40, height: 40, fontSize: '0.9rem', fontWeight: 700 }}>
                            {selectedClient?.school_name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Modifier le client</Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{selectedClient?.school_name}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select value={newStatus} label="Statut" onChange={(e) => setNewStatus(e.target.value)}>
                                <MenuItem value="TRIAL">🔵 Essai (Trial)</MenuItem>
                                <MenuItem value="ACTIVE">🟢 Actif (Active)</MenuItem>
                                <MenuItem value="EXPIRED">🔴 Expiré (Expired)</MenuItem>
                            </Select>
                        </FormControl>

                        {(newStatus === 'TRIAL' || newStatus === 'ACTIVE') && (
                            <TextField
                                label={`Ajouter des jours — Max ${newStatus === 'TRIAL' ? '33' : '444'}`}
                                type="number"
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(e.target.value)}
                                helperText={newStatus === 'ACTIVE' ? "Jours à partir d'aujourd'hui si le client est expiré" : 'Jours à partir d\'aujourd\'hui'}
                                inputProps={{ min: 1, max: newStatus === 'TRIAL' ? 33 : 444 }}
                            />
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setEditDialog(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ px: 3 }}>Enregistrer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DashboardPage;
