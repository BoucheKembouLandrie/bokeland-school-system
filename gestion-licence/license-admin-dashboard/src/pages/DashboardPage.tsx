import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import {
    Box, AppBar, Toolbar, Typography, Button, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
    Grid, Card, CardContent, Tabs, Tab, Avatar, Switch, FormControlLabel,
    CircularProgress, Alert
} from '@mui/material';
import {
    Edit, Delete, Logout, Group, CheckCircle, AccessTime, Cancel,
    Business, Phone, Email, LocationOn, CalendarToday, Shield, Groups,
    Download, SystemUpdateAlt, AdminPanelSettings, MonetizationOn, Handshake, Info,
    Send, Refresh
} from '@mui/icons-material';
import { Checkbox, ListItemText, OutlinedInput } from '@mui/material';
import axios from 'axios';
import { API_URL } from '../config';
import FinancesPage from './FinancesPage';
import PricingPage from './PricingPage';
import CommunautePageAdmin from './CommunautePageAdmin';
import UpdatePage from './UpdatePage';
import UsersPage from './UsersPage';
import AffiliatesPage from './AffiliatesPage';
import InformationPage from './InformationPage';
import { io, Socket } from 'socket.io-client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { COMMUNITY_SERVER } from '../config';
import { NotificationBellMenu, MeetingNotif } from '../components/Community/NotificationBellMenu';
import { OnlineMeetingRoom } from '../components/Community/OnlineMeetingRoom';

dayjs.extend(utc);

interface Client {
    id: number;
    machine_id: string;
    school_name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    country?: string;
    trial_start_date: string;
    subscription_end_date: string;
    status: 'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED';
    last_checkin?: string;
    community_banned?: boolean;
}

interface Stats {
    total: number;
    active: number;
    trial: number;
    expired: number;
}

interface DashboardPageProps {
    onLogout: () => void;
}

const StatusBadge = ({ status }: { status: string }) => {
    const configs: Record<string, { color: string; bg: string; dot: string; label: string }> = {
        ACTIVE: { color: '#34D399', bg: 'rgba(52,211,153,0.12)', dot: '#34D399', label: 'Actif' },
        TRIAL: { color: '#60A5FA', bg: 'rgba(96,165,250,0.12)', dot: '#60A5FA', label: 'Essai' },
        EXPIRED: { color: '#F87171', bg: 'rgba(248,113,113,0.12)', dot: '#F87171', label: 'Expiré' },
        BANNED: { color: '#94A3B8', bg: 'rgba(148,163,184,0.12)', dot: '#94A3B8', label: 'Banni' },
    };
    const c = configs[status] || configs.BANNED;
    return (
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.5, py: 0.5, borderRadius: 8, backgroundColor: c.bg }}>
            <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: c.dot, boxShadow: `0 0 6px ${c.dot}` }} />
            <Typography sx={{ color: c.color, fontSize: '0.78rem', fontWeight: 700 }}>{c.label}</Typography>
        </Box>
    );
};

