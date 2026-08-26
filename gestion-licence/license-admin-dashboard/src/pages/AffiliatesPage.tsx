import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Avatar, Card, CardContent, Grid, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import { People, Wallet, Edit, CheckCircle, Block } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

interface Affiliate {
    id: number;
    email: string;
    phone_number: string | null;
    balance: number;
    status: 'GHOST' | 'ACTIVE' | 'BANNED';
    custom_commission_rate: number | null;
    currency: string | null;
    createdAt: string;
    clients?: { school_name: string; status: string }[];
    commissions?: { amount: number }[];
}

const AffiliatesPage = () => {
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [loading, setLoading] = useState(true);
    const [editDialog, setEditDialog] = useState(false);
    const [selected, setSelected] = useState<Affiliate | null>(null);
    const [customRate, setCustomRate] = useState('');
    const [balanceAdjust, setBalanceAdjust] = useState('');
    const [adjustNote, setAdjustNote] = useState('');

    const fetchAffiliates = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/api/admin/affiliates`);
            setAffiliates(res.data);
        } catch (e) {
            console.error('Error fetching affiliates:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAffiliates(); }, []);

    const totalBalance = affiliates.reduce((sum, a) => sum + Number(a.balance), 0);
    const activeCount = affiliates.filter(a => a.status === 'ACTIVE').length;
    const ghostCount = affiliates.filter(a => a.status === 'GHOST').length;

    const handleOpenEdit = (affiliate: Affiliate) => {
        setSelected(affiliate);
        setCustomRate(affiliate.custom_commission_rate !== null ? String(affiliate.custom_commission_rate) : '');
        setBalanceAdjust('');
        setAdjustNote('');
        setEditDialog(true);
    };

    const handleSave = async () => {
        if (!selected) return;
        try {
            await axios.put(`${API_URL}/api/admin/affiliates/${selected.id}`, {
                custom_commission_rate: customRate !== '' ? parseFloat(customRate) : null,
                balance_adjustment: balanceAdjust !== '' ? parseFloat(balanceAdjust) : 0,
                note: adjustNote
            });
            setEditDialog(false);
            fetchAffiliates();
        } catch (e: any) {
            alert(`Erreur: ${e.response?.data?.error || e.message}`);
        }
    };

    const handleToggleBan = async (affiliate: Affiliate) => {
        const newStatus = affiliate.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
        if (!confirm(`Changer le statut de ${affiliate.email} à ${newStatus} ?`)) return;
        try {
            await axios.put(`${API_URL}/api/admin/affiliates/${affiliate.id}`, { status: newStatus });
            fetchAffiliates();
        } catch (e: any) {
            alert(`Erreur: ${e.response?.data?.error || e.message}`);
        }
    };

    const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
        ACTIVE: { label: 'Actif', color: '#34D399', bg: 'rgba(52,211,153,0.12)' },
        GHOST: { label: 'Non réclamé', color: '#60A5FA', bg: 'rgba(96,165,250,0.12)' },
        BANNED: { label: 'Banni', color: '#F87171', bg: 'rgba(248,113,113,0.12)' },
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Stats */}
            <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Partenaires Total
                                </Typography>
                                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #7C6EF1, #5B4FCC)' }}>
                                    <People sx={{ fontSize: 18 }} />
                                </Avatar>
                            </Box>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {affiliates.length}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>
                                {activeCount} actifs · {ghostCount} non réclamés
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                    Commissions à Verser
                                </Typography>
                                <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg,#34D399,#059669)' }}>
                                    <Wallet sx={{ fontSize: 18 }} />
                                </Avatar>
                            </Box>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(135deg,#34D399,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                {Number(totalBalance).toLocaleString()}
                            </Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>Total cumulé des soldes</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{ background: 'linear-gradient(135deg,rgba(124,110,241,0.15),rgba(45,212,191,0.1))', border: '1px solid rgba(124,110,241,0.25) !important' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', mb: 1.5 }}>
                                Taux par Défaut
                            </Typography>
                            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#7C6EF1' }}>20%</Typography>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5 }}>Modifiable par partenaire</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Liste des Partenaires</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                        {affiliates.length} partenaire{affiliates.length > 1 ? 's' : ''} enregistré{affiliates.length > 1 ? 's' : ''}
                    </Typography>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ '& .MuiTableCell-head': { background: 'rgba(255,255,255,0.02)' } }}>
                                <TableCell>Partenaire</TableCell>
                                <TableCell>Téléphone</TableCell>
                                <TableCell>Écoles</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Taux</TableCell>
                                <TableCell>Solde</TableCell>
                                <TableCell>Inscrit le</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {affiliates.map((affiliate) => {
                                const sc = statusConfig[affiliate.status] || statusConfig.GHOST;
                                return (
                                    <TableRow key={affiliate.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)' }}>
                                                    {affiliate.email.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{affiliate.email}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary' }}>
                                                {affiliate.phone_number || '—'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {affiliate.clients && affiliate.clients.length > 0 ? (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 220 }}>
                                                    {affiliate.clients.map((c, idx) => (
                                                        <Box key={idx} sx={{
                                                            fontSize: '0.72rem',
                                                            bgcolor: 'rgba(255,255,255,0.05)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            px: 1,
                                                            py: 0.2,
                                                            borderRadius: 1,
                                                            fontWeight: 500
                                                        }}>
                                                            {c.school_name}
                                                        </Box>
                                                    ))}
                                                </Box>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', fontStyle: 'italic' }}>Aucune</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: 8, backgroundColor: sc.bg }}>
                                                <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: sc.color, boxShadow: `0 0 6px ${sc.color}` }} />
                                                <Typography sx={{ color: sc.color, fontSize: '0.78rem', fontWeight: 700 }}>{sc.label}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.83rem', fontWeight: 600, color: '#7C6EF1' }}>
                                                {affiliate.custom_commission_rate !== null ? `${affiliate.custom_commission_rate}%` : '20% (défaut)'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {affiliate.currency ? (
                                                <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: '#34D399' }}>
                                                    {Number(affiliate.balance).toLocaleString()} {affiliate.currency}
                                                </Typography>
                                            ) : (
                                                <Typography sx={{ fontSize: '0.78rem', color: '#FBBF24', fontStyle: 'italic', fontWeight: 500 }}>
                                                    Aucune devise liée au compte
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                {new Date(affiliate.createdAt).toLocaleDateString('fr-FR')}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                <IconButton size="small" onClick={() => handleOpenEdit(affiliate)}
                                                    sx={{ bgcolor: 'rgba(124,110,241,0.12)', '&:hover': { bgcolor: 'rgba(124,110,241,0.25)' } }}>
                                                    <Edit sx={{ fontSize: 16, color: '#7C6EF1' }} />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleToggleBan(affiliate)}
                                                    sx={{ bgcolor: affiliate.status === 'BANNED' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', '&:hover': { bgcolor: affiliate.status === 'BANNED' ? 'rgba(52,211,153,0.22)' : 'rgba(248,113,113,0.22)' } }}>
                                                    {affiliate.status === 'BANNED'
                                                        ? <CheckCircle sx={{ fontSize: 16, color: '#34D399' }} />
                                                        : <Block sx={{ fontSize: 16, color: '#F87171' }} />
                                                    }
                                                </IconButton>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {affiliates.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                        <Typography sx={{ color: 'text.secondary' }}>Aucun partenaire enregistré</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Edit Dialog */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', width: 40, height: 40, fontSize: '0.9rem', fontWeight: 700 }}>
                            {selected?.email.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Modifier le partenaire</Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{selected?.email}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
                        <TextField
                            label="Taux de commission personnalisé (%)"
                            type="number"
                            value={customRate}
                            onChange={(e) => setCustomRate(e.target.value)}
                            helperText="Laissez vide pour utiliser le taux par défaut (20%)"
                            inputProps={{ min: 0, max: 100, step: 0.5 }}
                            fullWidth
                        />
                        <TextField
                            label="Ajuster le solde (XAF)"
                            type="number"
                            value={balanceAdjust}
                            onChange={(e) => setBalanceAdjust(e.target.value)}
                            helperText="Positif pour ajouter, négatif pour déduire"
                            fullWidth
                        />
                        <TextField
                            label="Note (optionnelle)"
                            value={adjustNote}
                            onChange={(e) => setAdjustNote(e.target.value)}
                            helperText="Ex: Remboursement retrait rejeté"
                            fullWidth
                        />
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

export default AffiliatesPage;
