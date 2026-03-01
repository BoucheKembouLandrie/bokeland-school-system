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
import { useTranslation } from 'react-i18next';

interface Staff {
    id: number;
    titre: string;
    nom: string;
    prenom: string;
    tel: string;
    email: string;
    salaire: number;
}

const Administration: React.FC = () => {
    const { t } = useTranslation();
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const schema = z.object({
        titre: z.string().min(1, t('staff.validation.titleRequired')),
        nom: z.string().min(1, t('staff.validation.nomRequired')),
        prenom: z.string().min(1, t('staff.validation.prenomRequired')),
        tel: z.string().min(1, t('staff.validation.telRequired')),
        email: z.string().email(t('staff.validation.emailInvalid')).min(1, t('staff.validation.emailRequired')),
        salaire: z.string().min(1, t('staff.validation.salaryRequired')),
    });

    type FormData = z.infer<typeof schema>;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            setLoading(true);
            const response = await api.get('/staff');
            setStaffList(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching staff', err);
            setError(t('staff.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (editingId) {
                await api.put(`/staff/${editingId}`, data);
            } else {
                await api.post('/staff', data);
            }
            fetchStaff();
            handleClose();
            setError('');
        } catch (err) {
            console.error('Error saving staff', err);
            setError(t('staff.messages.saveError'));
        }
    };

    const handleEdit = (staff: Staff) => {
        setEditingId(staff.id);
        reset({
            titre: staff.titre,
            nom: staff.nom,
            prenom: staff.prenom,
            tel: staff.tel,
            email: staff.email || '',
            salaire: staff.salaire ? staff.salaire.toString() : '',
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('staff.messages.deleteConfirm'))) {
            try {
                await api.delete(`/staff/${id}`);
                fetchStaff();
                setError('');
            } catch (err) {
                console.error('Error deleting staff', err);
                setError(t('staff.messages.deleteError'));
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
                    sx={{ backgroundColor: '#c2185b', '&:hover': { backgroundColor: '#ad1457' } }}
                >
                    {t('staff.actions.newPosition')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('staff.fields.title')}</TableCell>
                            <TableCell>{t('staff.fields.nom')}</TableCell>
                            <TableCell>{t('staff.fields.prenom')}</TableCell>
                            <TableCell>{t('staff.fields.tel')}</TableCell>
                            <TableCell>{t('staff.fields.email')}</TableCell>
                            <TableCell>{t('staff.fields.salary')}</TableCell>
                            <TableCell>{t('staff.fields.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {staffList.map((staff) => (
                            <TableRow key={staff.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#faecf1' } }}>
                                <TableCell>{staff.titre}</TableCell>
                                <TableCell>{staff.nom}</TableCell>
                                <TableCell>{staff.prenom}</TableCell>
                                <TableCell>{staff.tel}</TableCell>
                                <TableCell>{staff.email || '-'}</TableCell>
                                <TableCell>{staff.salaire ? `${staff.salaire} FCFA` : '-'}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(staff)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(staff.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('staff.titles.edit') : t('staff.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('staff.fields.titlePlaceholder')}
                            {...register('titre')}
                            error={!!errors.titre}
                            helperText={errors.titre?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('staff.fields.nom')}
                            {...register('nom')}
                            error={!!errors.nom}
                            helperText={errors.nom?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('staff.fields.prenom')}
                            {...register('prenom')}
                            error={!!errors.prenom}
                            helperText={errors.prenom?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('staff.fields.tel')}
                            {...register('tel')}
                            error={!!errors.tel}
                            helperText={errors.tel?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('staff.fields.email')}
                            type="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('staff.fields.salary')}
                            {...register('salaire')}
                            error={!!errors.salaire}
                            helperText={errors.salaire?.message?.toString()}
                            fullWidth
                            type="number"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('staff.actions.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained" color="primary">
                        {t('staff.actions.save')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Administration;
