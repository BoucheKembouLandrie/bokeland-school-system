import { useEffect, useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, MenuItem, Select, FormControl, InputLabel,
    IconButton, Tooltip, Avatar, TextField, InputAdornment, Button
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { API_URL } from '../config';
import { Download, TrendingUp, MonetizationOn, Payment, Group, CalendarMonth, Search, AttachMoney } from '@mui/icons-material';
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
    by_currency: { [key: string]: { total: number; count: number; average: number } };
}

const COLORS = ['#7C6EF1', '#2DD4BF', '#FBBF24', '#F87171'];

const FinancesPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [summary, setSummary] = useState<RevenueSummary>({ total_revenue: 0, payment_count: 0, average_payment: 0, method_breakdown: {}, by_currency: {} });

    // ── filter states ──
    const [startDate, setStartDate] = useState<Dayjs | null>(null);
    const [endDate, setEndDate] = useState<Dayjs | null>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [amountSearch, setAmountSearch] = useState('');
    const [currencyFilter, setCurrencyFilter] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    // ── available methods derived from data ──
    const availableMethods = useMemo(() => {
        const methods = new Set(payments.map(p => p.payment_method).filter(Boolean));
        return Array.from(methods);
    }, [payments]);

    const fetchData = async () => {
        try {
            const [paymentsRes, summaryRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/payments`),
                axios.get(`${API_URL}/api/admin/revenue/summary`)
            ]);
            setPayments(paymentsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Error fetching financial data', error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // ── client-side live filtering ──
    const filteredPayments = useMemo(() => {
        return payments.filter(p => {
            const pDate = dayjs(p.payment_date);

            // Date range
            if (startDate && pDate.isBefore(startDate.startOf('day'))) return false;
            if (endDate && pDate.isAfter(endDate.endOf('day'))) return false;

            // Client name (first chars, case insensitive)
            if (clientSearch.trim()) {
                const name = p.Client?.school_name?.toLowerCase() ?? '';
                if (!name.startsWith(clientSearch.trim().toLowerCase())) return false;
            }

            // Amount (exact or partial match on the number)
            if (amountSearch.trim()) {
                if (!String(p.amount).startsWith(amountSearch.trim())) return false;
            }

            // Payment method
            if (paymentMethod && p.payment_method !== paymentMethod) return false;

            // Currency
            if (currencyFilter && (p as any).currency !== currencyFilter) return false;

            return true;
        });
    }, [payments, startDate, endDate, clientSearch, amountSearch, paymentMethod, currencyFilter]);

    const handleExportXlsx = () => {
        if (filteredPayments.length === 0) return;
        const rows = filteredPayments.map(p => ({
            'Date': new Date(p.payment_date).toLocaleDateString('fr-FR'),
            'Client': p.Client?.school_name || '—',
            'Email': p.Client?.email || '—',
            'Montant': p.amount,
            'Devise': (p as any).currency || 'XAF',
            'Méthode': p.payment_method,
            'Jours Ajoutés': p.days_added,
            'Statut': p.status === 'completed' ? 'Complété' : p.status,
            'N° Facture': p.invoice_number || '—',
        }));
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Paiements');
        XLSX.writeFile(wb, `paiements_${new Date().toISOString().slice(0, 10)}.xlsx`);
    };

    const handleDownloadInvoice = async (payment: Payment) => {
        if (!payment.invoice_number) return;
        try {
            const response = await axios.get(`${API_URL}/api/admin/payments/${payment.id}/invoice`, { responseType: 'blob' });
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
        {
            label: 'Revenu Total',
            value: Object.keys(summary.by_currency).length > 0
                ? Object.entries(summary.by_currency).map(([cur, d]) => `${d.total.toLocaleString()} ${cur}`).join(' + ')
                : `${summary.total_revenue.toLocaleString()} XAF`,
            icon: <MonetizationOn sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#34D399,#059669)', glow: 'rgba(52,211,153,0.3)', sub: 'Tous les paiements'
        },
        { label: 'Nb Paiements', value: summary.payment_count, icon: <Payment sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#7C6EF1,#5B4FCC)', glow: 'rgba(124,110,241,0.3)', sub: 'Transactions enregistrées' },
        {
            label: 'Paiement Moyen',
            value: Object.keys(summary.by_currency).length > 0
                ? Object.entries(summary.by_currency).map(([cur, d]) => `${Math.round(d.average).toLocaleString()} ${cur}`).join(' / ')
                : `${Math.round(summary.average_payment).toLocaleString()} XAF`,
            icon: <TrendingUp sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#60A5FA,#3B82F6)', glow: 'rgba(96,165,250,0.3)', sub: 'Par transaction'
        },
        { label: 'Clients Actifs', value: activeClients, icon: <Group sx={{ fontSize: 20 }} />, gradient: 'linear-gradient(135deg,#FBBF24,#D97706)', glow: 'rgba(251,191,36,0.3)', sub: 'Abonnements en cours' },
    ];

    const hasActiveFilter = !!(startDate || endDate || clientSearch.trim() || amountSearch.trim() || paymentMethod || currencyFilter);

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

                {/* ── Live Filters ── */}
                <Paper sx={{ p: 2.5, mb: 4, borderRadius: 3, border: hasActiveFilter ? '1px solid rgba(124,110,241,0.35)' : '1px solid transparent', transition: 'border 0.25s' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Search sx={{ fontSize: 16, color: '#7C6EF1' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.88rem', color: '#7C6EF1' }}>Filtres</Typography>
                        {hasActiveFilter && (
                            <Chip
                                label={`${filteredPayments.length} résultat${filteredPayments.length !== 1 ? 's' : ''}`}
                                size="small"
                                sx={{ bgcolor: 'rgba(124,110,241,0.15)', color: '#7C6EF1', fontWeight: 700, fontSize: '0.75rem' }}
                            />
                        )}
                        <Button
                            variant="contained"
                            size="small"
                            startIcon={<Download sx={{ fontSize: 15 }} />}
                            onClick={handleExportXlsx}
                            disabled={filteredPayments.length === 0}
                            sx={{
                                ml: 'auto',
                                background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.78rem',
                                px: 2,
                                py: 0.7,
                                borderRadius: 2,
                                whiteSpace: 'nowrap',
                                boxShadow: '0 4px 14px rgba(124,110,241,0.35)',
                                '&:hover': { opacity: 0.88 },
                                '&:disabled': { opacity: 0.3 },
                            }}
                        >
                            Exporter XLSX
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'nowrap' }}>
                        {/* Date Début */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <DatePicker
                                label="Date Début"
                                value={startDate}
                                onChange={setStartDate}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Box>
                        {/* Date Fin */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <DatePicker
                                label="Date Fin"
                                value={endDate}
                                onChange={setEndDate}
                                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                            />
                        </Box>
                        {/* Client */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Client (3 premiers car.)"
                                placeholder="ex: Tes"
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                inputProps={{ maxLength: 20 }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Search sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        {/* Montant */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Montant (FCFA)"
                                placeholder="ex: 444"
                                type="number"
                                value={amountSearch}
                                onChange={(e) => setAmountSearch(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        {/* Devise */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Devise</InputLabel>
                                <Select value={currencyFilter} label="Devise" onChange={(e) => setCurrencyFilter(e.target.value)}>
                                    <MenuItem value=""><em>Toutes</em></MenuItem>
                                    {['XAF','XOF','GNF','CDF','BIF','KMF','DJF','SCR'].map(c => (<MenuItem key={c} value={c}>{c}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Méthode */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Méthode</InputLabel>
                                <Select value={paymentMethod} label="Méthode" onChange={(e) => setPaymentMethod(e.target.value)}>
                                    <MenuItem value=""><em>Toutes</em></MenuItem>
                                    {availableMethods.map(m => (
                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        {/* Reset */}
                        {hasActiveFilter && (
                            <Box
                                component="button"
                                onClick={() => {
                                    setStartDate(null);
                                    setEndDate(null);
                                    setClientSearch('');
                                    setAmountSearch('');
                                    setPaymentMethod('');
                                    setCurrencyFilter('');
                                }}
                                sx={{
                                    cursor: 'pointer', background: 'none', border: '1px solid rgba(248,113,113,0.4)',
                                    borderRadius: 2, px: 2, py: 0.9, color: '#F87171', fontSize: '0.82rem',
                                    fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0,
                                    '&:hover': { bgcolor: 'rgba(248,113,113,0.1)' },
                                    transition: 'background 0.2s',
                                }}
                            >
                                ✕ Réinitialiser
                            </Box>
                        )}
                    </Box>
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
                    <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Historique des paiements</Typography>
                            <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                {filteredPayments.length} transaction{filteredPayments.length !== 1 ? 's' : ''}
                                {hasActiveFilter && payments.length !== filteredPayments.length && (
                                    <span style={{ color: '#7C6EF1' }}> (sur {payments.length})</span>
                                )}
                            </Typography>
                        </Box>
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
                                {filteredPayments.map((payment) => (
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
                                            <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#34D399' }}>
                                                {payment.amount.toLocaleString()} {(payment as any).currency || 'XAF'}
                                            </Typography>
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
                                {filteredPayments.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                            <Typography sx={{ color: 'text.secondary' }}>
                                                {hasActiveFilter ? 'Aucun résultat pour ces filtres' : 'Aucun paiement enregistré'}
                                            </Typography>
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
