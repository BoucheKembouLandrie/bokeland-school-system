import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    TextField,
    MenuItem,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Tooltip,
    Dialog,
    Alert,
    Checkbox
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

interface Class { id: number; libelle: string; }
interface Student { id: number; nom: string; prenom: string; matricule: string; classe_id: number; }
interface Evaluation { id: number; nom: string; date_debut: string; date_fin: string; ordre: number; }
interface ExamRule { id: number; min_average: number; max_average: number; status: string; }
interface SchoolSettings { school_name: string; address: string; phone: string; email: string; logo_url: string; }

interface AnnualGradeData {
    evaluation: Evaluation;
    average: number;
    unjustifiedAbsences: number;
}

interface AnnualReportData {
    student: Student;
    gradesBySequence: AnnualGradeData[];
    totalAnnualAverage: number;
    totalUnjustifiedAbsences: number;
    observation: string;
    schoolInfo?: SchoolSettings;
}

const AnnualGradesTab: React.FC = () => {
    const { t } = useTranslation();

    const [classes, setClasses] = useState<Class[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [examRules, setExamRules] = useState<ExamRule[]>([]);
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [isPrinting, setIsPrinting] = useState(false);
    const [reportData, setReportData] = useState<AnnualReportData[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
            setSearchQuery('');
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

    useEffect(() => {
        let result = students;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = students.filter(s =>
                (s.nom + ' ' + s.prenom).toLowerCase().includes(query) ||
                (s.matricule && s.matricule.toLowerCase().includes(query))
            );
        }
        setFilteredStudents(result);
    }, [searchQuery, students]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [classesRes, evaluationsRes, rulesRes, settingsRes] = await Promise.all([
                api.get('/classes'),
                api.get('/evaluations'),
                api.get('/exam-rules'),
                api.get('/settings')
            ]);
            setClasses(classesRes.data);
            // Sort evaluations by their order or id so they appear sequentially
            const sortedEvaluations = evaluationsRes.data.sort((a: Evaluation, b: Evaluation) => a.ordre - b.ordre || a.id - b.id);
            setEvaluations(sortedEvaluations);
            setExamRules(rulesRes.data);
            setSchoolSettings(settingsRes.data);
        } catch (err) {
            console.error('Error fetching initial data:', err);
            setError('Erreur lors du chargement des données initiales.');
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (classId: number) => {
        setLoadingAction(true);
        try {
            const response = await api.get(`/students?classe_id=${classId}`);
            setStudents(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des élèves.');
        } finally {
            setLoadingAction(false);
        }
    };

    const getObservationFromRules = (average: number) => {
        const rule = examRules.find(r => average >= r.min_average && average < r.max_average);
        if (!rule) {
            const exactMaxRule = examRules.find(r => average === r.max_average);
            if (exactMaxRule) return exactMaxRule.status;
            return "Non défini(e)";
        }
        return rule.status;
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(filteredStudents.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectStudent = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(prev => [...prev, id]);
        } else {
            setSelectedStudentIds(prev => prev.filter(studentId => studentId !== id));
        }
    };

    const handlePrintMultiple = async (idsToPrint?: number[]) => {
        const targetIds = idsToPrint || selectedStudentIds;
        if (!selectedClassId || targetIds.length === 0) return;
        setLoadingAction(true);
        setError('');

        try {
            // Fetch ALL grades for the class
            const allGradesRes = await api.get('/notes', { params: { classe_id: selectedClassId } });
            const allGrades = allGradesRes.data;

            // Fetch ALL subjects for the class to get coefficients
            const allSubjectsRes = await api.get(`/subjects?classe_id=${selectedClassId}`);
            const subjects = allSubjectsRes.data;

            // Fetch ALL attendances for the year (optimally we'd filter by student, but API doesn't support list of students)
            // By default, /attendance without date filters gets all for the school year
            const attendanceRes = await api.get('/attendance');
            const allAttendances = attendanceRes.data;

            const selectedStudentsData = filteredStudents.filter(s => targetIds.includes(s.id));
            const generatedReports: AnnualReportData[] = [];

            for (const student of selectedStudentsData) {
                // Filter data for the specific student
                const studentGrades = allGrades.filter((g: any) => Number(g.eleve_id) === Number(student.id));
                const studentAttendances = allAttendances.filter((a: any) => Number(a.eleve_id) === Number(student.id));

                // Generate sequence data
                const gradesBySequence: AnnualGradeData[] = [];
                let totalAccumulatedAverages = 0;
                let sequencesWithGrades = 0;
                let totalUnjustifiedAbsencesForYear = 0;

                for (const evaluation of evaluations) {
                    // 1. Calculate Average for this evaluation
                    let totalPoints = 0;
                    let totalCoef = 0;

                    subjects.forEach((sub: any) => {
                        const gradeEntry = studentGrades.find((g: any) => Number(g.matiere_id) === Number(sub.id) && String(g.trimestre) === String(evaluation.nom));
                        if (gradeEntry) {
                            const note = parseFloat(gradeEntry.note) || 0;
                            const coef = sub.coefficient || 1;
                            totalPoints += note * coef;
                            totalCoef += coef;
                        }
                    });

                    let average = 0;
                    if (totalCoef > 0) {
                        average = totalPoints / totalCoef;
                        totalAccumulatedAverages += average;
                        sequencesWithGrades++;
                    }

                    // 2. Calculate Unjustified Absences for this evaluation
                    // Assuming evaluation has date_debut and date_fin
                    let seqAbsences = 0;
                    if (evaluation.date_debut && evaluation.date_fin) {
                        const startDate = new Date(evaluation.date_debut);
                        const endDate = new Date(evaluation.date_fin);

                        studentAttendances.forEach((att: any) => {
                            const attDate = new Date(att.date);
                            // Check if attendance is within evaluation dates and is unjustified absent
                            if (attDate >= startDate && attDate <= endDate) {
                                if (att.statut === 'absent' && att.motif && att.motif.toLowerCase().includes('non justifiée')) {
                                    seqAbsences++;
                                }
                            }
                        });
                    }
                    totalUnjustifiedAbsencesForYear += seqAbsences;

                    gradesBySequence.push({
                        evaluation,
                        average,
                        unjustifiedAbsences: seqAbsences
                    });
                }

                // Calculate annual average
                const totalAnnualAverage = sequencesWithGrades > 0 ? totalAccumulatedAverages / sequencesWithGrades : 0;
                const observation = getObservationFromRules(totalAnnualAverage);

                generatedReports.push({
                    student,
                    gradesBySequence,
                    totalAnnualAverage,
                    totalUnjustifiedAbsences: totalUnjustifiedAbsencesForYear,
                    observation,
                    schoolInfo: schoolSettings || undefined
                });
            }

            setReportData(generatedReports);

            setIsPrinting(true);

        } catch (err) {
            console.error("Error generating annual report data:", err);
            setError("Erreur lors de la génération du bulletin annuel.");
        } finally {
            setLoadingAction(false);
        }
    };

    const handleSinglePrint = (student: Student) => {
        setSelectedStudentIds([student.id]);
        handlePrintMultiple([student.id]);
    };

    const getLogoUrl = (url?: string) => {
        if (!url) return "/logo-bokeland-school-system.png";
        if (url.startsWith('http')) return url;
        const backendUrl = `http://${window.location.hostname}:5006`;
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        return `${backendUrl}/${cleanUrl}`;
    };

    const ReportCardModal = () => {
        if (!reportData || reportData.length === 0) return null;

        return (
            <Dialog
                open={isPrinting}
                onClose={() => setIsPrinting(false)}
                maxWidth={false}
                PaperProps={{
                    sx: {
                        bgcolor: 'transparent',
                        boxShadow: 'none',
                        maxWidth: '95vw',
                        maxHeight: '95vh',
                        overflow: 'hidden',
                        m: 2
                    }
                }}
            >
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>

                    <Box sx={{
                        flex: 1,
                        overflowY: 'auto',
                        height: 'calc(90vh - 40px)',
                        display: 'block',
                        textAlign: 'center',
                        pt: 2,
                        pr: 2
                    }}>
                        <Box className="print-container" sx={{ minWidth: '210mm', width: '210mm', margin: '0 auto', textAlign: 'left' }}>
                            <style type="text/css" media="print">
                                {`
                                @page { size: auto; margin: 0; }
                                
                                /* CONDITIONAL SINGLE PAGE FORCE */
                                ${reportData.length === 1 ? `
                                    html, body {
                                        height: 297mm !important;
                                        max-height: 297mm !important;
                                        overflow: hidden !important;
                                    }
                                    .print-container {
                                        height: 297mm !important;
                                        max-height: 297mm !important;
                                        overflow: hidden !important;
                                    }
                                ` : ''}
                                
                                html, body { background: white; -webkit-print-color-adjust: exact; }
                                body * { visibility: hidden; }
                                .print-container, .print-container * { visibility: visible; }
                                .MuiDialog-root, .MuiDialog-container, .MuiPaper-root {
                                    visibility: visible !important; position: static !important; overflow: visible !important; transform: none !important;
                                    box-shadow: none !important; width: auto !important; height: auto !important; margin: 0 !important;
                                    padding: 0 !important; max-width: none !important; max-height: none !important; display: block !important;
                                    background: transparent !important;
                                }
                                .print-container {
                                    position: absolute; left: 0; top: 0; width: 100%; margin: 0; padding: 0;
                                    zoom: 1 !important; transform: none !important; z-index: 9999; background: white; text-align: left;
                                }
                                .printable-content {
                                    position: relative; width: 100% !important; min-width: 0 !important; max-width: 100% !important;
                                    margin: 0 !important; padding: 8mm !important; box-shadow: none !important; border: none !important;
                                    min-height: auto !important; box-sizing: border-box !important;
                                }
                                .page-break { page-break-after: always; }
                                .no-print { display: none !important; }
                                `}
                            </style>

                            {reportData.map((data, index) => (
                                <Paper key={index} elevation={3} className="printable-content" sx={{ width: '210mm', minHeight: '297mm', p: 4, mx: 'auto', mb: 4, backgroundColor: 'white', position: 'relative', boxSizing: 'border-box', pageBreakAfter: index < reportData.length - 1 ? 'always' : 'auto' }}>
                                    {/* HEADER */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'flex-start' }}>
                                        <Box sx={{ textAlign: 'left' }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', textTransform: 'uppercase' }}>
                                                {data.schoolInfo?.school_name || "LEUANA SCHOOL SYSTEM"}
                                            </Typography>
                                            <Typography variant="body2">{data.schoolInfo?.phone || "+237 600 00 00 00"}</Typography>
                                            <Typography variant="body2">{data.schoolInfo?.address || "Yaoundé, Cameroun"}</Typography>
                                            <Typography variant="body2">{data.schoolInfo?.email || "info@leuana-school.com"}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <img
                                                src={getLogoUrl(data.schoolInfo?.logo_url)}
                                                alt="Logo"
                                                style={{ height: 120, width: 120, objectFit: 'contain' }}
                                                onError={(e) => {
                                                    if (e.currentTarget.src !== window.location.origin + "/logo-bokeland-school-system.png") {
                                                        e.currentTarget.src = "/logo-bokeland-school-system.png";
                                                    } else {
                                                        e.currentTarget.style.display = 'none';
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>
                                        BULLETIN ANNUEL
                                    </Typography>

                                    {/* STUDENT INFO */}
                                    <Box sx={{ mb: 3, textAlign: 'left' }}>
                                        <Typography><strong>Nom de l'élève :</strong> {data.student.nom} {data.student.prenom}</Typography>
                                        <Typography><strong>Classe :</strong> {classes.find(c => c.id === selectedClassId)?.libelle}</Typography>
                                    </Box>

                                    {/* EVALUATIONS TABLE */}
                                    <TableContainer sx={{ border: '1px solid #000', borderRadius: '12px', mb: 1.5, overflow: 'hidden' }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ bgcolor: '#fff3e0' }}>
                                                    <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd', width: '40%' }}>Évaluations</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd', width: '30%' }}>Moyenne</TableCell>
                                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Absences non justifiées</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {data.gradesBySequence.map((seq: any, idx: number) => (
                                                    <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' }, '&:nth-of-type(even)': { bgcolor: '#fff8f5' } }}>
                                                        <TableCell sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{seq.evaluation.nom}</TableCell>
                                                        <TableCell align="center" sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{seq.average > 0 ? seq.average.toFixed(2) : '-'}</TableCell>
                                                        <TableCell align="center" sx={{ py: 0.8 }}>{seq.unjustifiedAbsences}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {/* Padding empty rows to make it look full */}
                                                {Array.from({ length: Math.max(0, 6 - data.gradesBySequence.length) }).map((_, idx) => (
                                                    <TableRow key={`empty-${idx}`} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' }, '&:nth-of-type(even)': { bgcolor: '#fff8f5' }, height: '35px' }}>
                                                        <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>&nbsp;</TableCell>
                                                        <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>&nbsp;</TableCell>
                                                        <TableCell>&nbsp;</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* FOOTER STATS */}
                                    <Box sx={{ border: '1px solid #000', borderRadius: 2, display: 'flex', mb: 2, overflow: 'hidden' }}>
                                        <Box sx={{ p: 1.5, borderRight: '1px solid #000', display: 'flex', alignItems: 'center', gap: 1, minWidth: '150px' }}>
                                            <Typography variant="body2">Total annuel</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{data.totalAnnualAverage > 0 ? data.totalAnnualAverage.toFixed(2) : '-'} / 20</Typography>
                                        </Box>
                                        <Box sx={{ p: 1.5, borderRight: '1px solid #000', display: 'flex', alignItems: 'center', gap: 1, minWidth: '100px' }}>
                                            <Typography variant="body2">Absences non justifiées</Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                {data.totalUnjustifiedAbsences}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ p: 1.5, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                            <Typography variant="body1" sx={{ fontStyle: 'italic', fontWeight: 'bold' }}>
                                                {data.observation}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* DATE */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 'auto', px: 2 }}>
                                        <Typography variant="body1">
                                            Date: {new Date().toLocaleDateString('fr-FR')}
                                        </Typography>
                                    </Box>
                                </Paper>
                            ))}
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box className="print-hide" sx={{ display: 'flex', flexDirection: 'column', gap: 2, ml: 2 }}>
                        <IconButton onClick={() => setIsPrinting(false)} sx={{ bgcolor: '#d32f2f', color: 'white', width: 56, height: 56, '&:hover': { bgcolor: '#b71c1c' } }}>
                            <CloseIcon />
                        </IconButton>
                        <IconButton onClick={() => window.print()} sx={{ bgcolor: '#1976d2', color: 'white', width: 56, height: 56, '&:hover': { bgcolor: '#115293' } }}>
                            <PrintIcon />
                        </IconButton>
                    </Box>

                </Box>
            </Dialog>
        );
    };

    if (loading) {
        return <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>;
    }

    return (
        <Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Filter Bar */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label="Classe"
                            value={selectedClassId || ''}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.libelle}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            fullWidth
                            label="Rechercher un élève"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Entrez un nom ou matricule..."
                            disabled={!selectedClassId}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}></Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={!selectedClassId || selectedStudentIds.length === 0}
                            onClick={() => handlePrintMultiple()}
                            startIcon={<PrintIcon />}
                            sx={{
                                height: '56px',
                                bgcolor: '#d32f2f', // Red to match image or theme
                                '&:hover': { bgcolor: '#b71c1c' },
                                textTransform: 'none',
                                fontSize: '0.95rem'
                            }}
                        >
                            Imprimer
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loadingAction && (
                <Box display="flex" justifyContent="center" mb={2}><CircularProgress size={24} /></Box>
            )}

            {/* Students Table */}
            {selectedClassId && !loadingAction && (
                <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={filteredStudents.length > 0 && selectedStudentIds.length === filteredStudents.length}
                                        indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < filteredStudents.length}
                                        onChange={(e) => handleSelectAll(e.target.checked)}
                                    />
                                </TableCell>
                                <TableCell>Nom</TableCell>
                                <TableCell>Prénom</TableCell>
                                <TableCell>Matricule</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => {
                                    const isSelected = selectedStudentIds.includes(student.id);
                                    return (
                                        <TableRow
                                            key={student.id}
                                            hover
                                            onClick={() => handleSelectStudent(student.id, !isSelected)}
                                            role="checkbox"
                                            selected={isSelected}
                                            sx={{
                                                cursor: 'pointer',
                                                height: '45px',
                                                '&:nth-of-type(odd)': { backgroundColor: '#FFF5F0' },
                                                '&.Mui-selected': { backgroundColor: '#ffe0b2 !important' },
                                                '&.Mui-selected:hover': { backgroundColor: '#ffcc80 !important' }
                                            }}
                                        >
                                            <TableCell padding="checkbox" sx={{ py: 0.5 }}>
                                                <Checkbox checked={isSelected} size="small" sx={{ color: '#ff6f00', '&.Mui-checked': { color: '#ff6f00' }, p: 0.5 }} />
                                            </TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{student.nom}</TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{student.prenom}</TableCell>
                                            <TableCell sx={{ py: 0.5 }}>{student.matricule || 'N/A'}</TableCell>
                                            <TableCell align="right" sx={{ py: 0.5 }}>
                                                <Tooltip title="Imprimer le bulletin">
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleSinglePrint(student);
                                                        }}
                                                        size="small"
                                                        sx={{
                                                            color: '#ff6f00',
                                                            '&:hover': { backgroundColor: 'rgba(255, 111, 0, 0.08)' }
                                                        }}
                                                    >
                                                        <PrintIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        Aucun élève trouvé.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <ReportCardModal />

        </Box>
    );
};

export default AnnualGradesTab;