const StatCard = ({ icon, label, value, gradient, glow }: { icon: React.ReactNode; label: string; value: number; gradient: string; glow: string }) => (
    <Card sx={{ position: 'relative', overflow: 'hidden', cursor: 'default' }}>
        <Box sx={{
            position: 'absolute', top: -20, right: -20, width: 90, height: 90,
            borderRadius: '50%', background: gradient, opacity: 0.15, filter: 'blur(20px)'
        }} />
        <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {label}
                </Typography>
                <Avatar sx={{ width: 38, height: 38, background: gradient, boxShadow: `0 4px 15px ${glow}` }}>
                    {icon}
                </Avatar>
            </Box>
            <Typography sx={{ fontSize: '2.2rem', fontWeight: 800, background: gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {value}
            </Typography>
        </CardContent>
    </Card>
);

const DashboardPage = ({ onLogout }: DashboardPageProps) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [clients, setClients] = useState<Client[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, trial: 0, expired: 0 });

    const [socket, setSocket] = useState<Socket | null>(null);
    const [notifications, setNotifications] = useState<MeetingNotif[]>([]);
    const [acceptedMeetings, setAcceptedMeetings] = useState<MeetingNotif[]>([]);
    const [activeMeeting, setActiveMeeting] = useState<MeetingNotif | null>(null);
    const [isMeetingRoomOpen, setIsMeetingRoomOpen] = useState(false);

    useEffect(() => {
        const s = io(COMMUNITY_SERVER, {
            auth: { adminToken: 'bokeland-admin-secret-2025' },
            transports: ['websocket', 'polling'],
        });

        s.on('meeting_notification_received', (notif: MeetingNotif) => {
            setNotifications((prev) => {
                if (prev.some((n) => n.meeting_id === notif.meeting_id)) return prev;
                return [...prev, notif];
            });
        });

        s.on('meeting_scheduled_success', (notif: MeetingNotif) => {
            setAcceptedMeetings((prev) => {
                if (prev.some((m) => m.meeting_id === notif.meeting_id)) return prev;
                return [...prev, notif];
            });
        });

        s.on('meeting_notifications_pending', (pendingList: MeetingNotif[]) => {
            setNotifications((prev) => {
                const combined = [...prev];
                pendingList.forEach((pn) => {
                    if (!combined.some((c) => c.meeting_id === pn.meeting_id)) {
                        combined.push(pn);
                    }
                });
                return combined;
            });
        });

        setSocket(s);
        return () => { s.disconnect(); };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const nowUtc = dayjs.utc();
            const dueMeeting = acceptedMeetings.find((m) => {
                const meetingUtc = dayjs.utc(m.scheduled_at_gmt);
                return Math.abs(nowUtc.diff(meetingUtc, 'minute')) <= 30;
            });
            setActiveMeeting(dueMeeting || null);
        }, 10000);
        return () => clearInterval(interval);
    }, [acceptedMeetings]);

    const handleAcceptNotification = (notif: MeetingNotif) => {
        setNotifications((prev) => prev.filter((n) => n.meeting_id !== notif.meeting_id));
        setAcceptedMeetings((prev) => [...prev, notif]);
    };

    const handleRejectNotification = (meetingId: string) => {
        setNotifications((prev) => prev.filter((n) => n.meeting_id !== meetingId));
    };

    const [editDialog, setEditDialog] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [newStatus, setNewStatus] = useState<'TRIAL' | 'ACTIVE' | 'EXPIRED' | 'BANNED' | ''>('');
    const [extensionDays, setExtensionDays] = useState('');
    const [communityBanned, setCommunityBanned] = useState<boolean>(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [sigFile, setSigFile] = useState<File | null>(null);

    // ── Search & Filter State ──
    const [searchClient, setSearchClient] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchEmail, setSearchEmail] = useState('');
    const [searchCountry, setSearchCountry] = useState('');
    const [searchPhone, setSearchPhone] = useState('');

    // ── Row Selection State ──
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // ── Message Dialog State ──
    const [messageDialogOpen, setMessageDialogOpen] = useState(false);
    const [senderName, setSenderName] = useState('Bokeland');
    const [senderEmail, setSenderEmail] = useState('admin@bokelandgroupservices.com');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [sendingStatus, setSendingStatus] = useState('');
    const [sendingReport, setSendingReport] = useState<{
        successCount: number;
        failCount: number;
        failures: { email: string; error: string }[];
    } | null>(null);

    const handleResetFilters = () => {
        setSearchClient('');
        setSearchStatus('');
        setSearchEmail('');
        setSearchCountry('');
        setSearchPhone('');
    };

    const filteredClients = clients.filter(c => {
        const matchClient = !searchClient || c.school_name.toLowerCase().includes(searchClient.toLowerCase());
        const matchStatus = !searchStatus || c.status === searchStatus;
        const matchEmail = !searchEmail || c.email.toLowerCase().includes(searchEmail.toLowerCase());
        const matchCountry = !searchCountry || (c.country && c.country.toLowerCase().includes(searchCountry.toLowerCase()));
        const matchPhone = !searchPhone || (c.phone && c.phone.includes(searchPhone));
        return matchClient && matchStatus && matchEmail && matchCountry && matchPhone;
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredClients.map(c => c.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleSendEmail = async () => {
        const selectedClients = clients.filter(c => selectedIds.includes(c.id));
        if (selectedClients.length === 0) return;

        setIsSending(true);
        setSendingStatus('Préparation de l\'envoi...');
        setSendingReport(null);

        try {
            setSendingStatus(`Envoi en cours à ${selectedClients.length} destinataire(s)...`);
            const payload = {
                fromName: senderName,
                fromEmail: senderEmail,
                clients: selectedClients.map(c => ({ email: c.email, school_name: c.school_name })),
                subject: emailSubject,
                message: emailBody
            };

            const response = await axios.post(`${API_URL}/api/admin/send-email`, payload);
            
            alert(response.data.message || "E-mails envoyés avec succès.");
            setMessageDialogOpen(false);
            setSelectedIds([]);
            setEmailSubject('');
            setEmailBody('');
        } catch (error: any) {
            console.error(error);
            const res = error.response;
            if (res && res.status === 207) {
                setSendingStatus('Terminé avec des avertissements.');
                setSendingReport({
                    successCount: res.data.successes?.length || 0,
                    failCount: res.data.failures?.length || 0,
                    failures: res.data.failures || []
                });
            } else {
                alert(`Erreur d'envoi: ${res?.data?.error || error.message}`);
                setIsSending(false);
            }
        } finally {
            if (!sendingReport) {
                setIsSending(false);
            }
        }
    };

    // ── Export fields state ──
    const ALL_EXPORT_FIELDS = [
        { key: 'school_name',           label: 'École' },
        { key: 'location',              label: 'Localisation' },
        { key: 'phone',                 label: 'Téléphone' },
        { key: 'email',                 label: 'Email' },
        { key: 'status',                label: 'Statut' },
        { key: 'subscription_end_date', label: 'Expiration' },
        { key: 'last_checkin',          label: 'Dernier Check-in' },
    ] as const;
    type ExportKey = typeof ALL_EXPORT_FIELDS[number]['key'];
    const [exportFields, setExportFields] = useState<ExportKey[]>(ALL_EXPORT_FIELDS.map(f => f.key));

    const handleExport = () => {
        if (exportFields.length === 0) return;
        const rows = filteredClients.map(c => {
            const location = [c.city, c.country].filter(Boolean).join(', ');
            const statusMap: Record<string, string> = { ACTIVE: 'Actif', TRIAL: 'Essai', EXPIRED: 'Expiré', BANNED: 'Banni' };
            const row: Record<string, string> = {};
            exportFields.forEach(key => {
                const fieldDef = ALL_EXPORT_FIELDS.find(f => f.key === key)!;
                if (key === 'location') row[fieldDef.label] = location || '—';
                else if (key === 'status') row[fieldDef.label] = statusMap[c.status] ?? c.status;
                else if (key === 'subscription_end_date') row[fieldDef.label] = c.subscription_end_date ? new Date(c.subscription_end_date).toLocaleDateString('fr-FR') : '—';
                else if (key === 'last_checkin') row[fieldDef.label] = c.last_checkin ? new Date(c.last_checkin).toLocaleString('fr-FR') : 'Jamais';
                else row[fieldDef.label] = (c as any)[key] ?? '—';
            });
            return row;
        });
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Abonnés');
        XLSX.writeFile(wb, `abonnes_${new Date().toISOString().slice(0,10)}.xlsx`);
    };

    const fetchData = async () => {
        try {
            const [clientsRes, statsRes] = await Promise.all([
                axios.get(`${API_URL}/api/admin/clients`),
                axios.get(`${API_URL}/api/admin/stats`),
                axios.get(`${API_URL}/api/admin/config`)
            ]);
            setClients(clientsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching data', error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleEdit = (client: Client) => {
        setSelectedClient(client);
        setNewStatus(client.status);
        setExtensionDays('');
        setCommunityBanned(!!client.community_banned);
        setEditDialog(true);
    };

    const handleSave = async () => {
        if (!selectedClient) return;
        try {
            const days = extensionDays ? parseInt(extensionDays) : 0;
            if (days > 0 && newStatus === 'TRIAL' && days > 33) { alert("Max 33 jours pour un essai."); return; }
            if (days > 0 && newStatus === 'ACTIVE' && days > 444) { alert("Max 444 jours pour un abonnement actif."); return; }
            const payload: any = { status: newStatus, community_banned: communityBanned };
            if (days > 0) payload.days = days;
            await axios.put(`${API_URL}/api/admin/clients/${selectedClient.id}`, payload);
            setEditDialog(false);
            fetchData();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.error || error.message}`);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Supprimer ce client ?')) return;
        try { await axios.delete(`${API_URL}/api/admin/clients/${id}`); fetchData(); }
        catch (error) { console.error('Error deleting client', error); }
    };

    const handleUpload = async (file: File, field: 'logo' | 'signature') => {
        const formData = new FormData();
        formData.append(field, file);
        try {
            await axios.post(`${API_URL}/api/admin/config/${field}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            alert(`${field === 'logo' ? 'Logo' : 'Signature'} mis à jour ✓`);
            fetchData();
        } catch { alert('Erreur lors du téléchargement'); }
    };

    const navGradient = 'linear-gradient(135deg, #1a1535 0%, #0e1320 100%)';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* ─── NAVBAR ─── */}
            <AppBar position="static" elevation={0} sx={{
                background: navGradient,
                borderBottom: '1px solid rgba(124,110,241,0.2)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}>
                <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: 'linear-gradient(135deg, #7C6EF1, #2DD4BF)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 15px rgba(124,110,241,0.4)'
                        }}>
                            <Shield sx={{ fontSize: 20, color: '#fff' }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.3px' }}>
                                License Admin
                            </Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1 }}>
                                Bokeland School System
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {activeMeeting && (
                            <Button
                                variant="contained"
                                onClick={() => setIsMeetingRoomOpen(true)}
                                sx={{
                                    bgcolor: '#ef4444',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    borderRadius: 3,
                                    animation: 'pulse 1.2s infinite',
                                    '@keyframes pulse': {
                                        '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                                        '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)' },
                                        '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                                    },
                                    '&:hover': { bgcolor: '#dc2626' },
                                }}
                            >
                                ❤️ Cliquer ici pour assister à la réunion ({activeMeeting.title})
                            </Button>
                        )}

                        <NotificationBellMenu
                            notifications={notifications}
                            onAccept={handleAcceptNotification}
                            onReject={handleRejectNotification}
                        />

                        <Button
                            onClick={onLogout}
                            startIcon={<Logout sx={{ fontSize: 16 }} />}
                            sx={{
                                color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem',
                                '&:hover': { color: '#F87171', background: 'rgba(248,113,113,0.1)' }
                            }}
                        >
                            Déconnexion
                        </Button>
                    </Box>
                </Toolbar>

                {/* Tabs */}
                <Tabs
                    value={currentTab}
                    onChange={(_, v) => setCurrentTab(v)}
                    sx={{
                        px: { xs: 2, md: 4 },
                        '& .MuiTabs-indicator': {
                            background: 'linear-gradient(90deg, #7C6EF1, #2DD4BF)',
                            height: 3, borderRadius: 2,
                        },
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.45)', minHeight: 48 },
                        '& .Mui-selected': { color: '#fff !important' },
                    }}
                >
                    <Tab icon={<Group sx={{ fontSize: 17 }} />} iconPosition="start" label="Clients" />
                    <Tab icon={<Shield sx={{ fontSize: 17 }} />} iconPosition="start" label="Finances" />
                    <Tab icon={<MonetizationOn sx={{ fontSize: 17 }} />} iconPosition="start" label="Tarification" />
                    <Tab icon={<Business sx={{ fontSize: 17 }} />} iconPosition="start" label="Configuration" />
                    <Tab icon={<Groups sx={{ fontSize: 17 }} />} iconPosition="start" label="Communauté" />
                    <Tab icon={<SystemUpdateAlt sx={{ fontSize: 17 }} />} iconPosition="start" label="Mise à jour" />
                    <Tab icon={<AdminPanelSettings sx={{ fontSize: 17 }} />} iconPosition="start" label="Administrateurs" />
                    <Tab icon={<Handshake sx={{ fontSize: 17 }} />} iconPosition="start" label="Partenaires" />
                    <Tab icon={<Info sx={{ fontSize: 17 }} />} iconPosition="start" label="Information" />
                </Tabs>
            </AppBar>

            {/* ─── TAB: CLIENTS ─── */}
            {currentTab === 0 && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    {/* Stat Cards */}
                    <Grid container spacing={2.5} sx={{ mb: 4 }}>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<Group sx={{ fontSize: 20, color: '#fff' }} />} label="Total Clients" value={stats.total} gradient="linear-gradient(135deg,#7C6EF1,#5B4FCC)" glow="rgba(124,110,241,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<CheckCircle sx={{ fontSize: 20, color: '#fff' }} />} label="Actifs" value={stats.active} gradient="linear-gradient(135deg,#34D399,#059669)" glow="rgba(52,211,153,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<AccessTime sx={{ fontSize: 20, color: '#fff' }} />} label="En Essai" value={stats.trial} gradient="linear-gradient(135deg,#60A5FA,#3B82F6)" glow="rgba(96,165,250,0.35)" />
                        </Grid>
                        <Grid size={{ xs: 6, md: 3 }}>
                            <StatCard icon={<Cancel sx={{ fontSize: 20, color: '#fff' }} />} label="Expirés" value={stats.expired} gradient="linear-gradient(135deg,#F87171,#DC2626)" glow="rgba(248,113,113,0.35)" />
                        </Grid>
                    </Grid>

                    {/* Table */}
                    <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        {/* ── Header + Export Bar ── */}
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                                {/* Left: title */}
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Clients enregistrés</Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                        {filteredClients.length} filtré{filteredClients.length > 1 ? 's' : ''} sur {clients.length} total
                                    </Typography>
                                </Box>

                                {/* Right: export bar */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                                    <FormControl size="small" sx={{ minWidth: 240 }}>
                                        <InputLabel sx={{ fontSize: '0.8rem' }}>Champs à exporter</InputLabel>
                                        <Select
                                            multiple
                                            value={exportFields}
                                            onChange={(e) => setExportFields(e.target.value as ExportKey[])}
                                            input={<OutlinedInput label="Champs à exporter" />}
                                            renderValue={(selected) =>
                                                (selected as ExportKey[])
                                                    .map(k => ALL_EXPORT_FIELDS.find(f => f.key === k)?.label ?? k)
                                                    .join(', ')
                                            }
                                            sx={{ fontSize: '0.8rem' }}
                                        >
                                            {ALL_EXPORT_FIELDS.map(field => (
                                                <MenuItem key={field.key} value={field.key} dense>
                                                    <Checkbox checked={exportFields.includes(field.key)} size="small" sx={{ py: 0 }} />
                                                    <ListItemText primary={field.label} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Download sx={{ fontSize: 16 }} />}
                                        onClick={handleExport}
                                        disabled={exportFields.length === 0 || clients.length === 0}
                                        sx={{
                                            background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)',
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            px: 2,
                                            py: 0.9,
                                            borderRadius: 2,
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 4px 14px rgba(124,110,241,0.4)',
                                            '&:hover': { opacity: 0.88 },
                                            '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
                                        }}
                                    >
                                        Exporter XLSX
                                    </Button>
                                </Box>
                            </Box>

                            {/* ── Filter & Action Row ── */}
                            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 2, alignItems: 'center' }}>
                                <TextField
                                    size="small"
                                    placeholder="Rechercher école..."
                                    value={searchClient}
                                    onChange={(e) => setSearchClient(e.target.value)}
                                    sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                    <InputLabel sx={{ fontSize: '0.85rem' }}>Statut</InputLabel>
                                    <Select
                                        value={searchStatus}
                                        label="Statut"
                                        onChange={(e) => setSearchStatus(e.target.value)}
                                        sx={{ borderRadius: 2, fontSize: '0.85rem' }}
                                    >
                                        <MenuItem value="">Tous les statuts</MenuItem>
                                        <MenuItem value="ACTIVE">Actif</MenuItem>
                                        <MenuItem value="TRIAL">Essai</MenuItem>
                                        <MenuItem value="EXPIRED">Expiré</MenuItem>
                                        <MenuItem value="BANNED">Banni</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    size="small"
                                    placeholder="Rechercher email..."
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    sx={{ minWidth: 150, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    size="small"
                                    placeholder="Rechercher pays..."
                                    value={searchCountry}
                                    onChange={(e) => setSearchCountry(e.target.value)}
                                    sx={{ minWidth: 120, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />
                                <TextField
                                    size="small"
                                    placeholder="Rechercher tél..."
                                    value={searchPhone}
                                    onChange={(e) => setSearchPhone(e.target.value)}
                                    sx={{ minWidth: 130, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                />

                                {/* Reset button */}
                                <IconButton 
                                    size="small" 
                                    onClick={handleResetFilters}
                                    title="Réinitialiser les filtres"
                                    sx={{ 
                                        bgcolor: 'rgba(255,255,255,0.04)', 
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } 
                                    }}
                                >
                                    <Refresh sx={{ fontSize: 18 }} />
                                </IconButton>

                                {/* Bulk Message Button */}
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={selectedIds.length === 0}
                                    onClick={() => {
                                        setSendingReport(null);
                                        setEmailSubject('');
                                        setEmailBody('');
                                        setMessageDialogOpen(true);
                                    }}
                                    sx={{
                                        ml: 'auto',
                                        background: 'linear-gradient(135deg,#7C6EF1,#9F1239)',
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        px: 2,
                                        py: 0.9,
                                        borderRadius: 2,
                                        boxShadow: '0 4px 14px rgba(124,110,241,0.2)',
                                        '&:hover': { opacity: 0.88 },
                                        '&:disabled': { opacity: 0.35, cursor: 'not-allowed' },
                                    }}
                                >
                                    Envoyer message ({selectedIds.length})
                                </Button>
                            </Box>
                        </Box>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ '& .MuiTableCell-head': { background: 'rgba(255,255,255,0.02)' } }}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                indeterminate={selectedIds.length > 0 && selectedIds.length < filteredClients.length}
                                                checked={filteredClients.length > 0 && selectedIds.length === filteredClients.length}
                                                onChange={handleSelectAll}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>École</TableCell>
                                        <TableCell>Localisation</TableCell>
                                        <TableCell>Téléphone</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Statut</TableCell>
                                        <TableCell>Expiration</TableCell>
                                        <TableCell>Dernier Check-in</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredClients.map((client) => {
                                        const location = [client.city, client.country].filter(Boolean).join(', ');
                                        const expDate = new Date(client.subscription_end_date);
                                        const now = new Date();
                                        const daysLeft = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                                        const isSelected = selectedIds.includes(client.id);
                                        return (
                                            <TableRow key={client.id} selected={isSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onChange={() => handleSelectOne(client.id)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{
                                                            width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700,
                                                            background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)'
                                                        }}>
                                                            {client.school_name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{client.school_name}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <LocationOn sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem', color: 'text.secondary' }}>{location || '—'}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem' }}>{client.phone || '—'}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.83rem', color: '#7C6EF1' }}>{client.email}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><StatusBadge status={client.status} /></TableCell>
                                                <TableCell>
                                                    <Box>
                                                        <Typography sx={{ fontSize: '0.83rem', fontWeight: 600 }}>{expDate.toLocaleDateString('fr-FR')}</Typography>
                                                        {client.status === 'ACTIVE' && daysLeft > 0 && (
                                                            <Typography sx={{ fontSize: '0.72rem', color: daysLeft < 30 ? '#FBBF24' : '#34D399' }}>
                                                                {daysLeft}j restants
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarToday sx={{ fontSize: 13, color: 'text.secondary' }} />
                                                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>
                                                            {client.last_checkin ? new Date(client.last_checkin).toLocaleString('fr-FR') : 'Jamais'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                                                        <IconButton size="small" onClick={() => handleEdit(client)} sx={{
                                                            bgcolor: 'rgba(124,110,241,0.12)', '&:hover': { bgcolor: 'rgba(124,110,241,0.25)' }
                                                        }}>
                                                            <Edit sx={{ fontSize: 16, color: '#7C6EF1' }} />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDelete(client.id)} sx={{
                                                            bgcolor: 'rgba(248,113,113,0.1)', '&:hover': { bgcolor: 'rgba(248,113,113,0.22)' }
                                                        }}>
                                                            <Delete sx={{ fontSize: 16, color: '#F87171' }} />
                                                        </IconButton>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                    {clients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                                                <Typography sx={{ color: 'text.secondary' }}>Aucun client enregistré</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>
            )}

            {/* ─── TAB: FINANCES ─── */}
            {currentTab === 1 && <FinancesPage />}

            {/* ─── TAB: TARIFICATION ─── */}
            {currentTab === 2 && <PricingPage />}

            {/* ─── TAB: CONFIGURATION ─── */}
            {currentTab === 3 && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Grid container spacing={3} alignItems="stretch">


                        {/* ── Col 1 : Logo ── */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3.5, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <Avatar sx={{ background: 'linear-gradient(135deg,#2DD4BF,#059669)', width: 42, height: 42 }}>
                                        <Business sx={{ fontSize: 20 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Logo de l'Entreprise</Typography>
                                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>PNG recommandé — Factures PDF</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <Box sx={{
                                        flex: 1, minHeight: 130, borderRadius: 3, border: '2px dashed rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                        bgcolor: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <img
                                            src={`${API_URL}/uploads/company_logo.png`}
                                            alt="Logo"
                                            style={{ maxHeight: 110, maxWidth: '90%', objectFit: 'contain' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </Box>
                                    <input accept="image/*" style={{ display: 'none' }} id="logo-input" type="file"
                                        onChange={(e) => { if (e.target.files?.[0]) setLogoFile(e.target.files[0]); }} />
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <label htmlFor="logo-input" style={{ flex: 1 }}>
                                            <Button variant="outlined" component="span" fullWidth startIcon={<Edit />} size="small"
                                                sx={{ borderColor: 'rgba(45,212,191,0.4)', color: '#2DD4BF' }}>
                                                {logoFile ? logoFile.name.slice(0, 14) + '…' : 'Choisir un fichier'}
                                            </Button>
                                        </label>
                                        {logoFile && (
                                            <Button variant="contained" size="small" onClick={() => handleUpload(logoFile, 'logo')}
                                                sx={{ background: 'linear-gradient(135deg,#2DD4BF,#059669)', color: '#fff', whiteSpace: 'nowrap' }}>
                                                Uploader
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                        {/* ── Col 2 : Signature ── */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Paper sx={{ p: 3.5, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <Avatar sx={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', width: 42, height: 42 }}>
                                        <Edit sx={{ fontSize: 20 }} />
                                    </Avatar>
                                    <Box>
                                        <Typography sx={{ fontWeight: 700, fontSize: '1.05rem' }}>Signature de l'Entreprise</Typography>
                                        <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>PNG transparent — Bas des reçus</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                                    <Box sx={{
                                        flex: 1, minHeight: 130, borderRadius: 3, border: '2px dashed rgba(255,255,255,0.1)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                        bgcolor: 'rgba(255,255,255,0.02)'
                                    }}>
                                        <img
                                            src={`${API_URL}/uploads/company_signature.png`}
                                            alt="Signature"
                                            style={{ maxHeight: 110, maxWidth: '90%', objectFit: 'contain' }}
                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                        />
                                    </Box>
                                    <input accept="image/*" style={{ display: 'none' }} id="sig-input" type="file"
                                        onChange={(e) => { if (e.target.files?.[0]) { setSigFile(e.target.files[0]); } }} />
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <label htmlFor="sig-input" style={{ flex: 1 }}>
                                            <Button variant="outlined" component="span" fullWidth startIcon={<Edit />} size="small"
                                                sx={{ borderColor: 'rgba(251,191,36,0.4)', color: '#FBBF24' }}>
                                                {sigFile ? sigFile.name.slice(0, 14) + '…' : 'Choisir un fichier'}
                                            </Button>
                                        </label>
                                        {sigFile && (
                                            <Button variant="contained" size="small" onClick={() => handleUpload(sigFile, 'signature')}
                                                sx={{ background: 'linear-gradient(135deg,#FBBF24,#D97706)', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                                                Uploader
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>

                    </Grid>
                </Box>
            )}

            {/* ─── TAB: COMMUNAUTÉ ─── */}
            {currentTab === 4 && (
                <Box sx={{ p: 0 }}>
                    <CommunautePageAdmin />
                </Box>
            )}

            {/* ─── TAB: MISE À JOUR ─── */}
            {currentTab === 5 && (
                <Box sx={{ p: 0 }}>
                    <UpdatePage />
                </Box>
            )}

            {/* ─── TAB: ADMINISTRATEURS ─── */}
            {currentTab === 6 && (
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <UsersPage />
                </Box>
            )}

            {/* ─── TAB: PARTENAIRES ─── */}
            {currentTab === 7 && (
                <Box sx={{ p: 0 }}>
                    <AffiliatesPage />
                </Box>
            )}

            {/* ─── TAB: INFORMATION ─── */}
            {currentTab === 8 && (
                <Box sx={{ p: 0 }}>
                    <InformationPage />
                </Box>
            )}

            {/* ─── EDIT DIALOG ─── */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', width: 40, height: 40, fontSize: '0.9rem', fontWeight: 700 }}>
                            {selectedClient?.school_name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem' }}>Modifier le client</Typography>
                            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary' }}>{selectedClient?.school_name}</Typography>
                        </Box>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Statut</InputLabel>
                            <Select value={newStatus} label="Statut" onChange={(e) => setNewStatus(e.target.value)}>
                                <MenuItem value="TRIAL">🔵 Essai (Trial)</MenuItem>
                                <MenuItem value="ACTIVE">🟢 Actif (Active)</MenuItem>
                                <MenuItem value="EXPIRED">🔴 Expiré (Expired)</MenuItem>
                            </Select>
                        </FormControl>

                        {(newStatus === 'TRIAL' || newStatus === 'ACTIVE') && (
                            <TextField
                                label={`Ajouter des jours — Max ${newStatus === 'TRIAL' ? '33' : '444'}`}
                                type="number"
                                value={extensionDays}
                                onChange={(e) => setExtensionDays(e.target.value)}
                                helperText={newStatus === 'ACTIVE' ? "Jours à partir d'aujourd'hui si le client est expiré" : 'Jours à partir d\'aujourd\'hui'}
                                inputProps={{ min: 1, max: newStatus === 'TRIAL' ? 33 : 444 }}
                            />
                        )}

                        <Box sx={{ mt: 1, p: 2, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2, border: '1px solid rgba(0,0,0,0.05)' }}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={!communityBanned} 
                                        onChange={(e) => setCommunityBanned(!e.target.checked)} 
                                        color={!communityBanned ? "success" : "error"}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>
                                        {!communityBanned ? '🟢 Accès au Chat Autorisé' : '🔴 Banni du Chat (Accès bloqué)'}
                                    </Typography>
                                }
                            />
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.5, ml: 4 }}>
                                Désactivez ceci pour empêcher l'établissement d'envoyer ou de voir les nouveaux messages sur la communauté.
                            </Typography>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
                    <Button onClick={() => setEditDialog(false)} sx={{ color: 'text.secondary' }}>Annuler</Button>
                    <Button onClick={handleSave} variant="contained" sx={{ px: 3 }}>Enregistrer</Button>
                </DialogActions>
            </Dialog>

            {/* ─── DIALOG: BULK EMAIL ─── */}
            <Dialog 
                open={messageDialogOpen} 
                onClose={isSending ? undefined : () => {
                    setMessageDialogOpen(false);
                    setSendingReport(null);
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: '#7C6EF1' }} />
                    Envoyer un e-mail aux clients ({selectedIds.length})
                </DialogTitle>
                <DialogContent dividers sx={{ py: 2 }}>
                    {sendingReport ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Alert severity={sendingReport.failCount === 0 ? "success" : "warning"}>
                                {sendingReport.failCount === 0 
                                    ? `Tous les e-mails (${sendingReport.successCount}) ont été envoyés avec succès.`
                                    : `Envoi partiel. ${sendingReport.successCount} réussis, ${sendingReport.failCount} échecs.`
                                }
                            </Alert>
                            {sendingReport.failures.length > 0 && (
                                <Box>
                                    <Typography sx={{ fontWeight: 600, fontSize: '0.88rem', mb: 1, color: '#f87171' }}>
                                        Détails des échecs d'envoi :
                                    </Typography>
                                    <Paper variant="outlined" sx={{ p: 1.5, maxHeight: 150, overflowY: 'auto', bgcolor: 'rgba(248,113,113,0.02)' }}>
                                        {sendingReport.failures.map((f, i) => (
                                            <Typography key={i} sx={{ fontSize: '0.78rem', color: '#f87171', mb: 0.5 }}>
                                                • <strong>{f.email}</strong> : {f.error}
                                            </Typography>
                                        ))}
                                    </Paper>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <Box>
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, mb: 0.8, color: 'text.secondary' }}>
                                    Destinataires ({selectedIds.length}) :
                                </Typography>
                                <Box sx={{ 
                                    display: 'flex', flexWrap: 'wrap', gap: 0.8, maxHeight: 80, 
                                    overflowY: 'auto', p: 1, border: '1px solid rgba(255,255,255,0.06)', 
                                    borderRadius: 2, bgcolor: 'rgba(255,255,255,0.01)'
                                }}>
                                    {clients.filter(c => selectedIds.includes(c.id)).map(c => (
                                        <Box key={c.id} sx={{ 
                                            px: 1, py: 0.4, borderRadius: 1.5, bgcolor: 'rgba(124,110,241,0.08)',
                                            border: '1px solid rgba(124,110,241,0.2)', display: 'flex', alignItems: 'center'
                                        }}>
                                            <Typography sx={{ fontSize: '0.72rem', color: '#7C6EF1', fontWeight: 600 }}>
                                                {c.school_name} ({c.email})
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <TextField
                                        label="Nom de l'expéditeur"
                                        fullWidth
                                        size="small"
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        disabled={isSending}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <TextField
                                        label="E-mail de réponse (Reply-to)"
                                        fullWidth
                                        size="small"
                                        value={senderEmail}
                                        onChange={(e) => setSenderEmail(e.target.value)}
                                        disabled={isSending}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                label="Sujet du message"
                                fullWidth
                                size="small"
                                placeholder="ex: Maintenance planifiée"
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                                disabled={isSending}
                            />

                            <TextField
                                label="Message"
                                fullWidth
                                multiline
                                minRows={5}
                                maxRows={10}
                                placeholder="Écrivez votre message ici..."
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                disabled={isSending}
                                helperText="Astuce : Vous pouvez insérer {{school_name}} pour le remplacer dynamiquement par le nom de l'établissement du destinataire."
                            />

                            {isSending && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                                    <CircularProgress size={20} sx={{ color: '#7C6EF1' }} />
                                    <Typography sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                                        {sendingStatus}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
                    {sendingReport ? (
                        <Button 
                            onClick={() => {
                                setSendingReport(null);
                                setMessageDialogOpen(false);
                            }} 
                            variant="contained"
                            sx={{ px: 3 }}
                        >
                            Fermer
                        </Button>
                    ) : (
                        <>
                            <Button 
                                onClick={() => setMessageDialogOpen(false)} 
                                sx={{ color: 'text.secondary' }}
                                disabled={isSending}
                            >
                                Annuler
                            </Button>
                            <Button 
                                onClick={handleSendEmail} 
                                variant="contained" 
                                disabled={isSending || !emailSubject.trim() || !emailBody.trim()}
                                startIcon={<Send sx={{ fontSize: 16 }} />}
                                sx={{ 
                                    px: 3,
                                    background: 'linear-gradient(135deg,#7C6EF1,#9F1239)',
                                    '&:hover': { opacity: 0.9 }
                                }}
                            >
                                Envoyer
                            </Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* Online Visio Meeting Room Dialog */}
            {activeMeeting && (
                <OnlineMeetingRoom
                    open={isMeetingRoomOpen}
                    onClose={() => setIsMeetingRoomOpen(false)}
                    socket={socket}
                    meetingId={activeMeeting.meeting_id}
                    meetingTitle={activeMeeting.title}
                    currentUserKey="admin"
                    currentUserName="👑 Admin Bokeland"
                    isHost={activeMeeting.initiator_key === 'admin'}
                />
            )}
        </Box>
    );
};

export default DashboardPage;
