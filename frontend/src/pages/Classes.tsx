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
import { useSchoolYear } from '../contexts/SchoolYearContext';
import { useTranslation } from 'react-i18next';

const Classes: React.FC = () => {
    const { t } = useTranslation();
    const { currentYear } = useSchoolYear();
    const [classes, setClasses] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const schema = z.object({
        libelle: z.string().min(1, t('classes.validation.libelleRequired')),
        niveau: z.string().min(1, t('classes.validation.levelRequired')),
        annee: z.string().min(1, t('classes.validation.yearRequired')),
        pension: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: t('classes.validation.pensionPositive'),
        }),
    });

    type FormData = z.infer<typeof schema>;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetchClasses();
    }, []);

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/classes');
            setClasses(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching classes', err);
            setError(t('classes.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (editingId) {
                await api.put(`/classes/${editingId}`, data);
            } else {
                await api.post('/classes', data);
            }
            fetchClasses();
            handleClose();
            setError('');
        } catch (err) {
            console.error('Error saving class', err);
            setError(t('classes.messages.saveError'));
        }
    };

    const handleEdit = (classe: any) => {
        setEditingId(classe.id);
        reset({
            libelle: classe.libelle,
            niveau: classe.niveau,
            annee: classe.annee,
            pension: classe.pension?.toString() || '0',
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('classes.messages.deleteConfirm'))) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
                setError('');
            } catch (err) {
                console.error('Error deleting class', err);
                setError(t('classes.messages.deleteError'));
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
                    onClick={() => {
                        reset({
                            libelle: '',
                            niveau: '',
                            annee: currentYear?.name || '',
                            pension: '0',
                        });
                        setOpen(true);
                    }}
                    sx={{ backgroundColor: '#e65100', '&:hover': { backgroundColor: '#d84315' } }}
                >
                    {t('classes.actions.newClass')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('classes.fields.libelle')}</TableCell>
                            <TableCell>{t('classes.fields.level')}</TableCell>
                            <TableCell>{t('classes.fields.year')}</TableCell>
                            <TableCell>{t('classes.fields.pension')}</TableCell>
                            <TableCell>{t('classes.fields.studentCount')}</TableCell>
                            <TableCell>{t('classes.fields.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((classe) => (
                            <TableRow key={classe.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#fdf1ea' } }}>
                                <TableCell>{classe.libelle}</TableCell>
                                <TableCell>{classe.niveau}</TableCell>
                                <TableCell>{classe.annee}</TableCell>
                                <TableCell>{Number(classe.pension || 0).toLocaleString()}</TableCell>
                                <TableCell>{classe.students?.length || 0}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(classe)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(classe.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table >
            </TableContainer >

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('classes.titles.edit') : t('classes.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('classes.fields.libelle')}
                            {...register('libelle')}
                            error={!!errors.libelle}
                            helperText={errors.libelle?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('classes.fields.level')}
                            {...register('niveau')}
                            error={!!errors.niveau}
                            helperText={errors.niveau?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('classes.fields.schoolYear')}
                            {...register('annee')}
                            error={!!errors.annee}
                            helperText={errors.annee?.message?.toString()}
                            fullWidth
                            placeholder="2024-2025"
                        />
                        <TextField
                            label={t('classes.fields.pension')}
                            type="number"
                            {...register('pension')}
                            error={!!errors.pension}
                            helperText={errors.pension?.message?.toString()}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('classes.actions.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">
                        {editingId ? t('classes.actions.edit') : t('classes.actions.add')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Classes;
