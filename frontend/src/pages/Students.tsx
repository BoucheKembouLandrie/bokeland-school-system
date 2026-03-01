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
    Grid,
    MenuItem,
    Divider,
} from '@mui/material';
import { Edit, Delete, Add, Print } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import { useTranslation } from 'react-i18next';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface Student {
    id: number;
    matricule: string;
    nom: string;
    prenom: string;
    date_naissance: string;
    sexe: string;
    category: string;
    adresse: string;
    parent_tel: string;
    classe_id: number;
    class?: { libelle: string };
}

interface Class {
    id: number;
    libelle: string;
}

const Students: React.FC = () => {
    const { t } = useTranslation();
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter States
    const [filterClassId, setFilterClassId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');

    const schema = z.object({
        nom: z.string().min(1, t('students.validation.nomRequired')),
        prenom: z.string().min(1, t('students.validation.prenomRequired')),
        date_naissance: z.string().min(1, t('students.validation.dobRequired')),
        sexe: z.enum(['M', 'F']),
        category: z.string().min(1, t('students.validation.categoryRequired')),
        adresse: z.string().min(1, t('students.validation.addressRequired')),
        parent_tel: z.string().min(1, t('students.validation.parentTelRequired')),
        classe_id: z.string().min(1, t('students.validation.classRequired')),
    });

    type FormData = z.infer<typeof schema>;

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/students');
            setStudents(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching students', err);
            setError(t('students.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const fetchClasses = async () => {
        try {
            const response = await api.get('/classes');
            setClasses(response.data);
        } catch (err) {
            console.error('Error fetching classes', err);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            if (editingId) {
                await api.put(`/students/${editingId}`, data);
            } else {
                await api.post('/students', data);
            }
            fetchStudents();
            handleClose();
            setError('');
        } catch (err) {
            console.error('Error saving student', err);
            setError(t('students.messages.saveError'));
        }
    };

    const handleEdit = (student: Student) => {
        setEditingId(student.id);
        reset({
            nom: student.nom,
            prenom: student.prenom,
            date_naissance: student.date_naissance,
            sexe: student.sexe as 'M' | 'F',
            category: student.category || 'Non redoublant(e)',
            adresse: student.adresse,
            parent_tel: student.parent_tel,
            classe_id: student.classe_id.toString(),
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('students.messages.deleteConfirm'))) {
            try {
                await api.delete(`/students/${id}`);
                fetchStudents();
                setError('');
            } catch (err) {
                console.error('Error deleting student', err);
                setError(t('students.messages.deleteError'));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        reset();
    };

    // Filter Logic
    const filteredStudents = students.filter(student => {
        const matchesClass = filterClassId ? student.classe_id.toString() === filterClassId : true;
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = searchQuery
            ? student.nom.toLowerCase().includes(searchLower) || student.prenom.toLowerCase().includes(searchLower)
            : true;

        return matchesClass && matchesSearch;
    });

    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const doPrint = () => {
        const rows = filteredStudents.map(student => `
            <tr>
                <td>${student.matricule}</td>
                <td>${student.nom}</td>
                <td>${student.prenom}</td>
                <td>${student.sexe}</td>
                <td>${student.class?.libelle || 'N/A'}</td>
                <td>${student.parent_tel}</td>
            </tr>
        `).join('');

        const classLabel = filterClassId
            ? classes.find(c => c.id.toString() === filterClassId)?.libelle
            : 'Toutes les classes';
        const searchLabel = searchQuery ? ' &nbsp;|&nbsp; Recherche : ' + searchQuery : '';

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Liste des Élèves</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; margin: 20px; color: #333; box-sizing: border-box; }
                    h2 { text-align: center; margin-bottom: 4px; color: #5e35b1; font-size: 18px; }
                    .subtitle { text-align: center; color: #888; margin-bottom: 20px; font-size: 11px; }
                    table { width: 100%; border-collapse: collapse; margin: 0 auto; }
                    th { background-color: #5e35b1; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
                    td { padding: 7px 8px; border-bottom: 1px solid #e0e0e0; }
                    tr { page-break-inside: avoid; }
                    tr:nth-child(even) td { background-color: #f2eef9; }
                    @page { margin: 30mm 15mm; }
                    @media print { 
                        body { padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
                        thead { display: table-header-group; }
                        tfoot { display: table-footer-group; }
                    }
                    .print-spacer { height: 30px !important; border: none !important; background-color: transparent !important; }
                </style>
            </head>
            <body>
                <h2>Liste des Élèves</h2>
                <p class="subtitle">${classLabel}${searchLabel}</p>
                <table>
                    <thead>
                        <tr><td colspan="6" class="print-spacer"></td></tr>
                        <tr><th>Matricule</th><th>Nom</th><th>Prénom</th><th>Sexe</th><th>Classe</th><th>Téléphone</th></tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </body>
            </html>
        `;

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Top Action Bar removed and moved to grid */}

            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: 1 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select
                            label={t('students.fields.class')}
                            value={filterClassId}
                            onChange={(e) => setFilterClassId(e.target.value)}
                            fullWidth
                            SelectProps={{ displayEmpty: true }}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 200 }}
                        >
                            <MenuItem value="">{t('students.filters.allClasses')}</MenuItem>
                            {classes.map((c) => (
                                <MenuItem key={c.id} value={c.id.toString()}>{c.libelle}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            label={t('students.filters.studentLabel')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            fullWidth
                            placeholder={t('students.filters.searchPlaceholder')}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 200 }}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Print />}
                            onClick={() => setShowPrintPreview(true)}
                            sx={{ backgroundColor: '#5e35b1', '&:hover': { backgroundColor: '#4527a0' }, height: '56px' }}
                        >
                            Imprimer
                        </Button>
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Add />}
                            onClick={() => {
                                reset({
                                    nom: '',
                                    prenom: '',
                                    date_naissance: '',
                                    sexe: 'M',
                                    category: 'Non redoublant(e)',
                                    adresse: '',
                                    parent_tel: '',
                                    classe_id: ''
                                });
                                setEditingId(null);
                                setOpen(true);
                            }}
                            sx={{ backgroundColor: '#5e35b1', '&:hover': { backgroundColor: '#4527a0' }, height: '56px' }}
                        >
                            {t('students.actions.newStudent')}
                        </Button>
                    </Grid>
                </Grid>
            </Paper>


            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('students.fields.matricule')}</TableCell>
                            <TableCell>{t('students.fields.nom')}</TableCell>
                            <TableCell>{t('students.fields.prenom')}</TableCell>
                            <TableCell>{t('students.fields.dob')}</TableCell>
                            <TableCell>{t('students.fields.sexe')}</TableCell>
                            <TableCell>{t('students.fields.class')}</TableCell>
                            <TableCell>{t('students.fields.category')}</TableCell>
                            <TableCell>{t('students.fields.parentTel')}</TableCell>
                            <TableCell>{t('students.fields.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f2eef9' } }}>
                                <TableCell>{student.matricule}</TableCell>
                                <TableCell>{student.nom}</TableCell>
                                <TableCell>{student.prenom}</TableCell>
                                <TableCell>{formatDate(student.date_naissance)}</TableCell>
                                <TableCell>{student.sexe}</TableCell>
                                <TableCell>{student.class?.libelle || 'N/A'}</TableCell>
                                <TableCell>{student.category}</TableCell>
                                <TableCell>{student.parent_tel}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(student)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(student.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredStudents.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    {t('students.messages.noStudentsFound')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('students.titles.edit') : t('students.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('students.fields.nom')}
                            {...register('nom')}
                            error={!!errors.nom}
                            helperText={errors.nom?.message?.toString()}
                            fullWidth
                        />
                        <TextField
                            label={t('students.fields.prenom')}
                            {...register('prenom')}
                            error={!!errors.prenom}
                            helperText={errors.prenom?.message?.toString()}
                            fullWidth
                        />
                        <Controller
                            name="date_naissance"
                            control={control}
                            render={({ field }) => (
                                <DatePicker
                                    label={t('students.fields.dob')}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.date_naissance,
                                            helperText: errors.date_naissance?.message?.toString(),
                                            InputLabelProps: { shrink: true }
                                        }
                                    }}
                                />
                            )}
                        />
                        <TextField
                            select
                            label={t('students.fields.sexe')}
                            {...register('sexe')}
                            error={!!errors.sexe}
                            helperText={errors.sexe?.message?.toString()}
                            fullWidth
                            SelectProps={{ native: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="">{t('students.fields.select')}</option>
                            <option value="M">{t('students.fields.male')}</option>
                            <option value="F">{t('students.fields.female')}</option>
                        </TextField>
                        <TextField
                            select
                            label={t('students.fields.category')}
                            {...register('category')}
                            error={!!errors.category}
                            helperText={errors.category?.message?.toString()}
                            fullWidth
                            SelectProps={{ native: true }}
                            defaultValue="Non redoublant(e)"
                        >
                            <option value="Non redoublant(e)">{t('students.fields.notRepeater')}</option>
                            <option value="Redoublant(e)">{t('students.fields.repeater')}</option>
                        </TextField>
                        <TextField
                            label={t('students.fields.address')}
                            {...register('adresse')}
                            fullWidth
                        />
                        <TextField
                            label={t('students.fields.parentTel')}
                            {...register('parent_tel')}
                            fullWidth
                        />
                        <TextField
                            select
                            label={t('students.fields.class')}
                            {...register('classe_id')}
                            error={!!errors.classe_id}
                            helperText={errors.classe_id?.message?.toString()}
                            fullWidth
                            SelectProps={{ native: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <option value="">{t('students.fields.selectClass')}</option>
                            {classes.map((classe) => (
                                <option key={classe.id} value={classe.id}>
                                    {classe.libelle}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('students.actions.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">
                        {editingId ? t('students.actions.edit') : t('students.actions.add')}
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
                    background: 'linear-gradient(135deg, #4527a0 0%, #5e35b1 60%, #7e57c2 100%)',
                    px: 4, py: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                            Aperçu d'impression
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                            Liste des Élèves — {filteredStudents.length} enregistrement{filteredStudents.length > 1 ? 's' : ''}
                        </Typography>
                    </Box>
                    <Print sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 32 }} />
                </Box>

                <DialogContent sx={{ p: 0, bgcolor: '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
                        <Box sx={{ flex: 1, px: 3, py: 1.5, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Nombre d'élèves</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#5e35b1' }}>{filteredStudents.length}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 2, py: 1.5 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#5e35b1' }}>
                                        {['Matricule', 'Nom', 'Prénom', 'Sexe', 'Classe', 'Téléphone'].map(h => (
                                            <TableCell key={h} sx={{ color: 'white', fontWeight: 700, py: 1.2 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredStudents.map((row, i) => (
                                        <TableRow key={row.id} sx={{ bgcolor: i % 2 === 0 ? 'white' : '#f2eef9' }}>
                                            <TableCell sx={{ whiteSpace: 'nowrap', py: 0.8 }}>{row.matricule}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.nom}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.prenom}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.sexe}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.class?.libelle || 'N/A'}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.parent_tel}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredStudents.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                                Aucune donnée à afficher
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>

                <Divider />
                <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
                    <Button onClick={() => setShowPrintPreview(false)} variant="outlined"
                        sx={{ borderColor: '#5e35b1', color: '#5e35b1', '&:hover': { borderColor: '#4527a0', bgcolor: '#f2eef9' } }}>
                        Annuler
                    </Button>
                    <Button onClick={doPrint} variant="contained" startIcon={<Print />}
                        sx={{ bgcolor: '#5e35b1', color: 'white', '&:hover': { bgcolor: '#4527a0' } }}>
                        Imprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Students;
