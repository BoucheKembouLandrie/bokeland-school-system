import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
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
    MenuItem,
    Alert,
    Grid,
    IconButton,
    Checkbox,
    CircularProgress,
    Tooltip,
    Dialog,
    AppBar,
    Toolbar,
    Slide
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

// ... interfaces ...
interface Class { id: number; libelle: string; }
interface Evaluation { id: number; nom: string; }
interface Student { id: number; nom: string; prenom: string; matricule: string; }
interface SubjectGrade { matiere: string; coefficient: number; note: number; total: number; observation: string; }
interface ReportCardData {
    student: Student;
    grades: SubjectGrade[];
    stats: {
        totalCoef: number;
        totalPoints: number;
        average: number;
        rank: number;
        totalStudents: number;
        bestAverage: number;
        worstAverage: number;
        classAverage: number;
        absences: number;
        decision: string;
    };
    schoolInfo?: any;
}

interface SchoolSettings {
    school_name: string;
    address: string;
    phone: string;
    email: string;
    logo_url: string;
}

interface ExamRule {
    id: number;
    min_average: number;
    max_average: number;
    status: string; // Decision/Observation
}

// Helper for safe float parsing
const safeParseFloat = (val: any) => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
};

// Transition for Dialog
const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const PrintingTab: React.FC = () => {
    const { t } = useTranslation();
    const [classes, setClasses] = useState<Class[]>([]);
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
    const [selectedEvaluationId, setSelectedEvaluationId] = useState<number | null>(null);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);

    // Settings & Rules
    const [schoolSettings, setSchoolSettings] = useState<SchoolSettings | null>(null);
    const [examRules, setExamRules] = useState<ExamRule[]>([]);

    // Printing state
    const [isPrinting, setIsPrinting] = useState(false);
    const [reportCards, setReportCards] = useState<ReportCardData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            fetchStudents(selectedClassId);
            setSelectedStudentIds([]);
        } else {
            setStudents([]);
        }
    }, [selectedClassId]);

    const fetchInitialData = async () => {
        try {
            const [classesRes, evaluationsRes, settingsRes, rulesRes] = await Promise.all([
                api.get('/classes'),
                api.get('/evaluations'),
                api.get('/settings'),
                api.get('/exam-rules')
            ]);
            setClasses(classesRes.data);
            setEvaluations(evaluationsRes.data);
            setSchoolSettings(settingsRes.data);
            setExamRules(rulesRes.data);
        } catch (err) {
            console.error('Error fetching initial data:', err);
        }
    };

    const fetchStudents = async (classId: number) => {
        try {
            const response = await api.get(`/students?classe_id=${classId}`);
            setStudents(response.data);
        } catch (err) {
            setError(t('exams.printing.messages.studentsLoadError'));
        }
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(students.map(s => s.id));
        } else {
            setSelectedStudentIds([]);
        }
    };

    const handleSelectStudent = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedStudentIds(prev => [...prev, id]);
        } else {
            setSelectedStudentIds(prev => prev.filter(sid => sid !== id));
        }
    };

    const handleSinglePrint = (student: Student) => {
        handlePreparePrint([student.id]);
    };

    const getObservationFromRules = (average: number) => {
        const rule = examRules.find(r => average >= r.min_average && average < r.max_average);
        if (!rule) {
            // Check for exact max match (e.g. 20)
            const exactMaxRule = examRules.find(r => average === r.max_average);
            if (exactMaxRule) return exactMaxRule.status;
            return "Non défini(e)";
        }
        return rule.status;
    };

    const calculateObservation = (note: number) => {
        if (note >= 0 && note <= 7) return "Médiocre";
        if (note > 7 && note <= 9.99) return "Passable";
        if (note > 9.99 && note <= 12) return "Assez Bien";
        if (note > 12 && note <= 16) return "Bien";
        if (note > 16 && note <= 18) return "Très Bien";
        if (note > 18 && note <= 20) return "Excellent";
        return "";
    };

    const handlePreparePrint = async (targetIds?: number[]) => {
        const idsToPrint = targetIds || selectedStudentIds;

        if (!selectedClassId || !selectedEvaluationId) {
            setError(t('exams.printing.messages.selectFields'));
            return;
        }
        // Allow printing all if none selected? Usually yes, logic below handles it if empty -> all.
        // But here we use idsToPrint. If empty, user must select or we auto-select all?
        // Current logic: if selectedStudentIds is empty, we print NOTHING unless targetIds passed.
        // Wait, original logic: "const idsToPrint = selectedStudentIds.length > 0 ? selectedStudentIds : students.map(s => s.id);"
        // My previous view showed: "const idsToPrint = targetIds || selectedStudentIds;" then "if (idsToPrint.length === 0) return;"
        // The user might expect "Select All" behavior if none selected?
        // Let's stick to the behavior: if none selected, warn user (as per original code).
        // BUT, wait, I want to support "Print All".
        // Let's modify: if idsToPrint is empty, default to ALL students.

        let finalIds = idsToPrint;
        if (finalIds.length === 0) {
            finalIds = students.map(s => s.id);
        }

        if (finalIds.length === 0) {
            setError(t('exams.printing.messages.selectStudent'));
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Optimization: Fetch all grades for class & evaluation once
            const allGradesRes = await api.get('/notes', {
                params: {
                    classe_id: selectedClassId,
                    evaluation_id: selectedEvaluationId
                }
            });
            const allGrades = allGradesRes.data;

            const allSubjectsRes = await api.get(`/subjects?classe_id=${selectedClassId}`);
            const subjects: SubjectGrade[] = allSubjectsRes.data;

            // Find the selected evaluation to get its name for matching
            const selectedEvaluation = evaluations.find(e => e.id === selectedEvaluationId);
            const evaluationName = selectedEvaluation ? selectedEvaluation.nom : '';

            // --- CALCULATE RANKS FOR ALL STUDENTS IN CLASS ---
            const studentAverages = new Map<number, number>();

            // We use 'students' state which contains all students in the class
            students.forEach(stud => {
                const studGrades = allGrades.filter((g: any) => Number(g.eleve_id) === Number(stud.id));

                let totalPts = 0;
                let totalCoef = 0;
                subjects.forEach((sub: any) => {
                    const gradeEntry = studGrades.find((g: any) => Number(g.matiere_id) === Number(sub.id) && String(g.trimestre) === String(evaluationName));
                    const val = safeParseFloat(gradeEntry?.note);
                    const coef = sub.coefficient || 1;
                    totalPts += val * coef;
                    totalCoef += coef;
                });

                const avg = totalCoef > 0 ? totalPts / totalCoef : 0;
                studentAverages.set(stud.id, avg);
            });

            // Sort by average DESC
            const sortedStudentIds = Array.from(studentAverages.keys()).sort((a, b) => {
                const avgA = studentAverages.get(a) || 0;
                const avgB = studentAverages.get(b) || 0;
                return avgB - avgA;
            });

            // Map StudentID -> Rank
            const rankMap = new Map<number, number>();
            sortedStudentIds.forEach((sid, index) => {
                rankMap.set(sid, index + 1);
            });

            const reports: ReportCardData[] = [];

            for (const studentId of finalIds) {
                const student = students.find(s => s.id === studentId);
                if (!student) continue;

                const studentGrades = allGrades.filter((g: any) => Number(g.eleve_id) === Number(studentId));

                const reportGrades = subjects.map((sub: any) => {
                    const gradeEntry = studentGrades.find((g: any) => Number(g.matiere_id) === Number(sub.id) && String(g.trimestre) === String(evaluationName));
                    const note = safeParseFloat(gradeEntry?.note);
                    return {
                        matiere: sub.nom,
                        coefficient: sub.coefficient,
                        note: note,
                        total: note * sub.coefficient,
                        observation: calculateObservation(note)
                    };
                });

                const totalCoef = reportGrades.reduce((sum, g) => sum + g.coefficient, 0);
                const totalPoints = reportGrades.reduce((sum, g) => sum + g.total, 0);
                const average = totalCoef > 0 ? totalPoints / totalCoef : 0;

                reports.push({
                    student,
                    grades: reportGrades,
                    stats: {
                        totalCoef,
                        totalPoints,
                        average,
                        rank: rankMap.get(studentId) || 0,
                        totalStudents: students.length,
                        classAverage: 0,
                        bestAverage: 0,
                        worstAverage: 0,
                        absences: 0,
                        decision: getObservationFromRules(average)
                    }
                });
            }

            setReportCards(reports);
            setIsPrinting(true);

        } catch (err) {
            console.error('Error preparing print', err);
            setError(t('exams.printing.messages.reportLoadError'));
        } finally {
            setLoading(false);
        }
    };

    // Helper to construct logo URL
    const getLogoUrl = (url?: string) => {
        if (!url) return "/logo-bokeland-school-system.png";
        if (url.startsWith('http')) return url;
        // Assume relative paths are served from backend
        // Use the same logic as api.ts to determine backend URL
        const backendUrl = `http://${window.location.hostname}:5006`;
        // Ensure url doesn't start with / if we append (or handle it)
        const cleanUrl = url.startsWith('/') ? url.substring(1) : url;
        return `${backendUrl}/${cleanUrl}`;
    };

    // --- Render Report Card Preview (Modal) ---
    const ReportCardPreview = () => {
        return (
            <Dialog
                open={isPrinting}
                onClose={() => setIsPrinting(false)}
                TransitionComponent={Transition}
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
                {/* Main Container */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', justifyContent: 'center', height: '100%', overflow: 'hidden' }}>

                    {/* Bulletin Content Scrollable Area - FORCE VISIBLE SCROLLBAR */}
                    <Box
                        id="bulletins-container" // Add ID for easier targeting
                        sx={{
                            flex: 1,
                            overflowY: 'auto', // Vertical scroll
                            height: 'calc(90vh - 40px)', // Explicit height calculation to force overflow
                            display: 'block',
                            textAlign: 'center',
                            pt: 2,
                            pr: 2, // Padding for scrollbar
                        }}>
                        <Box
                            className="print-container" // Renamed from printable-content
                            sx={{
                                // Use natural A4 size + scroll instead of zoom
                                // zoom: '67%',  REMOVED: User wants full A4 size
                                width: '210mm',
                                minWidth: '210mm',
                                margin: '0 auto', // Center the A4 page in the scroll view
                                mb: 0
                            }}>
                            <style type="text/css" media="print">
                                {`
                        @page { 
                            size: auto; /* Allow browser to use selected page size */
                            margin: 0; /* Remove page margins - use internal padding instead */
                        }
                        
                        /* CONDITIONAL SINGLE PAGE FORCE */
                        ${reportCards.length === 1 ? `
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

                        body { -webkit-print-color-adjust: exact; }
                        
                        /* Hide everything by default */
                        body * {
                            visibility: hidden;
                        }

                        /* Target ONLY our print container and its contents */
                        .print-container, .print-container * {
                            visibility: visible;
                        }

                        /* Neutralize MUI Dialog Styles */
                        .MuiDialog-root, .MuiDialog-container, .MuiPaper-root {
                            visibility: visible !important;
                            position: static !important;
                            overflow: visible !important;
                            transform: none !important;
                            box-shadow: none !important;
                            width: auto !important;
                            height: auto !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            max-width: none !important;
                            max-height: none !important;
                            display: block !important;
                            background: transparent !important;
                        }

                        /* Position our container at the top left of the PAGE flow */
                        .print-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            margin: 0;
                            padding: 0;
                            zoom: 1 !important;
                            transform: none !important;
                            z-index: 9999;
                            background: white;
                            text-align: left;
                        }
                        
                        /* Ensure individual pages flow naturally and adapt to page size */
                        .printable-content {
                            position: relative;
                            width: 100% !important; /* Use full available width */
                            min-width: 0 !important; /* Allow shrinking for smaller formats */
                            max-width: 100% !important; /* Don't exceed page width */
                            margin: 0 !important; /* Remove margins */
                            padding: 8mm !important; /* Restore internal padding */
                            /* Removed page-break-after and break-after - they force empty pages */
                            box-shadow: none !important;
                            border: none !important;
                            min-height: auto !important; /* Let content determine height */
                            box-sizing: border-box !important;
                        }
                        
                        /* Reset the scroll container to avoid clipping */
                        #bulletins-container {
                            height: auto !important;
                            overflow: visible !important;
                            display: block !important;
                        }

                        .page-break { page-break-after: always; }
                        .no-print { display: none !important; }
                        `}
                            </style>
                            {/* Global scrollbar style for screen only */}
                            <style type="text/css" media="screen">
                                {`
                                ::-webkit-scrollbar {
                                    width: 12px;
                                    height: 12px;
                                }
                                ::-webkit-scrollbar-track {
                                    background: #f1f1f1;
                                    border-radius: 6px;
                                }
                                ::-webkit-scrollbar-thumb {
                                    background: #888;
                                    border-radius: 6px;
                                    border: 3px solid #f1f1f1;
                                }
                                ::-webkit-scrollbar-thumb:hover {
                                    background: #555;
                                }
                            `}
                            </style>

                            <Box className="bulletin-container">

                                {reportCards.map((report, index) => {
                                    const minRows = 15;
                                    const emptyRowsCount = Math.max(0, minRows - report.grades.length);
                                    const emptyRows = Array.from({ length: emptyRowsCount });

                                    return (
                                        <Paper
                                            key={index}
                                            elevation={3}
                                            className="printable-content"
                                            sx={{
                                                width: '210mm',
                                                minHeight: '297mm', // Full A4 height for preview
                                                p: 4, // Padding for preview - print CSS overrides with 8mm
                                                mb: 4, // Add margin for screen preview - Print CSS removes it
                                                mx: 'auto',
                                                backgroundColor: 'white',
                                                position: 'relative',
                                                // Force new page for each bulletin in mass print, except the last one
                                                pageBreakAfter: index < reportCards.length - 1 ? 'always' : 'auto',
                                                boxSizing: 'border-box' // Include padding in width/height calculation
                                            }}
                                        >
                                            {/* HEADER */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5, alignItems: 'flex-start' }}> {/* Reduced mb from 2 */}
                                                <Box sx={{ textAlign: 'left' }}> {/* Explicitly left align school info */}
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000', textTransform: 'uppercase' }}>
                                                        {schoolSettings?.school_name || "LEUANA SCHOOL SYSTEM"}
                                                    </Typography>
                                                    <Typography variant="body2">{schoolSettings?.phone || "+237 600 00 00 00"}</Typography>
                                                    <Typography variant="body2">{schoolSettings?.address || "Yaoundé, Cameroun"}</Typography>
                                                    <Typography variant="body2">{schoolSettings?.email || "info@leuana-school.com"}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img
                                                        src={getLogoUrl(schoolSettings?.logo_url)}
                                                        alt="Logo"
                                                        style={{ height: 120, width: 120, objectFit: 'contain' }}
                                                        onError={(e) => {
                                                            // Fallback to local default if backend image fails
                                                            if (e.currentTarget.src !== window.location.origin + "/logo-bokeland-school-system.png") {
                                                                e.currentTarget.src = "/logo-bokeland-school-system.png";
                                                            } else {
                                                                e.currentTarget.style.display = 'none';
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            </Box>

                                            <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', mb: 2, textTransform: 'uppercase' }}> {/* Reduced mb from 3 */}
                                                BULLETIN DE NOTE
                                            </Typography>

                                            {/* STUDENT INFO */}
                                            <Box sx={{ mb: 2, textAlign: 'left' }}> {/* Reduced mb from 3 - Explicitly left align student info */}
                                                <Typography><strong>Nom de l'élève :</strong> {report.student.nom} {report.student.prenom}</Typography>
                                                <Typography><strong>Classe :</strong> {classes.find(c => c.id === selectedClassId)?.libelle}</Typography>
                                                <Typography><strong>Évaluation :</strong> {evaluations.find(e => e.id === selectedEvaluationId)?.nom}</Typography>
                                            </Box>

                                            {/* GRADES TABLE */}
                                            <TableContainer sx={{ border: '1px solid #000', borderRadius: '12px', mb: 1.5, overflow: 'hidden' }}> {/* Reduced mb from 2 */}
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow sx={{ bgcolor: '#fff3e0' }}>
                                                            <TableCell sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd', width: '30%' }}>Matière</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Note / 20</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Coef.</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 'bold', borderRight: '1px solid #ddd' }}>Total</TableCell>
                                                            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Observation</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {report.grades.map((grade, idx) => (
                                                            <TableRow key={idx} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' }, '&:nth-of-type(even)': { bgcolor: '#fff8f5' } }}>
                                                                <TableCell sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{grade.matiere}</TableCell>
                                                                <TableCell align="center" sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{grade.note.toFixed(2)}</TableCell>
                                                                <TableCell align="center" sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{grade.coefficient}</TableCell>
                                                                <TableCell align="center" sx={{ borderRight: '1px solid #f0f0f0', py: 0.8 }}>{grade.total.toFixed(2)}</TableCell>
                                                                <TableCell align="center" sx={{ py: 0.8 }}>{grade.observation}</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        {emptyRows.map((_, idx) => (
                                                            <TableRow key={`empty-${idx}`} sx={{ '&:nth-of-type(odd)': { bgcolor: '#fff' }, '&:nth-of-type(even)': { bgcolor: '#fff8f5' }, height: '35px' }}>
                                                                <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>&nbsp;</TableCell>
                                                                <TableCell sx={{ borderRight: '1px solid #f0f0f0' }}>&nbsp;</TableCell>
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
                                                    <Typography variant="body2">Moyenne</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{report.stats.average.toFixed(2)} / 20</Typography>
                                                </Box>
                                                <Box sx={{ p: 1.5, borderRight: '1px solid #000', display: 'flex', alignItems: 'center', gap: 1, minWidth: '100px' }}>
                                                    <Typography variant="body2">Rang</Typography>
                                                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                        {report.stats.rank > 0 ? `${report.stats.rank}e / ${report.stats.totalStudents}` : '-'}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ p: 1.5, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    <Typography variant="body1" sx={{ fontWeight: '500', fontStyle: 'italic' }}>
                                                        {report.stats.decision}
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* DATE AND SIGNATURE */}
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto', px: 2 }}>
                                                <Box>
                                                    <Typography variant="body2">{new Date().toLocaleDateString('fr-FR')}</Typography>
                                                </Box>
                                                <Box sx={{ textAlign: 'center', minWidth: 200 }}>
                                                    {/* 'Le principal' text removed as per request */}
                                                    <Box sx={{ height: 30 }} /> {/* Reduced from 60 to prevent overflow */}
                                                </Box>
                                            </Box>

                                            {/* Digital Signature Removed as per request */}
                                        </Paper>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>

                    {/* Action Buttons - Right Side */}
                    <Box className="print-hide" sx={{ display: 'flex', flexDirection: 'column', gap: 2, ml: 2 }}>
                        <IconButton
                            onClick={() => setIsPrinting(false)}
                            sx={{
                                bgcolor: '#d32f2f',
                                color: 'white',
                                width: 56,
                                height: 56,
                                '&:hover': { bgcolor: '#b71c1c' }
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <IconButton
                            onClick={() => window.print()}
                            sx={{
                                bgcolor: '#1976d2',
                                color: 'white',
                                width: 56,
                                height: 56,
                                '&:hover': { bgcolor: '#115293' }
                            }}
                        >
                            <PrintIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Dialog >
        );
    };

    if (isPrinting) {
        return <ReportCardPreview />;
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>{t('exams.printing.title')}</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label={t('exams.common.evaluation')}
                            value={selectedEvaluationId || ''}
                            onChange={(e) => setSelectedEvaluationId(Number(e.target.value))}
                            sx={{ minWidth: 200 }}
                        >
                            {evaluations.map((evalItem) => (
                                <MenuItem key={evalItem.id} value={evalItem.id}>{evalItem.nom}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <TextField
                            select
                            fullWidth
                            label={t('exams.common.class')}
                            value={selectedClassId || ''}
                            onChange={(e) => setSelectedClassId(Number(e.target.value))}
                            sx={{ minWidth: 200 }}
                        >
                            {classes.map((cls) => (
                                <MenuItem key={cls.id} value={cls.id}>{cls.libelle}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    {/* Spacer (3rd column) */}
                    <Grid size={{ xs: 12, md: 3 }}></Grid>

                    {/* Print Button (4th column) */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            disabled={!selectedClassId || !selectedEvaluationId || selectedStudentIds.length === 0}
                            onClick={() => handlePreparePrint()}
                            startIcon={<PrintIcon />}
                            sx={{
                                height: '56px',
                                bgcolor: '#d32f2f', // Red to match image or theme
                                '&:hover': { bgcolor: '#b71c1c' },
                                textTransform: 'none', // To match "Nouvel élève" style which is typically sentence case in modern UIs
                                fontSize: '0.95rem'  // Slight adjustment to match typical button font size if default is different
                            }}
                        >
                            Imprimer
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {loading && <Box display="flex" justifyContent="center" my={4}><CircularProgress /></Box>}

            {/* Student Selection Table */}
            {!loading && selectedClassId && students.length > 0 && (
                <>
                    <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            checked={students.length > 0 && selectedStudentIds.length === students.length}
                                            indeterminate={selectedStudentIds.length > 0 && selectedStudentIds.length < students.length}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                    </TableCell>
                                    <TableCell>{t('exams.common.lastName')}</TableCell>
                                    <TableCell>{t('exams.common.firstName')}</TableCell>
                                    <TableCell>Matricule</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {students.map((student, index) => {
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
                                                height: '45px', // Fixed compact height
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
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            {!loading && selectedClassId && students.length === 0 && (
                <Typography variant="body1" color="text.secondary" align="center" sx={{ mt: 4 }}>
                    {t('exams.common.noStudentsFound')}
                </Typography>
            )}
        </Box>
    );
};

export default PrintingTab;
