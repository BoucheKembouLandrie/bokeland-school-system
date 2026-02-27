import React, { useEffect, useState } from 'react';
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
    Typography,
    TextField,
    CircularProgress,
    Alert,
    MenuItem,
    Grid,
    Card,
    CardContent,
    Divider,
    Autocomplete
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface Payment {
    id: number;
    eleve_id: number;
    montant: number;
    date_paiement: string;
    motif: string;
    reste: number;
    student?: { nom: string; prenom: string };
}

interface Student {
    id: number;
    nom: string;
    prenom: string;
    classe_id: number;
}

interface Class {
    id: number;
    libelle: string;
    pension: number;
}

const Payments: React.FC = () => {
    const { t } = useTranslation();

    // Schema pour l'ajout d'une tranche
    const paymentSchema = z.object({
        montant: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: t('payments.validation.amountPositive'),
        }),
        date_paiement: z.string().min(1, t('payments.validation.dateRequired')),
        motif: z.string().min(1, t('payments.validation.motifRequired')),
    });

    type PaymentFormData = z.infer<typeof paymentSchema>;

    // Data states
    const [payments, setPayments] = useState<Payment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);

    // Selection states
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [validatedStudent, setValidatedStudent] = useState<Student | null>(null);

    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            date_paiement: new Date().toISOString().split('T')[0],
            motif: t('payments.defaults.tranchePrefix')
        }
    });

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [classesRes, studentsRes, paymentsRes] = await Promise.all([
                api.get('/classes'),
                api.get('/students'),
                api.get('/payments')
            ]);
            setClasses(classesRes.data);
            setStudents(studentsRes.data);
            setPayments(paymentsRes.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data', err);
            setError(t('payments.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    // Filter students based on selected class
    const filteredStudents = students.filter(s => s.classe_id && s.classe_id.toString() === selectedClassId);

    // Filter payments for the validated student
    const studentPayments = validatedStudent
        ? payments.filter(p => p.eleve_id === validatedStudent.id)
        : [];

    // Calculate totals
    const totalPaid = studentPayments.reduce((sum, p) => sum + Number(p.montant || 0), 0);
    const selectedClass = classes.find(c => c.id && c.id.toString() === selectedClassId);
    const classPension = selectedClass ? Number(selectedClass.pension || 0) : 0;
    const remaining = Math.max(0, classPension - totalPaid);

    const handleValidateSelection = () => {
        if (!selectedStudentId) {
            setError(t('payments.messages.selectStudentRequired'));
            return;
        }
        const student = students.find(s => s.id && s.id.toString() === selectedStudentId);
        setValidatedStudent(student || null);
        setError('');
        setSuccessMessage('');

        // Update default motif based on existing payments count
        const nextTrancheIndex = payments.filter(p => p.eleve_id.toString() === selectedStudentId).length + 1;
        reset({
            date_paiement: new Date().toISOString().split('T')[0],
            motif: `${t('payments.defaults.tranchePrefix')}${nextTrancheIndex}`,
            montant: ''
        });
    };

    const onSubmit = async (data: PaymentFormData) => {
        if (!validatedStudent || !selectedClass) return;

        const newAmount = Number(data.montant);

        // Validation: Total must not exceed pension
        if (totalPaid + newAmount > classPension) {
            setError(t('payments.messages.exceedsPension'));
            return;
        }

        try {
            const paymentData = {
                eleve_id: validatedStudent.id,
                montant: newAmount,
                date_paiement: data.date_paiement,
                motif: data.motif
            };

            await api.post('/payments', paymentData);

            // Refresh payments
            const response = await api.get('/payments');
            setPayments(response.data);

            setSuccessMessage(t('payments.messages.paymentSuccess'));
            setError('');

            // Reset form but keep date and update motif
            reset({
                date_paiement: new Date().toISOString().split('T')[0],
                motif: `${t('payments.defaults.tranchePrefix')}${studentPayments.length + 2}`, // +2 because we just added one (length not updated yet in this render cycle)
                montant: ''
            });
        } catch (err) {
            console.error('Error saving payment', err);
            setError(t('payments.messages.saveError'));
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>


            {/* Selection Section - Toolbar Design */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select
                            label={t('payments.fields.class')}
                            fullWidth
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                setSelectedStudentId('');
                                setValidatedStudent(null);
                            }}
                            SelectProps={{ displayEmpty: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value="">
                                {t('payments.fields.selectClass')}
                            </MenuItem>
                            {classes.map((classe) => (
                                <MenuItem key={classe.id} value={classe.id.toString()}>
                                    {classe.libelle}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Autocomplete
                            options={filteredStudents}
                            getOptionLabel={(option) => `${option.nom || ''} ${option.prenom || ''}`}
                            value={filteredStudents.find(s => s.id.toString() === selectedStudentId) || null}
                            onChange={(_, newValue) => setSelectedStudentId(newValue ? newValue.id.toString() : '')}
                            disabled={!selectedClassId}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('payments.fields.student')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                            noOptionsText={t('payments.messages.noStudentsFound')}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        {/* Empty Spacer Column */}
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleValidateSelection}
                            disabled={!selectedStudentId}
                            sx={{
                                height: '56px',
                                borderRadius: 1,
                                textTransform: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                bgcolor: '#fbc02d',
                                '&:hover': { bgcolor: '#f9a825' },
                                color: 'white'
                            }}
                        >
                            {t('payments.actions.validate')}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

            {validatedStudent && selectedClass && (
                <>
                    {/* Summary Card */}
                    <Card sx={{ mb: 4, bgcolor: '#f5f5f5' }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" color="text.secondary">{t('payments.summary.totalPension')}</Typography>
                                    <Typography variant="h6">{classPension.toLocaleString()} FCFA</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" color="text.secondary">{t('payments.summary.alreadyPaid')}</Typography>
                                    <Typography variant="h6" color="primary.main">{totalPaid.toLocaleString()} FCFA</Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2" color="text.secondary">{t('payments.summary.remaining')}</Typography>
                                    <Typography variant="h6" color={remaining === 0 ? 'success.main' : 'error.main'}>
                                        {remaining.toLocaleString()} FCFA
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Add Payment Section */}
                    <Paper sx={{ p: 3, mb: 4, border: '1px solid #e0e0e0' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>{t('payments.titles.addTranche')}</Typography>
                        <Grid container spacing={2} alignItems="flex-start">
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label={t('payments.fields.motif')}
                                    fullWidth
                                    {...register('motif')}
                                    error={!!errors.motif}
                                    helperText={errors.motif?.message?.toString()}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Controller
                                    name="date_paiement"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label={t('payments.fields.date')}
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: !!errors.date_paiement,
                                                    helperText: errors.date_paiement?.message?.toString(),
                                                    InputLabelProps: { shrink: true }
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label={t('payments.fields.amount')}
                                    type="number"
                                    fullWidth
                                    {...register('montant')}
                                    error={!!errors.montant}
                                    helperText={errors.montant?.message?.toString()}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    onClick={handleSubmit(onSubmit)}
                                    startIcon={<Add />}
                                    sx={{
                                        height: '56px',
                                        bgcolor: '#fbc02d',
                                        '&:hover': { bgcolor: '#f9a825' },
                                        color: 'white'
                                    }}
                                >
                                    {t('payments.actions.addTranche')}
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Payments List */}
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 586 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('payments.fields.motif')}</TableCell>
                                    <TableCell>{t('payments.fields.date')}</TableCell>
                                    <TableCell>{t('payments.fields.amountInCurrency')}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {studentPayments.length > 0 ? (
                                    studentPayments.map((payment) => (
                                        <TableRow key={payment.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#FFFDE7' } }}>
                                            <TableCell>{payment.motif}</TableCell>
                                            <TableCell>{formatDate(payment.date_paiement)}</TableCell>
                                            <TableCell>{payment.montant.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">{t('payments.messages.noPayments')}</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Box>
    );
};

export default Payments;
