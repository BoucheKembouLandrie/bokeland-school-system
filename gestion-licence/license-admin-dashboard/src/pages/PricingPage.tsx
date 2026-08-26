import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Button, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, MenuItem, IconButton, Chip, Tooltip, Alert, CircularProgress
} from '@mui/material';
import { Add, Edit, Delete, MonetizationOn, CheckCircle, Cancel } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

interface Pricing {
    id: number;
    currency: string;
    amount: number;
    days_added: number;
    label: string;
    is_active: boolean;
}

const CURRENCIES = [
    { code: 'XAF', name: 'Franc CFA (CEMAC) - Cameroun, Gabon, Congo...' },
    { code: 'XOF', name: 'Franc CFA (UEMOA) - Sénégal, Côte d\'Ivoire...' },
    { code: 'GNF', name: 'Franc Guinéen - Guinée' },
    { code: 'CDF', name: 'Franc Congolais - RDC' },
    { code: 'BIF', name: 'Franc Burundais - Burundi' },
    { code: 'KMF', name: 'Franc Comorien - Comores' },
    { code: 'DJF', name: 'Franc Djibouti - Djibouti' },
    { code: 'SCR', name: 'Roupie Seychelloise - Seychelles' },
];

const PricingPage = () => {
    const [pricings, setPricings] = useState<Pricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({ currency: 'XAF', amount: '', days_added: '444', label: 'Abonnement annuel', is_active: true });

    const fetchPricings = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/admin/pricing`);
            setPricings(res.data);
        } catch (e) {
            setError('Impossible de charger les tarifs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPricings(); }, []);

    const handleOpen = (pricing?: Pricing) => {
        if (pricing) {
            setEditingId(pricing.id);
            setForm({ currency: pricing.currency, amount: String(pricing.amount), days_added: String(pricing.days_added), label: pricing.label, is_active: pricing.is_active });
        } else {
            setEditingId(null);
            setForm({ currency: 'XAF', amount: '', days_added: '444', label: 'Abonnement annuel', is_active: true });
        }
        setError('');
        setOpenDialog(true);
    };

    const handleSave = async () => {
        if (!form.amount || parseFloat(form.amount) <= 0) { setError('Le montant est requis.'); return; }
        setSaving(true); setError('');
        try {
            const payload = { currency: form.currency, amount: parseFloat(form.amount), days_added: parseInt(form.days_added), label: form.label, is_active: form.is_active };
            if (editingId) {
                await axios.put(`${API_URL}/api/admin/pricing/${editingId}`, payload);
            } else {
                await axios.post(`${API_URL}/api/admin/pricing`, payload);
            }
            setOpenDialog(false);
            fetchPricings();
        } catch (e: any) {
            setError(e.response?.data?.error || 'Erreur lors de l\'enregistrement.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Supprimer ce tarif ?')) return;
        try {
            await axios.delete(`${API_URL}/api/admin/pricing/${id}`);
            fetchPricings();
        } catch { alert('Erreur lors de la suppression.'); }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Tarification</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mt: 0.5 }}>Gérez les prix d'abonnement par devise</Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}
                    sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', fontWeight: 700, borderRadius: 2 }}>
                    Ajouter un tarif
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
            ) : pricings.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <MonetizationOn sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">Aucun tarif configuré. Ajoutez votre premier tarif.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2.5}>
                    {pricings.map(p => (
                        <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card sx={{ position: 'relative', borderRadius: 3, border: p.is_active ? '1px solid rgba(124,110,241,0.3)' : '1px solid rgba(255,255,255,0.08)' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <MonetizationOn sx={{ color: '#fff', fontSize: 22 }} />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontWeight: 800, fontSize: '1.1rem' }}>{p.currency}</Typography>
                                                <Chip label={p.is_active ? 'Actif' : 'Inactif'} size="small"
                                                    sx={{ bgcolor: p.is_active ? 'rgba(52,211,153,0.15)' : 'rgba(248,113,113,0.15)', color: p.is_active ? '#34D399' : '#F87171', fontWeight: 700, fontSize: '0.7rem' }} />
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Tooltip title="Modifier"><IconButton size="small" onClick={() => handleOpen(p)}><Edit sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                            <Tooltip title="Supprimer"><IconButton size="small" onClick={() => handleDelete(p.id)} sx={{ color: '#F87171' }}><Delete sx={{ fontSize: 16 }} /></IconButton></Tooltip>
                                        </Box>
                                    </Box>
                                    <Typography sx={{ fontSize: '1.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#34D399,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                        {Number(p.amount).toLocaleString()} <span style={{ fontSize: '0.9rem' }}>{p.currency}</span>
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary', fontSize: '0.82rem', mt: 0.5 }}>{p.label}</Typography>
                                    <Typography sx={{ color: '#7C6EF1', fontWeight: 600, fontSize: '0.82rem', mt: 1 }}>✦ {p.days_added} jours d'abonnement</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 700 }}>{editingId ? 'Modifier le tarif' : 'Nouveau tarif'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField select fullWidth label="Devise" value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} disabled={!!editingId}>
                            {CURRENCIES.map(c => <MenuItem key={c.code} value={c.code}>{c.code} — {c.name}</MenuItem>)}
                        </TextField>
                        <TextField fullWidth label="Montant" type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} InputProps={{ endAdornment: <Typography sx={{ color: 'text.secondary', ml: 1 }}>{form.currency}</Typography> }} />
                        <TextField fullWidth label="Nombre de jours d'abonnement" type="number" value={form.days_added} onChange={e => setForm(f => ({ ...f, days_added: e.target.value }))} />
                        <TextField fullWidth label="Label (ex: Abonnement annuel)" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                        <TextField select fullWidth label="Statut" value={form.is_active ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'active' }))}>
                            <MenuItem value="active"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CheckCircle sx={{ color: '#34D399', fontSize: 16 }} />Actif</Box></MenuItem>
                            <MenuItem value="inactive"><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Cancel sx={{ color: '#F87171', fontSize: 16 }} />Inactif</Box></MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setOpenDialog(false)} disabled={saving}>Annuler</Button>
                    <Button variant="contained" onClick={handleSave} disabled={saving}
                        sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', fontWeight: 700 }}>
                        {saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : 'Enregistrer'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PricingPage;
