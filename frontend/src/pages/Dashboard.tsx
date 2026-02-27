import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paper, Typography, Box, CircularProgress, TextField, Button, Autocomplete, Dialog, Alert } from '@mui/material';
import { People, School, Payment, AccountBalance, Book, SupervisorAccount, CheckCircle, Settings } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import api from '../services/api';
import { useSchoolYear } from '../contexts/SchoolYearContext';
import ClassTransferModal from '../components/ClassTransferModal';
import StudentTransferModal from '../components/StudentTransferModal';
import TeacherTransferModal from '../components/TeacherTransferModal';
import StaffTransferModal from '../components/StaffTransferModal';
import SubjectTransferModal from '../components/SubjectTransferModal';
import ConfigTransferModal from '../components/ConfigTransferModal';
import LicenseBanner from '../components/LicenseBanner';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => (
    <Paper sx={{
        p: 4,
        backgroundColor: color,
        color: 'white',
        borderRadius: 3,
        boxShadow: `0 4px 12px ${color}40`,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        minHeight: '160px'
    }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                {title}
            </Typography>
            <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                p: 1.5,
                display: 'flex'
            }}>
                {icon}
            </Box>
        </Box>
        <Typography variant="h2" sx={{ fontWeight: 700 }}>
            {loading ? <CircularProgress size={48} sx={{ color: 'white' }} /> : value}
        </Typography>
    </Paper>
);

