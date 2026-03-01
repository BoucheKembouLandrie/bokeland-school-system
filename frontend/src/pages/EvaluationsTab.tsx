import React, { useState, useEffect } from 'react';
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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// We need to move schema creation inside the component or use a function to access t
const createSchema = (t: any) => z.object({
    nom: z.string().min(1, t('exams.evaluations.validation.nameRequired')),
    date_debut: z.string().min(1, t('exams.evaluations.validation.startDateRequired')),
    date_fin: z.string().min(1, t('exams.evaluations.validation.endDateRequired')),
});

interface Evaluation {
    id: number;
    nom: string;
    date_debut: string;
    date_fin: string;
}

const EvaluationsTab: React.FC = () => {
    const { t } = useTranslation();
    const schema = createSchema(t);
    type FormData = z.infer<typeof schema>;

    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await api.get('/evaluations');
            setEvaluations(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching evaluations', err);
            setError(t('exams.evaluations.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (editingId) {
                await api.put(`/evaluations/${editingId}`, data);
            } else {
                await api.post('/evaluations', data);
            }
            fetchData();
            handleClose();
            setError('');
        } catch (err) {
            console.error('Error saving evaluation', err);
            setError(t('exams.evaluations.messages.saveError'));
        }
    };

    const handleEdit = (evaluation: Evaluation) => {
        setEditingId(evaluation.id);
        setValue('nom', evaluation.nom);
        setValue('date_debut', evaluation.date_debut || '');
        setValue('date_fin', evaluation.date_fin || '');
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('exams.evaluations.messages.deleteConfirm'))) {
            try {
                await api.delete(`/evaluations/${id}`);
                fetchData();
                setError('');
            } catch (err) {
                console.error('Error deleting evaluation', err);
                setError(t('exams.evaluations.messages.deleteError'));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        reset();
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
                >
                    {t('exams.evaluations.actions.add')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('exams.evaluations.table.name')}</TableCell>
                            <TableCell>{t('exams.evaluations.fields.startDate')}</TableCell>
                            <TableCell>{t('exams.evaluations.fields.endDate')}</TableCell>
                            <TableCell>{t('exams.common.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {evaluations.map((evaluation) => (
                            <TableRow key={evaluation.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fbeeee' } }}>
                                <TableCell>{evaluation.nom}</TableCell>
                                <TableCell>{formatDate(evaluation.date_debut)}</TableCell>
                                <TableCell>{formatDate(evaluation.date_fin)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(evaluation)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(evaluation.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {evaluations.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    {t('exams.evaluations.messages.noEvaluations')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('exams.evaluations.titles.edit') : t('exams.evaluations.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('exams.evaluations.fields.name')}
                            {...register('nom')}
                            error={!!errors.nom}
                            helperText={errors.nom?.message}
                            fullWidth
                        />
                        <Controller
                            control={control}
                            name="date_debut"
                            render={({ field }) => (
                                <DatePicker
                                    label={t('exams.evaluations.fields.startDate')}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: { shrink: true },
                                            error: !!errors.date_debut,
                                            helperText: errors.date_debut?.message
                                        }
                                    }}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="date_fin"
                            render={({ field }) => (
                                <DatePicker
                                    label={t('exams.evaluations.fields.endDate')}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: { shrink: true },
                                            error: !!errors.date_fin,
                                            helperText: errors.date_fin?.message
                                        }
                                    }}
                                />
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('exams.common.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}>
                        {editingId ? t('exams.common.edit') : t('exams.common.add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default EvaluationsTab;
