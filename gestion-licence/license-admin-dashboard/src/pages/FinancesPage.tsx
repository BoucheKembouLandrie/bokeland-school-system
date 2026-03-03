import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, MenuItem, Select, FormControl, InputLabel,
    IconButton, Tooltip, Button, Avatar
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { Download, TrendingUp, MonetizationOn, Payment, Group, CalendarMonth } from '@mui/icons-material';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend,
    AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface Payment {
    id: number;
    client_id: number;
    amount: number;
    payment_date: string;
    payment_method: string;
    transaction_id: string;
    status: string;
    days_added: number;
    invoice_number?: string;
    Client: {
        id: number;
        school_name: string;
        email: string;
        phone: string;
        status: string;
    };
}

interface RevenueSummary {
    total_revenue: number;
    payment_count: number;
    average_payment: number;
    method_breakdown: { [key: string]: number };
}

const COLORS = ['#7C6EF1', '#2DD4BF', '#FBBF24', '#F87171'];

const FinancesPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [summary, setSummary] = useState<RevenueSummary>({ total_revenue: 0, payment_count: 0, average_payment: 0, method_breakdown: {} });
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('');

    const fetchData = async () => {
        try {
            const params: any = {};
            if (startDate) params.start_date = startDate.format('YYYY-MM-DD');
            if (endDate) params.end_date = endDate.format('YYYY-MM-DD');
            if (paymentMethod) params.payment_method = paymentMethod;
            const [paymentsRes, summaryRes] = await Promise.all([
                axios.get('http://localhost:5005/api/admin/payments', { params }),
                axios.get('http://localhost:5005/api/admin/revenue/summary', { params: { start_date: params.start_date, end_date: params.end_date } })
            ]);
            setPayments(paymentsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Error fetching financial data', error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDownloadInvoice = async (payment: Payment) => {
        if (!payment.invoice_number) return;
        try {
            const response = await axios.get(`http://localhost:5005/api/admin/payments/${payment.id}/invoice`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${payment.invoice_number}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch { alert('Impossible de télécharger la facture.'); }
    };

    const pieData = Object.entries(summary.method_breakdown).map(([name, value]) => ({ name, value }));

    const trendMap: { [key: string]: number } = {};
    payments.forEach(p => {
        const date = dayjs(p.payment_date).format('DD/MM');
        trendMap[date] = (trendMap[date] || 0) + p.amount;
    });
    const lineData = Object.entries(trendMap).map(([date, amount]) => ({ date, amount }));

    const activeClients = [...new Set(payments.filter(p => p.Client?.status === 'ACTIVE').map(p => p.client_id))].length;

    const statCards = [
        { label: 'Revenu Total', value: `${summary.total_revenue.toLocaleString()} FCFA`, icon: <MonetizationOn sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#34D399,#059669)', glow: 'rgba(52,211,153,0.3)', sub: 'Tous les paiements' },
        { label: 'Nb Paiements', value: summary.payment_count, icon: <Payment sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#7C6EF1,#5B4FCC)', glow: 'rgba(124,110,241,0.3)', sub: 'Transactions enregistrées' },
        { label: 'Paiement Moyen', value: `${Math.round(summary.average_payment).toLocaleString()} FCFA`, icon: <TrendingUp sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#60A5FA,#3B82F6)', glow: 'rgba(96,165,250,0.3)', sub: 'Par transaction' },
        { label: 'Clients Actifs', value: activeClients, icon: <Group sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#FBBF24,#D97706)', glow: 'rgba(251,191,36,0.3)', sub: 'Abonnements en cours' },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ mb: 4 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Finances & Paiements</Typography>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mt: 0.5 }}>Historique et statistiques financières</Typography>
                </Box>

                {/* Stat Cards */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {statCards.map((card, i) => (
                        <Grid key={i} size={{ xs: 6, md: 3 }}>
                            <Card sx={{ position: 'relative', overflow: 'hidden' }}>
                                <Box sx={{ position: 'absolute', top: -15, right: -15, width: 80, height: 80, borderRadius: '50%', background: card.gradient, opacity: 0.15, filter: 'blur(18px)' }} />
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{card.label}</Typography>
                                        <Avatar sx={{ width: 34, height: 34, background: card.gradient, boxShadow: `0 4px 12px ${card.glow}` }}>{card.icon}</Avatar>
                                    </Box>
                                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, background: card.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>{card.value}</Typography>
                                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.5 }}>{card.sub}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Filters */}
                <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DatePicker label="Date Début" value={startDate} onChange={setStartDate} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <DatePicker label="Date Fin" value={endDate} onChange={setEndDate} slotProps={{ textField: { fullWidth: true, size: 'small' } }} />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Méthode</InputLabel>
                                <Select value={paymentMethod} label="Méthode" onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <MenuItem value="">Tous</MenuItem>
                                    <MenuItem value="manual">Manuel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }}>
                            <Button variant="contained" fullWidth onClick={fetchData} sx={{ height: 40 }}>
                                Filtrer
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Charts */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid size={{ xs: 12, md: 5 }}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 340 }}>
                            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>Répartition par Méthode</Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <PieChart>
                                    <Pie data={pieData.length ? pieData : [{ name: 'Aucun', value: 1 }]} cx="50%" cy="50%" outerRadius={100} innerRadius={50} dataKey="value" label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`} labelLine={false}>
                                        {(pieData.length ? pieData : [{ name: 'Aucun', value: 1 }]).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() + ' FCFA' : value} contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 7 }}>
                        <Paper sx={{ p: 3, borderRadius: 3, height: 340 }}>
                            <Typography sx={{ fontWeight: 700, mb: 2, fontSize: '0.95rem' }}>Tendance des Revenus</Typography>
                            <ResponsiveContainer width="100%" height="85%">
                                <AreaChart data={lineData}>
                                    <defs>
                                        <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C6EF1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7C6EF1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip formatter={(value: any) => typeof value === 'number' ? value.toLocaleString() + ' FCFA' : value} contentStyle={{ background: 'rgba(15,17,23,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                                    <Area type="monotone" dataKey="amount" stroke="#7C6EF1" fill="url(#revenueGrad)" strokeWidth={2} name="Revenu" dot={{ fill: '#7C6EF1', r: 4 }} activeDot={{ r: 6 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Payments Table */}
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Historique des paiements</Typography>
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>{payments.length} transaction{payments.length > 1 ? 's' : ''}</Typography>
                    </Box>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ '& .MuiTableCell-head': { background: 'rgba(255,255,255,0.02)' } }}>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Client</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Montant</TableCell>
                                    <TableCell>Méthode</TableCell>
                                    <TableCell>Jours Ajoutés</TableCell>
                                    <TableCell>Statut</TableCell>
                                    <TableCell>Reçu</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.map((payment) => (
                                    <TableRow key={payment.id}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <CalendarMonth sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                <Typography sx={{ fontSize: '0.83rem' }}>{new Date(payment.payment_date).toLocaleDateString('fr-FR')}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.72rem', fontWeight: 700, background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)' }}>
                                                    {payment.Client?.school_name?.charAt(0) || '?'}
                                                </Avatar>
                                                <Typography sx={{ fontSize: '0.83rem', fontWeight: 600 }}>{payment.Client?.school_name || '—'}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.83rem', color: '#7C6EF1' }}>{payment.Client?.email || '—'}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#34D399' }}>{payment.amount.toLocaleString()} FCFA</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={payment.payment_method} size="small" sx={{ bgcolor: 'rgba(124,110,241,0.15)', color: '#7C6EF1', fontWeight: 600, fontSize: '0.75rem' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={`+${payment.days_added}j`} size="small" sx={{ bgcolor: 'rgba(45,212,191,0.12)', color: '#2DD4BF', fontWeight: 700, fontSize: '0.75rem' }} />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.7, px: 1.2, py: 0.4, borderRadius: 6, bgcolor: payment.status === 'completed' ? 'rgba(52,211,153,0.12)' : 'rgba(251,191,36,0.12)' }}>
                                                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: payment.status === 'completed' ? '#34D399' : '#FBBF24' }} />
                                                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: payment.status === 'completed' ? '#34D399' : '#FBBF24' }}>
                                                    {payment.status === 'completed' ? 'Complété' : payment.status}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            {payment.invoice_number && (
                                                <Tooltip title="Télécharger le reçu PDF">
                                                    <IconButton size="small" onClick={() => handleDownloadInvoice(payment)} sx={{ bgcolor: 'rgba(124,110,241,0.1)', '&:hover': { bgcolor: 'rgba(124,110,241,0.25)' } }}>
                                                        <Download sx={{ fontSize: 16, color: '#7C6EF1' }} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {payments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                            <Typography sx={{ color: 'text.secondary' }}>Aucun paiement enregistré</Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default FinancesPage;
