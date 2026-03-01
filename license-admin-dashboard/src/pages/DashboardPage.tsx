import { useEffect, useState } from 'react';
import {
    Box, AppBar, Toolbar, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Card, CardContent, Tabs, Tab,
    FormControlLabel, Checkbox
} from '@mui/material';
import { Edit, Delete, Logout } from '@mui/icons-material';
import axios from 'axios';
import FinancesPage from './FinancesPage';

interface Client {
    id: number;
    machine_id: string;
    school_name: string;
    email: string;
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

const DashboardPage = ({ onLogout }: DashboardPageProps) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, trial: 0, expired: 0 });
    const [editDialog, setEditDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newStatus, setNewStatus] = useState('');
    const [extensionDays, setExtensionDays] = useState('');
    const [amount, setAmount] = useState('144400'); // Default annual price
    const [annualRate, setAnnualRate] = useState('144000'); // Configured rate (fetched)
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [configLoading, setConfigLoading] = useState(false);

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

    const handleUpdateRate = async () => {
        setConfigLoading(true);
        try {
            await axios.put('http://localhost:5005/api/admin/config', {
                annual_subscription_rate: annualRate
            });
            alert('Tarif mis à jour avec succès');
        } catch (error) {
            console.error('Error updating rate', error);
            alert('Erreur lors de la mise à jour');
        } finally {
            setConfigLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setNewStatus(client.status);
        setExtensionDays('');
        setPaymentVerified(false);
        setEditDialog(true);
        setAmount(annualRate); // Initialize with current rate
    };

    const handleSave = async () => {
        if (!selectedClient) return;

        try {
            const days = extensionDays ? parseInt(extensionDays) : 0;

            if (days > 0) {
                // VALIDATION RULES
                if (newStatus === 'TRIAL') {
                    if (days > 33) {
                        alert("Impossible d'ajouter plus de 33 jours pour un essai.");
                        return;
                    }
                    // For TRIAL, we use updateClientStatus (no payment record needed)
                    await axios.put(`http://localhost:5005/api/admin/clients/${selectedClient.id}`, {
                        status: newStatus,
                        days: days
                    });

                } else if (newStatus === 'ACTIVE') {
                    if (days > 444) {
                        alert("Impossible d'ajouter plus de 444 jours pour un abonnement actif.");
                        return;
                    }
                    if (!paymentVerified) {
                        alert("Veuillez confirmer que le paiement a bien été effectué.");
                        return;
                    }
                    // For ACTIVE, we record a payment which extends subscription
                    const payload = {
                        client_id: selectedClient.id,
                        amount: parseFloat(amount),
                        payment_method: 'manual',
                        days: days
                    };
                    console.log('Sending Payment Payload:', payload);

                    await axios.post('http://localhost:5005/api/admin/payments', payload);
                } else {
                    alert("L'extension n'est pas autorisée pour ce statut.");
                    return;
                }
            } else {
                // Just status update without extension
                await axios.put(`http://localhost:5005/api/admin/clients/${selectedClient.id}`, {
                    status: newStatus
                });
            }

            setEditDialog(false);
            fetchData();
        } catch (error: any) {
            console.error('Error updating client', error);
            const errorMessage = error.response?.data?.error || error.message || "Erreur inconnue";
            alert(`Erreur lors de la mise à jour: ${errorMessage}`);
        }
    };

    // ... existing handleDelete and getStatusColor ...

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            await axios.delete(`http://localhost:5005/api/admin/clients/${id}`);
            fetchData();
        } catch (error) {
            console.error('Error deleting client', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'TRIAL': return 'info';
            case 'EXPIRED': return 'error';
            case 'BANNED': return 'default';
            default: return 'default';
        }
    };

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        License Admin Dashboard
                    </Typography>
                    <Button color="inherit" startIcon={<Logout />} onClick={onLogout}>
                        Logout
                    </Button>
                </Toolbar>
                <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} textColor="inherit" indicatorColor="secondary">
                    <Tab label="Clients" />
                    <Tab label="Finances" />
                    <Tab label="Configuration" />
                    <Tab label="Déploiement" />
                </Tabs>
            </AppBar>


            {currentTab === 0 && (
                <Box sx={{ p: 3 }}>
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>Total Clients</Typography>
                                    <Typography variant="h4">{stats.total}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>Active</Typography>
                                    <Typography variant="h4" color="success.main">{stats.active}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>Trial</Typography>
                                    <Typography variant="h4" color="info.main">{stats.trial}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                            <Card>
                                <CardContent>
                                    <Typography color="text.secondary" gutterBottom>Expired</Typography>
                                    <Typography variant="h4" color="error.main">{stats.expired}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>School Name</TableCell>
                                    <TableCell>Location</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Email Address</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Expiration Date</TableCell>
                                    <TableCell>Last Check-in</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {clients.map((client) => {
                                    const statusColor = getStatusColor(client.status);
                                    const location = [client.address, client.city, client.country].filter(Boolean).join(', ');

                                    return (
                                        <TableRow key={client.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">{client.school_name}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{location || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{client.phone || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{client.email}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={client.status}
                                                    color={statusColor as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {client.subscription_end_date
                                                    ? new Date(client.subscription_end_date).toLocaleDateString()
                                                    : 'N/A'}
                                            </TableCell>
                                            <TableCell>{client.last_checkin ? new Date(client.last_checkin).toLocaleString() : 'Never'}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleEdit(client)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton size="small" color="error" onClick={() => handleDelete(client.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer >
                </Box >
            )}

            {currentTab === 1 && <FinancesPage />}

            {
                currentTab === 2 && (
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', gap: 3 }}>
                            {/* Tarif Column */}
                            <Box sx={{ flex: 1 }}>
                                <Paper sx={{ p: 4, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Configuration Globale
                                    </Typography>
                                    <Box sx={{ my: 3 }}>
                                        <TextField
                                            fullWidth
                                            label="Tarif Annuel d'Abonnement (FCFA)"
                                            type="number"
                                            value={annualRate}
                                            onChange={(e) => setAnnualRate(e.target.value)}
                                            helperText="Ce montant sera affiché aux utilisateurs pour le renouvellement."
                                        />
                                    </Box>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleUpdateRate}
                                        disabled={configLoading}
                                        fullWidth
                                    >
                                        {configLoading ? 'Mise à jour...' : 'Sauvegarder'}
                                    </Button>
                                </Paper>
                            </Box>

                            {/* Logo Column */}
                            <Box sx={{ flex: 1 }}>
                                <Paper sx={{ p: 4, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Logo de l'Entreprise
                                    </Typography>
                                    <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <img
                                            src="http://localhost:5005/uploads/company_logo.png"
                                            alt="Logo"
                                            style={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain', border: '1px dashed #ccc' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                            key={Date.now()}
                                        />

                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="raised-button-file"
                                            type="file"
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const formData = new FormData();
                                                    formData.append('logo', file);

                                                    try {
                                                        await axios.post('http://localhost:5005/api/admin/config/logo', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        alert('Logo mis à jour avec succès');
                                                        fetchData();
                                                    } catch (error) {
                                                        console.error('Upload error', error);
                                                        alert('Erreur lors du téléchargement du logo');
                                                    }
                                                }
                                            }}
                                        />
                                        <label htmlFor="raised-button-file">
                                            <Button variant="outlined" component="span" startIcon={<Edit />} fullWidth>
                                                Changer le Logo
                                            </Button>
                                        </label>
                                        <Typography variant="caption" color="textSecondary" align="center">
                                            Format: PNG (recommandé), JPG
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>

                            {/* Signature Column */}
                            <Box sx={{ flex: 1 }}>
                                <Paper sx={{ p: 4, height: '100%' }}>
                                    <Typography variant="h6" gutterBottom>
                                        Signature de l'Entreprise
                                    </Typography>
                                    <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                        <img
                                            src="http://localhost:5005/uploads/company_signature.png"
                                            alt="Signature"
                                            style={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain', border: '1px dashed #ccc' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                            key={Date.now() + 'sig'}
                                        />

                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="raised-button-file-signature"
                                            type="file"
                                            onChange={async (e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    const file = e.target.files[0];
                                                    const formData = new FormData();
                                                    formData.append('signature', file);

                                                    try {
                                                        await axios.post('http://localhost:5005/api/admin/config/signature', formData, {
                                                            headers: { 'Content-Type': 'multipart/form-data' }
                                                        });
                                                        alert('Signature mise à jour avec succès');
                                                        fetchData();
                                                    } catch (error) {
                                                        console.error('Upload error', error);
                                                        alert('Erreur lors du téléchargement de la signature');
                                                    }
                                                }
                                            }}
                                        />
                                        <label htmlFor="raised-button-file-signature">
                                            <Button variant="outlined" component="span" startIcon={<Edit />} fullWidth>
                                                Changer la Signature
                                            </Button>
                                        </label>
                                        <Typography variant="caption" color="textSecondary" align="center">
                                            Format: PNG (transparent)
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Box>
                )
            }

            {currentTab === 3 && <DeploymentTab />}

            <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
                <DialogTitle>Edit Client: {selectedClient?.school_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2, minWidth: 400 }}>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select value={newStatus} label="Status" onChange={(e) => setNewStatus(e.target.value)}>
                                <MenuItem value="TRIAL">TRIAL</MenuItem>
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="EXPIRED">EXPIRED</MenuItem>
                            </Select>
                        </FormControl>

                        {newStatus === 'TRIAL' && selectedClient?.status === 'ACTIVE' && (
                            <Typography color="warning.main" variant="caption">
                                Attention: Passer en mode TRIAL désactivera les fonctionnalités de l'abonnement complet, même s'il reste des jours. Pour prolonger l'accès, gardez le statut ACTIVE.
                            </Typography>
                        )}

                        {/* Extension Options only for TRIAL and ACTIVE */}
                        {(newStatus === 'TRIAL' || newStatus === 'ACTIVE') && (
                            <TextField
                                label={`Extend Subscription (days) - Max ${newStatus === 'TRIAL' ? '33' : '444'}`}
                                type="number"
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(e.target.value)}
                                helperText="Leave empty to keep current expiration date"
                            />
                        )}

                        {/* Payment Options only for ACTIVE and when extending */}
                        {newStatus === 'ACTIVE' && extensionDays && (
                            <>
                                <TextField
                                    label="Montant du Paiement (FCFA)"
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    helperText="Montant par défaut configuré (modifiable)"
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={paymentVerified}
                                            onChange={(e) => setPaymentVerified(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Je valide que le paiement a été effectué"
                                />
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleSave} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default DashboardPage;


function DeploymentTab() {
    const [latestVersion, setLatestVersion] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5005/api/admin/updates/history');
            setHistory(res.data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('updateFile', file);

        setLoading(true);
        try {
            await axios.post('http://localhost:5005/api/admin/updates/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert(`Fichier ${file.name} téléversé avec succès !`);
            fetchHistory(); // Refresh list
        } catch (error) {
            console.error('Update upload error', error);
            alert("Erreur lors de l'envoi de la mise à jour");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
                Centre de Déploiement (OTA)
            </Typography>
            <Typography color="text.secondary" paragraph>
                Déposez ici les nouvelles versions de l'application. Les clients les téléchargeront automatiquement.
            </Typography>


            <Box sx={{ display: 'flex', gap: 3, mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>1. Fichier de Version (.yml)</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Le fichier <code>latest.yml</code> généré par electron-builder. Il indique aux clients qu'une nouvelle version existe.
                            </Typography>
                            <Button
                                variant="contained"
                                component="label"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Envoi...' : 'Uploader latest.yml'}
                                <input type="file" hidden accept=".yml" onChange={handleUpload} />
                            </Button>
                        </CardContent>
                    </Card>
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>2. Installateur (.exe)</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                L'exécutable d'installation (ex: <code>LeuanaSchool-Setup-1.0.2.exe</code>).
                            </Typography>
                            <Button
                                variant="contained"
                                color="secondary"
                                component="label"
                                fullWidth
                                disabled={loading}
                            >
                                {loading ? 'Envoi...' : 'Uploader l\'Installateur (.exe)'}
                                <input type="file" hidden accept=".exe" onChange={handleUpload} />
                            </Button>
                        </CardContent>
                    </Card>
                </Box>
            </Box>


            {/* History Table */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Historique des Versions</Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Fichier</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Version Détectée</TableCell>
                            <TableCell align="right">Taille</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{item.filename}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={item.type}
                                        color={item.type === 'yml' ? 'primary' : 'secondary'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>{item.version || '-'}</TableCell>
                                <TableCell align="right">{(item.size / 1024 / 1024).toFixed(2)} MB</TableCell>
                            </TableRow>
                        ))}
                        {history.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Aucun historique disponible</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle2">URLs de Téléchargement Direct :</Typography>
                <ul>
                    <li><a href="http://localhost:5005/updates/latest.yml" target="_blank" rel="noreferrer">http://localhost:5005/updates/latest.yml</a></li>
                </ul>
            </Box>
        </Box>
    );
}
