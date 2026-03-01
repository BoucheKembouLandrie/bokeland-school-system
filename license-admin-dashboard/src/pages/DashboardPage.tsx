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
                axios.get('http://localhost:3001/api/admin/clients'),
                axios.get('http://localhost:3001/api/admin/stats'),
                axios.get('http://localhost:3001/api/admin/config')
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
            await axios.put('http://localhost:3001/api/admin/config', {
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
                    await axios.put(`http://localhost:3001/api/admin/clients/${selectedClient.id}`, {
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

                    await axios.post('http://localhost:3001/api/admin/payments', payload);
                } else {
                    alert("L'extension n'est pas autorisée pour ce statut.");
                    return;
                }
            } else {
                // Just status update without extension
                await axios.put(`http://localhost:3001/api/admin/clients/${selectedClient.id}`, {
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
            await axios.delete(`http://localhost:3001/api/admin/clients/${id}`);
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
                                            <TableCell>{new Date(client.subscription_end_date).toLocaleDateString()}</TableCell>
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
                    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                        <Paper sx={{ p: 4 }}>
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
                            >
                                {configLoading ? 'Mise à jour...' : 'Sauvegarder les modifications'}
                            </Button>
                        </Paper>

                        {/* Logo Configuration */}
                        <Paper sx={{ p: 4, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Logo de l'Entreprise
                            </Typography>
                            <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                { /* Display Current Logo if known (we need to fetch it separately or assume path) */}
                                {/* For simplicity, we just show a preview if a file is selected or let user upload to see changes */}
                                <img
                                    src="http://localhost:3001/uploads/company_logo.png"
                                    alt="Logo"
                                    style={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain', border: '1px dashed #ccc' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                    key={Date.now()} // Force refresh on re-render
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
                                                await axios.post('http://localhost:3001/api/admin/config/logo', formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                alert('Logo mis à jour avec succès');
                                                // Trigger re-render or reload image
                                                fetchData();
                                            } catch (error) {
                                                console.error('Upload error', error);
                                                alert('Erreur lors du téléchargement du logo');
                                            }
                                        }
                                    }}
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="outlined" component="span" startIcon={<Edit />}>
                                        Changer le Logo
                                    </Button>
                                </label>
                                <Typography variant="caption" color="textSecondary">
                                    Format: PNG (recommandé), JPG. Le logo sera visible sur les factures PDF.
                                </Typography>
                            </Box>
                        </Paper>

                        {/* Signature Configuration */}
                        <Paper sx={{ p: 4, mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Signature de l'Entreprise
                            </Typography>
                            <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                                <img
                                    src="http://localhost:3001/uploads/company_signature.png"
                                    alt="Signature"
                                    style={{ maxWidth: 200, maxHeight: 100, objectFit: 'contain', border: '1px dashed #ccc' }}
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                    key={Date.now() + 'sig'} // Force refresh on re-render
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
                                                await axios.post('http://localhost:3001/api/admin/config/signature', formData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                alert('Signature mise à jour avec succès');
                                                // Trigger re-render or reload image
                                                fetchData();
                                            } catch (error) {
                                                console.error('Upload error', error);
                                                alert('Erreur lors du téléchargement de la signature');
                                            }
                                        }
                                    }}
                                />
                                <label htmlFor="raised-button-file-signature">
                                    <Button variant="outlined" component="span" startIcon={<Edit />}>
                                        Changer la Signature
                                    </Button>
                                </label>
                                <Typography variant="caption" color="textSecondary">
                                    Format: PNG (transparent recommandé). Apparaîtra au bas des reçus.
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                )
            }


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
