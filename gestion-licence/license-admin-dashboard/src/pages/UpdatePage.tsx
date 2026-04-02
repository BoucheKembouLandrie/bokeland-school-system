import { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Chip, Avatar
} from '@mui/material';
import { Upload, Publish } from '@mui/icons-material';
import { API_URL } from '../config';
import axios from 'axios';

interface Update {
    id: number;
    version: string;
    changelog: string;
    release_date: string;
    deliveries: UpdateDelivery[];
}

interface UpdateDelivery {
    id: number;
    status: 'PENDING' | 'DELIVERED' | 'INSTALLED';
    client: {
        id: number;
        school_name: string;
        email: string;
        status: string;
    };
    delivered_at: string | null;
    acknowledged_at: string | null;
}

const UpdatePage = () => {
    const [updates, setUpdates] = useState<Update[]>([]);
    const [version, setVersion] = useState('');
    const [changelog, setChangelog] = useState('');
    const [files, setFiles] = useState<FileList | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUpdates = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/updates`);
            setUpdates(res.data);
        } catch (error) {
            console.error('Error fetching updates', error);
        }
    };

    useEffect(() => {
        fetchUpdates();
        const interval = setInterval(fetchUpdates, 5000); // Poll every 5s for delivery status
        return () => clearInterval(interval);
    }, []);

    const handlePublish = async () => {
        if (!version || !changelog) {
            alert("Version et détails sont requis.");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('version', version);
            formData.append('changelog', changelog);
            
            const manifest = { migrations: [] };
            formData.append('manifest', JSON.stringify(manifest));

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    if (file.name.includes('frontend')) {
                        formData.append('frontendArchive', file);
                    } else if (file.name.includes('backend')) {
                        formData.append('backendArchive', file);
                    }
                }
            }

            await axios.post(`${API_URL}/api/admin/updates`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert('Mise à jour publiée avec succès !');
            setVersion('');
            setChangelog('');
            setFiles(null);
            fetchUpdates();
        } catch (error: any) {
            alert('Erreur: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const latestUpdate = updates[0];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ mb: 4 }}>
                <Typography sx={{ fontWeight: 800, fontSize: '1.6rem', letterSpacing: '-0.5px' }}>Déploiement des Mises à Jour</Typography>
                <Typography sx={{ color: 'text.secondary', fontSize: '0.88rem', mt: 0.5 }}>Publiez de nouvelles versions et suivez l'installation chez les clients</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* ── Left Column: Form ── */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '1.1rem', mb: 3 }}>Nouvelle Version</Typography>
                        
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                            <TextField
                                label="Version (ex: 1.2.0)"
                                size="small"
                                fullWidth
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                            />

                            <TextField
                                label="Notes de version (Changelog)"
                                multiline
                                rows={6}
                                size="small"
                                fullWidth
                                placeholder="- Nouveauté A...\n- Correction B..."
                                value={changelog}
                                onChange={(e) => setChangelog(e.target.value)}
                            />

                            <Box sx={{ p: 3, border: '2px dashed rgba(124,110,241,0.4)', borderRadius: 2, textAlign: 'center', bgcolor: 'rgba(124,110,241,0.03)' }}>
                                <Upload sx={{ fontSize: 32, color: '#7C6EF1', mb: 1 }} />
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, mb: 1 }}>Glissez frontend.zip et backend.zip ici</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 2 }}>Ou cliquez pour parcourir</Typography>
                                
                                <input
                                    type="file"
                                    multiple
                                    accept=".zip,.json"
                                    onChange={(e) => setFiles(e.target.files)}
                                    style={{ display: 'none' }}
                                    id="update-files"
                                />
                                <label htmlFor="update-files">
                                    <Button variant="outlined" component="span" size="small" sx={{ borderColor: '#7C6EF1', color: '#7C6EF1' }}>
                                        Choisir les fichiers
                                    </Button>
                                </label>
                                {files && files.length > 0 && (
                                    <Typography sx={{ mt: 1, fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                                        {files.length} fichier(s) sélectionné(s)
                                    </Typography>
                                )}
                            </Box>

                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<Publish />}
                                onClick={handlePublish}
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)',
                                    color: '#fff',
                                    fontWeight: 700,
                                    py: 1.2,
                                    boxShadow: '0 4px 14px rgba(124,110,241,0.35)',
                                    '&:hover': { opacity: 0.9 }
                                }}
                            >
                                {loading ? 'Publication...' : 'Publier la mise à jour'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* ── Right Column: Tracking Table ── */}
                <Grid size={{ xs: 12, md: 8 }}>
                    {latestUpdate ? (
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Suivi — Version {latestUpdate.version}</Typography>
                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Publiée le {new Date(latestUpdate.release_date).toLocaleString('fr-FR')}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Chip size="small" label={`${latestUpdate.deliveries.filter(d => d.status === 'INSTALLED').length} installés`} sx={{ bgcolor: 'rgba(52,211,153,0.15)', color: '#34D399', fontWeight: 600 }} />
                                    <Chip size="small" label={`${latestUpdate.deliveries.length} cibles`} sx={{ bgcolor: 'rgba(124,110,241,0.15)', color: '#7C6EF1', fontWeight: 600 }} />
                                </Box>
                            </Box>

                            <TableContainer sx={{ maxHeight: 600 }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow sx={{ '& .MuiTableCell-head': { background: 'rgba(15,17,23,0.95)' } }}>
                                            <TableCell>École</TableCell>
                                            <TableCell>Statut de livraison</TableCell>
                                            <TableCell>Heure de livraison</TableCell>
                                            <TableCell>Installation</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {latestUpdate.deliveries.map(delivery => (
                                            <TableRow key={delivery.id}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', fontWeight: 700, bgcolor: 'rgba(255,255,255,0.05)' }}>
                                                            {delivery.client.school_name.charAt(0)}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{delivery.client.school_name}</Typography>
                                                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{delivery.client.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    {delivery.status === 'PENDING' && <Chip size="small" label="En attente de connexion" sx={{ bgcolor: 'rgba(251,191,36,0.1)', color: '#FBBF24', fontSize: '0.7rem', fontWeight: 600 }} />}
                                                    {(delivery.status === 'DELIVERED' || delivery.status === 'INSTALLED') && <Chip size="small" label="Notifié / Reçu" sx={{ bgcolor: 'rgba(52,211,153,0.1)', color: '#34D399', fontSize: '0.7rem', fontWeight: 600 }} />}
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontSize: '0.8rem', color: delivery.delivered_at ? 'text.primary' : 'text.disabled' }}>
                                                        {delivery.delivered_at ? new Date(delivery.delivered_at).toLocaleString('fr-FR') : '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    {delivery.status === 'INSTALLED' ? (
                                                        <Chip size="small" label="Installé" sx={{ bgcolor: 'rgba(96,165,250,0.15)', color: '#60A5FA', fontSize: '0.7rem', fontWeight: 700 }} />
                                                    ) : (
                                                        <Typography sx={{ fontSize: '0.8rem', color: 'text.disabled', fontStyle: 'italic' }}>Non installé</Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    ) : (
                        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: 'rgba(255,255,255,0.02)' }}>
                            <Typography sx={{ color: 'text.secondary' }}>Aucune mise à jour publiée.</Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default UpdatePage;