const Dashboard: React.FC = () => {
    const { t } = useTranslation(); // Add hook
    const { currentYear } = useSchoolYear();

    const [stats, setStats] = useState({
        students: 0,
        classes: 0,
        teachers: 0,
        payments: 0,
    });
    const [loading, setLoading] = useState(true);
    const [financialData, setFinancialData] = useState({
        income: 0,
        expenses: 0
    });

    // Success Rate State
    const [selectedEvaluation, setSelectedEvaluation] = useState<any>(null);
    const [selectedClass, setSelectedClass] = useState<any>(null);
    const [successRateData, setSuccessRateData] = useState<any>(null);
    const [successEvaluations, setSuccessEvaluations] = useState<any[]>([]);
    const [successClasses, setSuccessClasses] = useState<any[]>([]);

    // Suggestion Box State
    const [suggestionForm, setSuggestionForm] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [suggestionSuccessOpen, setSuggestionSuccessOpen] = useState(false);

    const successChartData = successRateData ? [
        { name: t('dashboard.successRate.success'), value: successRateData.success, color: '#4CAF50' },
        { name: t('dashboard.successRate.failure'), value: successRateData.failure, color: '#f44336' }
    ] : [];

    useEffect(() => {
        const fetchStats = async () => {
            console.log('🔍 [Dashboard] Current Year:', currentYear);

            if (!currentYear) {
                console.warn('⚠️ [Dashboard] No school year selected! Data will not be displayed.');
                return;
            }

            setLoading(true);
            try {
                const [studentsRes, classesRes, teachersRes, paymentsRes, expensesRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/classes'),
                    api.get('/teachers'),
                    api.get('/payments'),
                    api.get('/expenses'),
                ]);

                console.log('📊 [Dashboard] Raw Data Counts:', {
                    students: studentsRes.data.length,
                    classes: classesRes.data.length,
                    teachers: teachersRes.data.length,
                    payments: paymentsRes.data.length,
                    expenses: expensesRes.data.length
                });

                // Filter data by the selected school year

                // 1. Classes: Filter by year name (e.g. "2024-2025")
                // Be flexible with property name if API varies
                const yearClasses = classesRes.data.filter((c: any) => c.annee === currentYear.name);
                const yearClassIds = yearClasses.map((c: any) => c.id);

                console.log('🏫 [Dashboard] Year Filtering:', {
                    selectedYear: currentYear.name,
                    totalClasses: classesRes.data.length,
                    matchingClasses: yearClasses.length,
                    classYearsInDB: [...new Set(classesRes.data.map((c: any) => c.annee))]
                });

                // 2. Students: Filter by classes that belong to this year
                const yearStudents = studentsRes.data.filter((s: any) => yearClassIds.includes(s.classe_id));

                console.log('👨‍🎓 [Dashboard] Student Filtering:', {
                    totalStudents: studentsRes.data.length,
                    matchingStudents: yearStudents.length,
                    yearClassIds
                });

                // 3. Teachers: Currently global (unless we link them to classes/years later)
                const teachersCount = teachersRes.data.length;

                // 4. Payments & Expenses: Filter by date range
                // Fallback parsing if startYear/endYear missing (legacy/migration)
                let startYear = currentYear.startYear;
                let endYear = currentYear.endYear;

                if (!startYear || !endYear) {
                    const match = currentYear.name.match(/^(\d{4})-(\d{4})$/);
                    if (match) {
                        startYear = parseInt(match[1]);
                        endYear = parseInt(match[2]);
                    } else {
                        // Ultimate fallback: Use current year logic (legacy behavior)
                        const now = new Date();
                        const curM = now.getMonth();
                        startYear = curM < 7 ? now.getFullYear() - 1 : now.getFullYear();
                        endYear = startYear + 1;
                    }
                }

                const academicYearStart = new Date(startYear, 7, 1); // Aug 1st, StartYear
                const academicYearEnd = new Date(endYear, 6, 31, 23, 59, 59); // July 31st, EndYear

                const yearPayments = paymentsRes.data.filter((payment: any) => {
                    const payDate = new Date(payment.date_paiement);
                    return payDate >= academicYearStart && payDate <= academicYearEnd;
                });

                const yearExpenses = expensesRes.data.filter((expense: any) => {
                    const expDate = new Date(expense.date_depense);
                    return expDate >= academicYearStart && expDate <= academicYearEnd;
                });

                setStats({
                    students: yearStudents.length,
                    classes: yearClasses.length,
                    teachers: teachersCount,
                    payments: yearPayments.length,
                });

                // Calculate Finances
                const totalIncome = yearPayments.reduce((sum: number, p: any) => sum + Number(p.montant || 0), 0);
                const totalExpenses = yearExpenses.reduce((sum: number, e: any) => sum + Number(e.montant || 0), 0);

                setFinancialData({
                    income: totalIncome,
                    expenses: totalExpenses
                });

            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        // Reset filters when year changes
        setSelectedClass(null);
        setSelectedEvaluation(null);
        setSuccessRateData(null);
        fetchSuccessRateOptions(); // Refresh options for dropdowns
    }, [currentYear]);

    // Fetch success rate options (Classes should be filtered by year)
    const fetchSuccessRateOptions = async () => {
        if (!currentYear) return;
        try {
            const [evaluationsRes, classesRes] = await Promise.all([
                api.get('/evaluations'),
                api.get('/classes')
            ]);
            setSuccessEvaluations(evaluationsRes.data);

            // Filter classes for dropdown to only show current year's classes
            const yearClasses = classesRes.data.filter((c: any) => c.annee === currentYear.name);
            setSuccessClasses(yearClasses);

        } catch (error) {
            console.error('Error fetching success rate options:', error);
        }
    };

    // Fetch success rate data when filters change
    // Fetch success rate data when filters change
    useEffect(() => {
        fetchSuccessRate();
    }, [selectedEvaluation, selectedClass]);

    const fetchSuccessRate = async () => {
        try {
            const params: any = {};

            if (selectedEvaluation) {
                params.evaluation = selectedEvaluation.nom;
            }

            if (selectedClass) {
                params.classe_id = selectedClass.id;
            }

            const response = await api.get('/grades/success-rate', { params });
            setSuccessRateData(response.data);
        } catch (error) {
            console.error('Error fetching success rate:', error);
        }
    };

    const handleSuggestionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/suggestions', suggestionForm);
            setSuggestionSuccessOpen(true);
        } catch (error) {
            alert('Erreur lors de l\'envoi de la suggestion');
        }
    };

    const handleSuggestionClose = () => {
        setSuggestionSuccessOpen(false);
        // Reset form ONLY on close
        setSuggestionForm({
            name: '',
            email: '',
            message: ''
        });
    };

    const chartData = [
        { name: `${t('dashboard.financial.income')} (Pensions)`, value: financialData.income, color: '#4CAF50' },
        { name: `${t('dashboard.financial.expenses')} (Dépenses)`, value: financialData.expenses, color: '#f44336' }
    ];

    const [studentTransferOpen, setStudentTransferOpen] = useState(false);
    const [classTransferModalOpen, setClassTransferModalOpen] = useState(false);
    const [teacherTransferOpen, setTeacherTransferOpen] = useState(false);
    const [staffTransferOpen, setStaffTransferOpen] = useState(false);
    const [subjectTransferOpen, setSubjectTransferOpen] = useState(false);
    const [configTransferOpen, setConfigTransferOpen] = useState(false);

    return (
        <Box>
            <Box sx={{ display: 'flex', gap: 4, mb: 4 }}>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        title={t('dashboard.stats.students')}
                        value={stats.students}
                        icon={<School />}
                        color="#1976d2"
                        loading={loading}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        title={t('dashboard.stats.classes')}
                        value={stats.classes}
                        icon={<AccountBalance />}
                        color="#2e7d32"
                        loading={loading}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        title={t('dashboard.stats.teachers')}
                        value={stats.teachers}
                        icon={<People />}
                        color="#ed6c02"
                        loading={loading}
                    />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <StatCard
                        title={t('dashboard.stats.payments')}
                        value={stats.payments}
                        icon={<Payment />}
                        color="#9c27b0"
                        loading={loading}
                    />
                </Box>
            </Box>

            <Box sx={{ mt: 4, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
                <Box sx={{ maxWidth: '40%' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {t('dashboard.welcome', { name: 'BOKELAND SCHOOL SYSTEM' })}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                        {t('dashboard.subtitle')}
                    </Typography>
                </Box>
                <Box sx={{ flex: 1, minWidth: '500px' }}>
                    <LicenseBanner />
                </Box>
            </Box>

            {/* 4-column layout */}
            <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
                {/* Column 1: Pie Chart */}
                <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {t('dashboard.financial.title')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                        {t('dashboard.financial.period', {
                            startYear: currentYear?.startYear || (currentYear?.name ? parseInt(currentYear.name.split('-')[0]) : '...'),
                            endYear: currentYear?.endYear || (currentYear?.name ? parseInt(currentYear.name.split('-')[1]) : '...')
                        })}
                    </Typography>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-around' }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="textSecondary">{t('dashboard.financial.income')}</Typography>
                            <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                                {financialData.income.toLocaleString(undefined, { maximumFractionDigits: 2 })} FCFA
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="caption" color="textSecondary">{t('dashboard.financial.expenses')}</Typography>
                            <Typography variant="h6" sx={{ color: '#f44336', fontWeight: 600 }}>
                                {financialData.expenses.toLocaleString(undefined, { maximumFractionDigits: 2 })} FCFA
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ mt: 'auto', width: '100%' }}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                        const RADIAN = Math.PI / 180;
                                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                        return (
                                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                {`${(percent * 100).toFixed(0)}%`}
                                            </text>
                                        );
                                    }}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()} FCFA`} />
                                <Legend
                                // ... [Legend Config same as before]
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Paper>

                {/* Column 2: Success Rate Chart */}
                <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {t('dashboard.successRate.title')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                        {t('dashboard.successRate.subtitle')}
                    </Typography>

                    {/* Filters */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                        <Autocomplete
                            options={successEvaluations}
                            getOptionLabel={(option) => option.nom}
                            value={selectedEvaluation}
                            onChange={(_, newValue) => setSelectedEvaluation(newValue)}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Typography sx={{ fontSize: '1rem' }}>
                                        {option.nom}
                                    </Typography>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('dashboard.successRate.evaluations')}
                                    size="small"
                                    placeholder={t('dashboard.successRate.placeholder.evaluation')}
                                />
                            )}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />

                        <Autocomplete
                            options={successClasses}
                            getOptionLabel={(option) => option.libelle}
                            value={selectedClass}
                            onChange={(_, newValue) => setSelectedClass(newValue)}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Typography sx={{ fontSize: '1rem' }}>
                                        {option.libelle}
                                    </Typography>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('dashboard.successRate.classes')}
                                    size="small"
                                    placeholder={t('dashboard.successRate.placeholder.class')}
                                />
                            )}
                            fullWidth
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Box>

                    {successRateData && (
                        <>
                            <Box sx={{ mt: 'auto', width: '100%' }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={successChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                                                const RADIAN = Math.PI / 180;
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                                        {`${(percent * 100).toFixed(0)}%`}
                                                    </text>
                                                );
                                            }}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {successChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend
                                        // ...
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>

                        </>
                    )}
                </Paper>

                {/* Column 3: Options (New) */}
                <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {t('dashboard.transfer.title')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                        {t('dashboard.transfer.subtitle')}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1, justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            startIcon={<AccountBalance />}
                            fullWidth
                            onClick={() => setClassTransferModalOpen(true)}
                            sx={{
                                bgcolor: '#e65100',
                                '&:hover': { bgcolor: '#b33d00' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.classes')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SupervisorAccount />}
                            fullWidth
                            onClick={() => setStaffTransferOpen(true)}
                            sx={{
                                bgcolor: '#c2185b',
                                '&:hover': { bgcolor: '#880e4f' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.admin')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<People />}
                            fullWidth
                            onClick={() => setTeacherTransferOpen(true)}
                            sx={{
                                bgcolor: '#c2185b',
                                '&:hover': { bgcolor: '#880e4f' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.teachers')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<School />}
                            fullWidth
                            onClick={() => setStudentTransferOpen(true)}
                            sx={{
                                bgcolor: '#5e35b1',
                                '&:hover': { bgcolor: '#4527a0' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.students')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Book />}
                            fullWidth
                            onClick={() => setSubjectTransferOpen(true)}
                            sx={{
                                bgcolor: '#00897b',
                                '&:hover': { bgcolor: '#00695c' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.subjects')}
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Settings />}
                            fullWidth
                            onClick={() => setConfigTransferOpen(true)}
                            sx={{
                                bgcolor: '#1976d2',
                                '&:hover': { bgcolor: '#1565c0' },
                                justifyContent: 'flex-start',
                                pl: 3,
                                height: 48
                            }}
                        >
                            {t('dashboard.transfer.config')}
                        </Button>
                    </Box>
                </Paper>


                {/* Column 4: Suggestion Form */}
                <Paper sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h6" sx={{ mb: 0.5 }}>
                        {t('dashboard.suggestion.title')}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 2, display: 'block' }}>
                        {t('dashboard.suggestion.subtitle')}
                    </Typography>
                    <Box component="form" onSubmit={handleSuggestionSubmit} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flexGrow: 1 }}>
                            <TextField
                                name="name"
                                label={t('dashboard.suggestion.name')}
                                value={suggestionForm.name}
                                onChange={(e) => setSuggestionForm({ ...suggestionForm, name: e.target.value })}
                                required
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="email"
                                label={t('dashboard.suggestion.email')}
                                type="email"
                                value={suggestionForm.email}
                                onChange={(e) => setSuggestionForm({ ...suggestionForm, email: e.target.value })}
                                fullWidth
                                size="small"
                            />
                            <TextField
                                name="message"
                                label={t('dashboard.suggestion.message')}
                                multiline
                                rows={4}
                                value={suggestionForm.message}
                                onChange={(e) => setSuggestionForm({ ...suggestionForm, message: e.target.value })}
                                required
                                fullWidth
                                size="small"
                                sx={{ flexGrow: 1 }}
                                InputProps={{
                                    sx: {
                                        height: '100%',
                                        alignItems: 'flex-start'
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {t('dashboard.suggestion.send')}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <ClassTransferModal open={classTransferModalOpen} onClose={() => setClassTransferModalOpen(false)} />
            <StudentTransferModal open={studentTransferOpen} onClose={() => setStudentTransferOpen(false)} />
            <TeacherTransferModal open={teacherTransferOpen} onClose={() => setTeacherTransferOpen(false)} />
            <StaffTransferModal open={staffTransferOpen} onClose={() => setStaffTransferOpen(false)} />
            <SubjectTransferModal open={subjectTransferOpen} onClose={() => setSubjectTransferOpen(false)} />
            <ConfigTransferModal open={configTransferOpen} onClose={() => setConfigTransferOpen(false)} />

            {/* Success Form Dialog */}
            <Dialog
                open={suggestionSuccessOpen}
                onClose={handleSuggestionClose}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 2,
                        textAlign: 'center',
                        minWidth: 300
                    }
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CheckCircle sx={{ fontSize: 60, color: '#4CAF50' }} />
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        {t('dashboard.suggestion.successTitle')}
                    </Typography>
                    <Typography color="textSecondary">
                        {t('dashboard.suggestion.successMessage')}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={handleSuggestionClose}
                        sx={{ mt: 2, px: 4, borderRadius: 2 }}
                    >
                        {t('dashboard.suggestion.close')}
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
