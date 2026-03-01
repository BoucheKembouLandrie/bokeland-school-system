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
    MenuItem,
    Grid,
    Autocomplete,
    Divider,
} from '@mui/material';
import { Edit, Delete, Add, Print } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { formatDate } from '../utils/formatDate';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const createSchema = (t: any) => z.object({
    date: z.string().min(1, t('attendance.validation.dateRequired')),
    classe_id: z.string().min(1, t('attendance.validation.classRequired')),
    eleve_id: z.string().min(1, t('attendance.validation.studentRequired')),
    motif: z.string().min(1, t('attendance.validation.reasonRequired')),
    time: z.string().min(1, t('attendance.validation.timeRequired')),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface Attendance {
    id: number;
    eleve_id: number;
    date: string;
    statut: string;
    motif: string;
    time: string;
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
}

const Attendance: React.FC = () => {
    const { t } = useTranslation();
    const schema = createSchema(t);
    const [attendances, setAttendances] = useState<Attendance[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filter states
    const [filterDate, setFilterDate] = useState('');
    const [filterClass, setFilterClass] = useState('');
    const [filterStudent, setFilterStudent] = useState('');
    const [filterStudentsList, setFilterStudentsList] = useState<Student[]>([]);

    const { register, handleSubmit, reset, watch, setValue, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const selectedClassId = watch('classe_id');

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            const filtered = students.filter(s => s.classe_id === parseInt(selectedClassId));
            setFilteredStudents(filtered);
        } else {
            setFilteredStudents([]);
        }
    }, [selectedClassId, students]);

    useEffect(() => {
        if (filterClass) {
            const filtered = students.filter(s => s.classe_id === parseInt(filterClass));
            setFilterStudentsList(filtered);
        } else {
            setFilterStudentsList([]);
        }
    }, [filterClass, students]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [attendancesRes, studentsRes, classesRes] = await Promise.all([
                api.get('/attendance'),
                api.get('/students'),
                api.get('/classes'),
            ]);
            setAttendances(attendancesRes.data);
            setStudents(studentsRes.data);
            setClasses(classesRes.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data', err);
            setError(t('attendance.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        console.log("=== ATTENDANCE FORM SUBMIT ===");
        console.log("Form data:", data);

        try {
            const payload = {
                ...data,
                statut: 'retard',
            };
            console.log("Payload to send:", payload);

            if (editingId) {
                console.log("Updating attendance ID:", editingId);
                await api.put(`/attendance/${editingId}`, payload);
            } else {
                console.log("Creating new attendance...");
                const response = await api.post('/attendance', payload);
                console.log("✅ Response:", response.data);
            }
            fetchData();
            handleClose();
            setError('');
        } catch (err: any) {
            console.error('❌ Error saving attendance:', err);
            console.error('Error response:', err.response?.data);
            console.error('Error status:', err.response?.status);
            setError(t('attendance.messages.saveError'));
        }
    };

    const handleEdit = (attendance: Attendance) => {
        setEditingId(attendance.id);
        const student = students.find(s => s.id === attendance.eleve_id);
        if (student) {
            setValue('classe_id', student.classe_id.toString());
        }
        reset({
            eleve_id: attendance.eleve_id.toString(),
            classe_id: student?.classe_id.toString() || '',
            date: attendance.date.split('T')[0],
            motif: attendance.motif || 'absence justifiée',
            time: attendance.time || '',
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm(t('attendance.messages.deleteConfirm'))) {
            try {
                await api.delete(`/attendance/${id}`);
                fetchData();
                setError('');
            } catch (err) {
                console.error('Error deleting attendance', err);
                setError(t('attendance.messages.deleteError'));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        reset();
    };

    const [showPrintPreview, setShowPrintPreview] = useState(false);

    const doPrint = () => {
        const rows = filteredAttendances.map(attendance => `
            <tr>
                <td>${attendance.student ? `${attendance.student.nom} ${attendance.student.prenom}` : 'N/A'}</td>
                <td>${formatDate(attendance.date)}</td>
                <td>${attendance.motif}</td>
                <td>${attendance.time}</td>
            </tr>
        `).join('');

        const classLabel = filterClass
            ? classes.find(c => c.id.toString() === filterClass)?.libelle
            : 'Toutes les classes';
        const dateLabel = filterDate ? formatDate(filterDate) : '';
        const subtitle = `${classLabel}${dateLabel ? ' | ' + dateLabel : ''}`;

        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Liste des Présences</title>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; margin: 20px; color: #333; box-sizing: border-box; }
                    h2 { text-align: center; margin-bottom: 4px; color: #1e88e5; font-size: 18px; }
                    .subtitle { text-align: center; color: #888; margin-bottom: 20px; font-size: 11px; }
                    table { width: 100%; border-collapse: collapse; margin: 0 auto; }
                    th { background-color: #1e88e5; color: white; padding: 10px 8px; text-align: left; font-weight: 600; }
                    td { padding: 7px 8px; border-bottom: 1px solid #e0e0e0; }
                    tr { page-break-inside: avoid; }
                    tr:nth-child(even) td { background-color: #ecf5fd; }
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
                <h2>Liste des Présences</h2>
                <p class="subtitle">${subtitle}</p>
                <table>
                    <thead>
                        <tr><td colspan="4" class="print-spacer"></td></tr>
                        <tr><th>Nom</th><th>Date</th><th>Motif</th><th>Période</th></tr>
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

    // Filter attendances based on selected filters
    const filteredAttendances = attendances.filter(attendance => {
        if (filterDate && attendance.date.split('T')[0] !== filterDate) return false;

        if (filterClass) {
            const student = students.find(s => s.id === attendance.eleve_id);
            if (!student || student.classe_id !== parseInt(filterClass)) return false;
        }
        if (filterStudent && attendance.eleve_id !== parseInt(filterStudent)) return false;
        return true;
    });

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
                    sx={{ backgroundColor: '#1e88e5', '&:hover': { backgroundColor: '#1565c0' } }}
                >
                    {t('attendance.actions.addAttendance')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Filter Bar */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <DatePicker
                            label={t('attendance.fields.date')}
                            value={filterDate ? dayjs(filterDate) : null}
                            onChange={(newValue) => setFilterDate(newValue ? newValue.format('YYYY-MM-DD') : '')}
                            slotProps={{ textField: { fullWidth: true, InputLabelProps: { shrink: true } } }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <TextField
                            select
                            label={t('attendance.fields.class')}
                            fullWidth
                            value={filterClass}
                            onChange={(e) => {
                                setFilterClass(e.target.value);
                                setFilterStudent('');
                            }}
                            SelectProps={{ displayEmpty: true }}
                            InputLabelProps={{ shrink: true }}
                        >
                            <MenuItem value="">{t('attendance.fields.allClasses')}</MenuItem>
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id.toString()}>{cls.libelle}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Autocomplete
                            options={filterStudentsList}
                            getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                            value={filterStudentsList.find(s => s.id.toString() === filterStudent) || null}
                            onChange={(_, newValue) => setFilterStudent(newValue ? newValue.id.toString() : '')}
                            disabled={!filterClass}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('attendance.fields.student')}
                                    InputLabelProps={{ shrink: true }}
                                />
                            )}
                            noOptionsText={t('attendance.messages.noStudentFound')}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<Print />}
                            onClick={() => setShowPrintPreview(true)}
                            sx={{ backgroundColor: '#1e88e5', '&:hover': { backgroundColor: '#1565c0' }, height: '56px' }}
                        >
                            Imprimer
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('attendance.fields.name')}</TableCell>
                            <TableCell>{t('attendance.fields.date')}</TableCell>
                            <TableCell>{t('attendance.fields.reason')}</TableCell>
                            <TableCell>{t('attendance.fields.period')}</TableCell>
                            <TableCell>{t('attendance.fields.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredAttendances.map((attendance) => (
                            <TableRow key={attendance.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#ecf5fd' } }}>
                                <TableCell>
                                    {attendance.student ? `${attendance.student.nom} ${attendance.student.prenom}` : 'N/A'}
                                </TableCell>
                                <TableCell>{formatDate(attendance.date)}</TableCell>
                                <TableCell>{attendance.motif}</TableCell>
                                <TableCell>{attendance.time}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(attendance)} color="primary">
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(attendance.id)} color="error">
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('attendance.titles.edit') : t('attendance.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Controller
                            control={control}
                            name="date"
                            defaultValue={new Date().toISOString().split('T')[0]}
                            render={({ field }) => (
                                <DatePicker
                                    label={t('attendance.fields.date')}
                                    value={field.value ? dayjs(field.value) : null}
                                    onChange={(newValue) => field.onChange(newValue ? newValue.format('YYYY-MM-DD') : '')}
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            InputLabelProps: { shrink: true },
                                            error: !!errors.date,
                                            helperText: errors.date?.message
                                        }
                                    }}
                                />
                            )}
                        />
                        <TextField
                            select
                            label={t('attendance.fields.class')}
                            {...register('classe_id')}
                            error={!!errors.classe_id}
                            helperText={errors.classe_id?.message}
                            fullWidth
                            defaultValue=""
                        >
                            <MenuItem value="">{t('attendance.fields.selectClass')}</MenuItem>
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id.toString()}>
                                    {cls.libelle}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Autocomplete
                            options={filteredStudents}
                            getOptionLabel={(option) => `${option.nom} ${option.prenom}`}
                            value={filteredStudents.find(s => s.id.toString() === watch('eleve_id')) || null}
                            onChange={(_, newValue) => setValue('eleve_id', newValue ? newValue.id.toString() : '')}
                            disabled={!selectedClassId}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={t('attendance.fields.student')}
                                    error={!!errors.eleve_id}
                                    helperText={errors.eleve_id?.message}
                                />
                            )}
                            noOptionsText={t('attendance.messages.noStudentFound')}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                        />
                        <TextField
                            select
                            label={t('attendance.fields.reason')}
                            {...register('motif')}
                            error={!!errors.motif}
                            helperText={errors.motif?.message}
                            fullWidth
                            defaultValue="absence justifiée"
                        >
                            <MenuItem value="absence justifiée">{t('attendance.reasons.justified')}</MenuItem>
                            <MenuItem value="absence non justifiée">{t('attendance.reasons.unjustified')}</MenuItem>
                        </TextField>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                select
                                label={t('attendance.fields.time')}
                                {...register('time')}
                                error={!!errors.time}
                                helperText={errors.time?.message}
                                sx={{ flex: 1 }}
                                value={watch('time')?.split(':')[0] || ''}
                                onChange={(e) => {
                                    const hour = e.target.value;
                                    const minute = watch('time')?.split(':')[1] || '00';
                                    setValue('time', `${hour}:${minute}`);
                                }}
                            >
                                {Array.from({ length: 24 }, (_, i) => (
                                    <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}h
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                select
                                label={t('attendance.fields.minutes')}
                                sx={{ flex: 1 }}
                                value={watch('time')?.split(':')[1] || ''}
                                onChange={(e) => {
                                    const hour = watch('time')?.split(':')[0] || '00';
                                    const minute = e.target.value;
                                    setValue('time', `${hour}:${minute}`);
                                }}
                            >
                                {Array.from({ length: 60 }, (_, i) => (
                                    <MenuItem key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('attendance.actions.cancel')}</Button>
                    <Button
                        onClick={() => {
                            console.log("Save button clicked!");
                            console.log("Form errors:", errors);
                            console.log("Form values:", watch());
                            handleSubmit(onSubmit)();
                        }}
                        variant="contained"
                    >
                        {editingId ? t('attendance.actions.edit') : t('attendance.actions.save')}
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
                    background: 'linear-gradient(135deg, #1565c0 0%, #1e88e5 60%, #42a5f5 100%)',
                    px: 4, py: 2.5,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
                            Aperçu d'impression
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                            Liste des Présences — {filteredAttendances.length} enregistrement{filteredAttendances.length > 1 ? 's' : ''}
                        </Typography>
                    </Box>
                    <Print sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 32 }} />
                </Box>

                <DialogContent sx={{ p: 0, bgcolor: '#f8f9fa' }}>
                    <Box sx={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
                        <Box sx={{ flex: 1, px: 3, py: 1.5, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Nombre de présences</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e88e5' }}>{filteredAttendances.length}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{ maxHeight: 400, overflowY: 'auto', px: 2, py: 1.5 }}>
                        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: '#1e88e5' }}>
                                        {['Nom', 'Date', 'Motif', 'Période'].map(h => (
                                            <TableCell key={h} sx={{ color: 'white', fontWeight: 700, py: 1.2 }}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredAttendances.map((row, i) => (
                                        <TableRow key={row.id} sx={{ bgcolor: i % 2 === 0 ? 'white' : '#ecf5fd' }}>
                                            <TableCell sx={{ py: 0.8 }}>{row.student ? `${row.student.nom} ${row.student.prenom}` : 'N/A'}</TableCell>
                                            <TableCell sx={{ whiteSpace: 'nowrap', py: 0.8 }}>{formatDate(row.date)}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.motif}</TableCell>
                                            <TableCell sx={{ py: 0.8 }}>{row.time}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredAttendances.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 3, color: 'text.secondary' }}>
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
                        sx={{ borderColor: '#1e88e5', color: '#1e88e5', '&:hover': { borderColor: '#1565c0', bgcolor: '#ecf5fd' } }}>
                        Annuler
                    </Button>
                    <Button onClick={doPrint} variant="contained" startIcon={<Print />}
                        sx={{ bgcolor: '#1e88e5', color: 'white', '&:hover': { bgcolor: '#1565c0' } }}>
                        Imprimer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Attendance;
