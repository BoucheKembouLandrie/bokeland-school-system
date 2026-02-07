import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Grid, Card, CardContent, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Button, Chip, MenuItem, Select, FormControl, InputLabel,
    IconButton, Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import axios from 'axios';
import { Download, PieChart as PieChartIcon, TrendingUp } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

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

const FinancesPage = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [summary, setSummary] = useState<RevenueSummary>({
        total_revenue: 0,
        payment_count: 0,
        average_payment: 0,
        method_breakdown: {}
    });
    const [startDate, setStartDate] = useState<Dayjs | null>(null); // No default date filter
    const [endDate, setEndDate] = useState<Dayjs | null>(null); // No default date filter
    const [paymentMethod, setPaymentMethod] = useState('');

    const fetchData = async () => {
        try {
            const params: any = {};
            if (startDate) params.start_date = startDate.format('YYYY-MM-DD');
            if (endDate) params.end_date = endDate.format('YYYY-MM-DD');
            if (paymentMethod) params.payment_method = paymentMethod;

            console.log('Fetching payments with params:', params);

            const [paymentsRes, summaryRes] = await Promise.all([
                axios.get('http://localhost:3001/api/admin/payments', { params }),
                axios.get('http://localhost:3001/api/admin/revenue/summary', { params: { start_date: params.start_date, end_date: params.end_date } })
            ]);

            console.log('Received payments:', paymentsRes.data.length);
            setPayments(paymentsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Error fetching financial data', error);
        }
    };

    useEffect(() => {
        fetchData(); // Load all payments on mount
    }, []);

    const handleDownloadInvoice = async (payment: Payment) => {
        if (!payment.invoice_number) return;
        try {
            const response = await axios.get(`http://localhost:3001/api/admin/payments/${payment.id}/invoice`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${payment.invoice_number}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading invoice', error);
            alert('Impossible de télécharger la facture.');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'pending': return 'warning';
            case 'failed': return 'error';
            case 'refunded': return 'default';
            default: return 'default';
        }
    };

    // Prepare data for Pie Chart
    const pieData = Object.entries(summary.method_breakdown).map(([name, value]) => ({ name, value }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    // Prepare data for Line Chart (Revenue Trend - grouping by day for now)
    const trendMap: { [key: string]: number } = {};
    payments.forEach(p => {
        const date = dayjs(p.payment_date).format('DD/MM');
        trendMap[date] = (trendMap[date] || 0) + p.amount;
    });
    const lineData = Object.entries(trendMap).map(([date, amount]) => ({ date, amount })).reverse(); // Assuming reverse chrono sort

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Finances & Paiements
                </Typography>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 3 }}>
                            <DatePicker
                                label="Date Début"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <DatePicker
                                label="Date Fin"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <FormControl fullWidth>
                                <InputLabel id="payment-method-label">Méthode</InputLabel>
                                <Select
                                    labelId="payment-method-label"
                                    value={paymentMethod}
                                    label="Méthode"
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <MenuItem value="">Tous</MenuItem>
                                    <MenuItem value="manual">Manuel</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 3 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={fetchData}
                                sx={{ height: 56, fontWeight: 'bold', textTransform: 'none' }}
                            >
                                Valider
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Revenu Total</Typography>
                                <Typography variant="h4" color="success.main">
                                    {summary.total_revenue.toLocaleString()} FCFA
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Nombre de Paiements</Typography>
                                <Typography variant="h4">{summary.payment_count}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Paiement Moyen</Typography>
                                <Typography variant="h4">
                                    {summary.average_payment.toLocaleString()} FCFA
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Typography color="text.secondary" gutterBottom>Clients Actifs</Typography>
                                <Typography variant="h4">
                                    {payments.filter(p => p.Client.status === 'ACTIVE').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts Section */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: 400 }}>
                            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                                <PieChartIcon sx={{ mr: 1 }} /> Répartition par Méthode
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        outerRadius={120}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip formatter={(value: any) => value.toLocaleString() + ' FCFA'} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 2, height: 400 }}>
                            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
                                <TrendingUp sx={{ mr: 1 }} /> Tendance des Revenus
                            </Typography>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <RechartsTooltip formatter={(value: any) => value.toLocaleString() + ' FCFA'} />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#82ca9d" name="Revenu" activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Payments Table */}
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Client</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Montant</TableCell>
                                <TableCell>Méthode</TableCell>
                                <TableCell>Jours Ajoutés</TableCell>
                                <TableCell>Statut</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell>{new Date(payment.payment_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{payment.Client.school_name}</TableCell>
                                    <TableCell>{payment.Client.email}</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>{payment.amount.toLocaleString()} FCFA</TableCell>
                                    <TableCell>{payment.payment_method}</TableCell>
                                    <TableCell>{payment.days_added} jours</TableCell>
                                    <TableCell>
                                        <Chip label={payment.status} color={getStatusColor(payment.status) as any} size="small" />
                                    </TableCell>
                                    <TableCell>
                                        {payment.invoice_number && (
                                            <Tooltip title="Télécharger la facture">
                                                <IconButton onClick={() => handleDownloadInvoice(payment)} color="primary">
                                                    <Download />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </LocalizationProvider>
    );
};

export default FinancesPage;
