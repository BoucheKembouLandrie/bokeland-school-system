import React, { useEffect, useState, useMemo } from 'react';
import {
    Box,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Divider,
} from '@mui/material';
import { Edit, Delete, Add, Print } from '@mui/icons-material';
import Grid from '@mui/material/Grid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const createSchema = (t: any) => z.object({
    titre: z.string().optional(),
    montant: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: t('expenses.validation.amountPositive'),
    }),
    date_depense: z.string().min(1, t('expenses.validation.dateRequired')),
    description: z.string().optional(),
    category: z.enum(['generale', 'salaire']).optional(),
    teacher_id: z.string().optional(),
    staff_id: z.string().optional(),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface Expense {
    id: number;
    titre: string;
    montant: number;
    date_depense: string;
    description?: string;
    category: 'generale' | 'salaire';
    status: 'payé' | 'en_attente';
    teacher_id?: number;
    staff_id?: number;
    teacher?: { nom: string; prenom: string };
    staffMember?: { nom: string; prenom: string; titre: string };
}

interface Teacher {
    id: number;
    nom: string;
    prenom: string;
    salaire?: number;
}

interface Staff {
    id: number;
    nom: string;
    prenom: string;
    titre: string;
    salaire?: number;
}

const Expenses: React.FC = () => {
    const { t } = useTranslation();
    const schema = createSchema(t);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    // Salary related state
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [mode, setMode] = useState<'expense' | 'salary'>('expense');
    const [salaryType, setSalaryType] = useState<'teacher' | 'staff'>('teacher');
    const [selectedPersonId, setSelectedPersonId] = useState<string>('');
    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
        setError(''); // Clear any error messages when switching tabs
    };

    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            date_depense: new Date().toISOString().split('T')[0],
            category: 'generale',
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [expensesRes, teachersRes, staffRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/teachers'),
                api.get('/staff')
            ]);
            setExpenses(expensesRes.data);
            setTeachers(teachersRes.data);
            setStaffList(staffRes.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data', err);
            setError(t('expenses.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const handlePersonChange = (id: string, type: 'teacher' | 'staff') => {
        setSelectedPersonId(id);
        let person: Teacher | Staff | undefined;
        if (type === 'teacher') {
            person = teachers.find(t => t.id.toString() === id);
        } else {
            person = staffList.find(s => s.id.toString() === id);
        }

        if (person && person.salaire) {
            setValue('montant', person.salaire.toString());
        } else {
            setValue('montant', '');
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            let payload: any = { ...data };

            if (mode === 'salary') {
                // Validate that a person is selected
                if (!selectedPersonId) {
                    setError(t('expenses.validation.personRequired'));
                    return;
                }

                // Check if this person already has a salary for this month
                const selectedDate = new Date(data.date_depense);
                const selectedMonth = selectedDate.getMonth();
                const selectedYear = selectedDate.getFullYear();

                const existingSalary = expenses.find(exp => {
                    if (exp.category !== 'salaire') return false;
                    if (editingId && exp.id === editingId) return false; // Skip current record when editing

                    const expDate = new Date(exp.date_depense);
                    const expMonth = expDate.getMonth();
                    const expYear = expDate.getFullYear();

                    // Check if same month/year and same person
                    if (expMonth === selectedMonth && expYear === selectedYear) {
                        if (salaryType === 'teacher' && exp.teacher_id?.toString() === selectedPersonId) {
                            return true;
                        }
                        if (salaryType === 'staff' && exp.staff_id?.toString() === selectedPersonId) {
                            return true;
                        }
                    }
                    return false;
                });

                if (existingSalary) {
                    const monthName = selectedDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
                    setError(`${t('expenses.messages.salaryExists')} ${monthName}`);
                    return;
                }

                payload.category = 'salaire';
                payload.status = 'payé'; // Default status as per request
                let personName = '';

                if (salaryType === 'teacher') {
                    payload.teacher_id = selectedPersonId;
                    const t = teachers.find(tea => tea.id.toString() === selectedPersonId);
                    if (t) personName = `${t.nom} ${t.prenom}`;
                } else {
                    payload.staff_id = selectedPersonId;
                    const s = staffList.find(st => st.id.toString() === selectedPersonId);
                    if (s) personName = `${s.nom} ${s.prenom}`;
                }

                // Auto-generate title for salary
                const date = new Date(data.date_depense);
                const month = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
                payload.titre = `Salaire ${month} - ${personName}`;
            } else {
                // Validate titre for expense mode
                if (!data.titre || data.titre.trim() === '') {
                    setError(t('expenses.validation.titleRequired'));
                    return;
                }
                payload.category = 'generale';
            }

            if (editingId) {
                await api.put(`/expenses/${editingId}`, payload);
            } else {
                await api.post('/expenses', payload);
            }
            fetchData();
            handleClose();
            setError('');
        } catch (err) {
            console.error('Error saving expense', err);
            setError(t('expenses.messages.saveError'));
        }
    };

    const handleEdit = (expense: Expense) => {
        setEditingId(expense.id);
        if (expense.category === 'salaire') {
            setMode('salary');
            if (expense.teacher_id) {
                setSalaryType('teacher');
                setSelectedPersonId(expense.teacher_id.toString());
            } else if (expense.staff_id) {
                setSalaryType('staff');
                setSelectedPersonId(expense.staff_id.toString());
            }
        } else {
            setMode('expense');
        }

        reset({
            titre: expense.titre,
            montant: expense.montant.toString(),
            date_depense: expense.date_depense,
            description: expense.description || '',
            category: expense.category,
        });
        setOpen(true);
    };

    const handleOpenExpense = () => {
        setMode('expense');
        setOpen(true);
    };

    const handleOpenSalary = () => {
        setMode('salary');
        setSalaryType('teacher'); // Default
        setSelectedPersonId('');
        setValue('montant', '');
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('expenses.messages.deleteConfirm'))) {
            try {
                await api.delete(`/expenses/${id}`);
                fetchData();
                setError('');
            } catch (err) {
                console.error('Error deleting expense', err);
                setError(t('expenses.messages.deleteError'));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setMode('expense');
        setSelectedPersonId('');
        reset({
            date_depense: new Date().toISOString().split('T')[0],
            category: 'generale',
            titre: '',
            montant: '',
            description: '',
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    const generalExpenses = expenses.filter(expense =>
        expense.category !== 'salaire' &&
        (!startDate || expense.date_depense >= startDate) &&
        (!endDate || expense.date_depense <= endDate) &&
        (expense.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const salaryExpenses = expenses.filter(expense =>
        expense.category === 'salaire' &&
        (!startDate || expense.date_depense >= startDate) &&
        (!endDate || expense.date_depense <= endDate) &&
        (expense.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (expense.description && expense.description.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    const printData = (() => {
        if (activeTab === 0) {
            return {
                title: 'Charges Diverses',
                countLabel: 'Nombre de charges',
                columns: ['Date', 'Titre', 'Description', 'Montant (FCFA)'],
                rows: generalExpenses.map(exp => ({
                    id: exp.id,
                    col1: formatDate(exp.date_depense),
                    col2: exp.titre,
                    col3: exp.description || '—',
                    montant: exp.montant
                }))
            };
        } else {
            return {
                title: 'Salaires',
                countLabel: 'Nombre de salaires',
                columns: ['Date', 'Nom', 'Statut', 'Montant (FCFA)'],
                rows: salaryExpenses.map(exp => {
                    const teacherName = exp.teacher ? `${exp.teacher.nom} ${exp.teacher.prenom}` : '';
                    const staffName = exp.staffMember ? `${exp.staffMember.nom} ${exp.staffMember.prenom}` : '';
                    const name = teacherName || staffName || exp.titre;
                    return {
                        id: exp.id,
                        col1: formatDate(exp.date_depense),
                        col2: name,
                        col3: 'Payé',
                        montant: exp.montant
                    };
                })
            };
        }
    })();

    const handlePrintExpenses = () => {
        setShowPrintPreview(true);
    };

    const doPrint = () => {
        const rows = printData.rows.map(row => `
            <tr>
                <td>${row.col1}</td>
                <td>${row.col2}</td>
                <td>${row.col3}</td>
                <td style="text-align:right">${Number(row.montant).toLocaleString()} FCFA</td>
            </tr>
        `).join('');

        const totalAmount = printData.rows.reduce((sum, row) => sum + Number(row.montant), 0);
        const dateFilter = (startDate || endDate)
            ? `Période : ${startDate ? formatDate(startDate) : '...'} → ${endDate ? formatDate(endDate) : '...'}`
            : 'Toutes les périodes';

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${printData.title}</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; margin: 20px; color: #333; box-sizing: border-box; }
                    h2 { text-align: center; margin-bottom: 4px; color: #5d4037; font-size: 18px; }
                    .subtitle { text-align: center; color: #888; margin-bottom: 20px; font-size: 11px; }
                    table { width: 100%; border-collapse: collapse; margin: 0 auto; }
                    th { background-color: #795548; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
                    td { padding: 7px 8px; border-bottom: 1px solid #ede0d2; }
                    tr { page-break-inside: avoid; }
                    tr:nth-child(even) td { background-color: #fdf6f0; }
                    .total-row { font-weight: bold; }
                    .total-row td { border-top: 2px solid #795548; padding-top: 10px; }
                    @page { margin: 30mm 15mm; }
                    @media print { 
                        body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    }
                    /* Spacer for the top of each printed page table */
                    .print-spacer { height: 30px !important; border: none !important; background-color: transparent !important; }
                </style>
            </head>
            <body>
                <h2>${printData.title}</h2>
                <p class="subtitle">${dateFilter}${searchTerm ? ' &nbsp;|&nbsp; Recherche : ' + searchTerm : ''}</p>
                <table>
                    <thead>
                        <tr><td colspan="4" class="print-spacer"></td></tr>
                        <tr><th>${printData.columns[0]}</th><th>${printData.columns[1]}</th><th>${printData.columns[2]}</th><th style="text-align:right">${printData.columns[3]}</th></tr>
                    </thead>
                    <tbody>
                        ${rows}
                        <tr class="total-row"><td colspan="3"><strong>Total</strong></td><td style="text-align:right"><strong>${totalAmount.toLocaleString()} FCFA</strong></td></tr>
                    </tbody>
                </table>
            </body>
            </html>
        `;

        // Use a hidden iframe to print without opening a new visible page
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = 'none';
        document.body.appendChild(iframe);
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
            doc.open();
            doc.write(printContent);
            doc.close();
            setTimeout(() => {
                iframe.contentWindow?.print();
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }, 500);
        }
        setShowPrintPreview(false);
    };

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#795548',
                        },
                    }}
                >
                    <Tab
                        label={t('expenses.tabs.general')}
                        sx={{
                            '&.Mui-selected': { color: '#795548' },
                            color: 'text.secondary'
                        }}
                    />
                    <Tab
                        label={t('expenses.tabs.salaries')}
                        sx={{
                            '&.Mui-selected': { color: '#795548' },
                            color: 'text.secondary'
                        }}
                    />
                </Tabs>
            </Box>

            <Box sx={{ mb: 3 }}>
                <Paper sx={{ p: 2, width: '100%', boxSizing: 'border-box' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: '100%' }}>
                        <Box sx={{ flex: 1 }}>
                            <DatePicker
                                label={t('expenses.fields.startDate')}
                                value={startDate ? dayjs(startDate) : null}
                                onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <DatePicker
                                label={t('expenses.fields.endDate')}
                                value={endDate ? dayjs(endDate) : null}
                                onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label={t('expenses.fields.search')}
                                placeholder={t('expenses.fields.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<Print />}
                                onClick={handlePrintExpenses}
                                fullWidth
                                sx={{ backgroundColor: '#795548', '&:hover': { backgroundColor: '#5d4037' }, height: '56px' }}
                            >
                                Imprimer
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <div role="tabpanel" hidden={activeTab !== 0}>
                {activeTab === 0 && (
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleOpenExpense}
                                sx={{ backgroundColor: '#795548', '&:hover': { backgroundColor: '#5d4037' }, minWidth: '180px', height: '40px' }}
                            >
                                {t('expenses.actions.newExpense')}
                            </Button>
                        </Box>

                        {error && activeTab === 0 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('expenses.fields.date')}</TableCell>
                                        <TableCell>{t('expenses.fields.title')}</TableCell>
                                        <TableCell>{t('expenses.fields.description')}</TableCell>
                                        <TableCell>{t('expenses.fields.amount')}</TableCell>
                                        <TableCell>{t('expenses.fields.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {generalExpenses.map((expense) => (
                                        <TableRow key={expense.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f4f1f0' } }}>
                                            <TableCell>{formatDate(expense.date_depense)}</TableCell>
                                            <TableCell>{expense.titre}</TableCell>
                                            <TableCell>{expense.description || '-'}</TableCell>
                                            <TableCell>{expense.montant.toLocaleString()}</TableCell>
                                            <TableCell>
                                                <IconButton onClick={() => handleEdit(expense)} color="primary">
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(expense.id)} color="error">
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {generalExpenses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">{t('expenses.messages.noExpenseFound')}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </div>

            <div role="tabpanel" hidden={activeTab !== 1}>
                {activeTab === 1 && (
                    <Box>


                        {error && activeTab === 1 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                        <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('expenses.fields.date')}</TableCell>
                                        <TableCell>{t('expenses.fields.name')}</TableCell>
                                        <TableCell>{t('expenses.fields.amount')}</TableCell>
                                        <TableCell>{t('expenses.fields.status')}</TableCell>
                                        <TableCell>{t('expenses.fields.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {salaryExpenses.map((expense) => {
                                        const teacherName = expense.teacher ? `${expense.teacher.nom} ${expense.teacher.prenom}` : '';
                                        const staffName = expense.staffMember ? `${expense.staffMember.nom} ${expense.staffMember.prenom}` : '';
                                        const name = teacherName || staffName || expense.titre;

                                        return (
                                            <TableRow key={expense.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f4f1f0' } }}>
                                                <TableCell>{formatDate(expense.date_depense)}</TableCell>
                                                <TableCell>{name}</TableCell>
                                                <TableCell>{expense.montant.toLocaleString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={t('expenses.fields.paymentReceived')}
                                                        color="success"
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleDelete(expense.id)} color="error">
                                                        <Delete />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {salaryExpenses.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">{t('expenses.messages.noSalaryFound')}</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </div>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {mode === 'expense'
                        ? (editingId ? t('expenses.titles.editExpense') : t('expenses.titles.addExpense'))
                        : (editingId ? t('expenses.titles.editSalary') : t('expenses.titles.addSalary'))
                    }
                </DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>

                        {mode === 'expense' ? (
                            <>
                                <TextField
                                    label={t('expenses.fields.titlePlaceholder')}
                                    {...register('titre')}
                                    error={!!errors.titre}
                                    helperText={errors.titre?.message}
                                    fullWidth
                                />
                                <TextField
                                    label={t('expenses.fields.amount')}
                                    {...register('montant')}
                                    error={!!errors.montant}
                                    helperText={errors.montant?.message}
                                    fullWidth
                                    type="number"
                                />
                                <TextField
                                    label={t('expenses.fields.description')}
                                    {...register('description')}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </>
                        ) : (
                            <>
                                <FormControl fullWidth>
                                    <InputLabel>{t('expenses.fields.personnelType')}</InputLabel>
                                    <Select
                                        value={salaryType}
                                        label={t('expenses.fields.personnelType')}
                                        onChange={(e) => {
                                            setSalaryType(e.target.value as 'teacher' | 'staff');
                                            setSelectedPersonId('');
                                            setValue('montant', '');
                                        }}
                                        disabled={!!editingId} // Cannot change type during edit to simplify logic
                                    >
                                        <MenuItem value="teacher">{t('expenses.personnelTypes.teacher')}</MenuItem>
                                        <MenuItem value="staff">{t('expenses.personnelTypes.staff')}</MenuItem>
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>{t('expenses.fields.name')}</InputLabel>
                                    <Select
                                        value={selectedPersonId}
                                        label={t('expenses.fields.name')}
                                        onChange={(e) => handlePersonChange(e.target.value, salaryType)}
                                        disabled={!!editingId}
                                    >
                                        {salaryType === 'teacher' ? (
                                            teachers.map((t) => (
                                                <MenuItem key={t.id} value={t.id.toString()}>
                                                    {t.nom} {t.prenom}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            staffList.map((s) => (
                                                <MenuItem key={s.id} value={s.id.toString()}>
                                                    {s.nom} {s.prenom} ({s.titre})
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>

                                <TextField
                                    label={t('expenses.fields.amount')}
                                    {...register('montant')}
                                    error={!!errors.montant}
                                    helperText={errors.montant?.message}
                                    fullWidth
                                    type="number"
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{ readOnly: true }}
                                />
                            </>
                        )}

                        <Controller
                            control={control}
                            name="date_depense"
                            render={({ field }) => (
                                <DatePicker
                                    label={t('expenses.fields.date')}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                    disabled={mode === 'salary'}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: { shrink: true },
                                            error: !!errors.date_depense,
                                            helperText: errors.date_depense?.message
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('expenses.actions.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                        {t('expenses.actions.save')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Print Preview Dialog */}
            <Dialog
                open={showPrintPreview}
                onClose={() => setShowPrintPreview(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
            >
                <Box sx={{
                    background: 'linear-gradient(135deg, #5d4037 0%, #795548 60%, #a1887f 100%)',
                    px: 4, py: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                            Aperçu d'impression
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                            {printData.title} — {printData.rows.length} enregistrement{printData.rows.length > 1 ? 's' : ''}
                            {(startDate || endDate) ? ` — ${startDate ? formatDate(startDate) : '...'} → ${endDate ? formatDate(endDate) : '...'}` : ''}
                        </Typography>
                    </Box>
                    <Print sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 32 }} />
                </Box>

                <DialogContent sx={{ p: 0, bgcolor: '#f8f4f1' }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #e0d0c8' }}>
                        <Box sx={{ flex: 1, px: 3, py: 1.5, textAlign: 'center', borderRight: '1px solid #e0d0c8' }}>
                            <Typography variant="caption" color="text.secondary">{printData.countLabel}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#5d4037' }}>{printData.rows.length}</Typography>
                        </Box>
                        <Box sx={{ flex: 1, px: 3, py: 1.5, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Montant total</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#5d4037' }}>
                                {printData.rows.reduce((s, r) => s + Number(r.montant), 0).toLocaleString()} FCFA
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 2, py: 1.5 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0d0c8' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#795548' }}>
                                        {printData.columns.map(h => (
                                            <TableCell key={h} sx={{ color: 'white', fontWeight: 700, py: 1.2 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {printData.rows.map((row, i) => (
                                        <TableRow key={row.id} sx={{ bgcolor: i % 2 === 0 ? 'white' : '#fdf6f0' }}>
                                            <TableCell sx={{ whiteSpace: 'nowrap', py: 0.8 }}>{row.col1}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.col2}</TableCell>
                                            <TableCell sx={{ py: 0.8, color: 'text.secondary' }}>{row.col3}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, py: 0.8, color: '#5d4037' }}>
                                                {row.montant.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {printData.rows.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                Aucune donnée à afficher
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#efebe9' }}>
                                        <TableCell colSpan={3} sx={{ fontWeight: 700, color: '#5d4037', py: 1 }}>Total</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 800, color: '#5d4037', py: 1 }}>
                                            {printData.rows.reduce((s, r) => s + Number(r.montant), 0).toLocaleString()} FCFA
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>

                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={() => setShowPrintPreview(false)} variant="outlined"
                        sx={{ borderColor: '#795548', color: '#795548', '&:hover': { borderColor: '#5d4037', bgcolor: '#f9f5f2' } }}>
                        Annuler
                    </Button>
                    <Button onClick={doPrint} variant="contained" startIcon={<Print />}
                        sx={{ backgroundColor: '#795548', '&:hover': { backgroundColor: '#5d4037' }, px: 3 }}>
                        Imprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Expenses;
