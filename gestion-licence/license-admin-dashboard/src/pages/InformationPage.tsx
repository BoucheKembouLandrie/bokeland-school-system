import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Grid, Avatar, Alert } from '@mui/material';
import { Info, CloudUpload, Delete, CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

interface CurrentBroadcast {
    id: string;
    imageUrl: string;
}

const InformationPage = () => {
    const [currentBroadcast, setCurrentBroadcast] = useState<CurrentBroadcast | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [uploading, setUploading] = useState<boolean>(false);

    const fetchCurrentBroadcast = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/license/broadcast/current`);
            setCurrentBroadcast(res.data);
        } catch (err) {
            console.error('Failed to fetch current broadcast image', err);
        }
    };

    useEffect(() => {
        fetchCurrentBroadcast();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('');
        setSuccessMessage('');
        const file = e.target.files?.[0];
        if (!file) return;

        // Verify it is an image
        if (!file.type.startsWith('image/')) {
            setErrorMessage("Veuillez sélectionner un fichier image valide (PNG, JPG, etc.).");
            return;
        }

        // Validate image dimensions using JS Image object
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            if (img.width !== 888 || img.height !== 888) {
                setErrorMessage(`L'image doit faire exactement 888x888 pixels. Taille actuelle : ${img.width}x${img.height} px.`);
                setSelectedFile(null);
                setPreviewUrl('');
            } else {
                setSelectedFile(file);
                setPreviewUrl(img.src);
            }
        };
        img.onerror = () => {
            setErrorMessage("Erreur lors de la lecture du fichier image.");
        };
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setErrorMessage('');
        setSuccessMessage('');

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            await axios.post(`${API_URL}/api/admin/broadcast/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setSuccessMessage("L'image de diffusion a été importée et poussée vers tous les clients connectés avec succès !");
            setSelectedFile(null);
            setPreviewUrl('');
            fetchCurrentBroadcast();
        } catch (err: any) {
            console.error('Upload failed', err);
            setErrorMessage(err.response?.data?.error || "Une erreur est survenue lors de l'importation de l'image.");
        } finally {
            setUploading(false);
        }
    };

    const handleCancel = () => {
        setSelectedFile(null);
        setPreviewUrl('');
        setErrorMessage('');
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Info color="primary" /> Page d'Information (Diffusion Popup)
                </Typography>
            </Box>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                    {errorMessage}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} icon={<CheckCircle />}>
                    {successMessage}
                </Alert>
            )}

            <Grid container spacing={4}>
                {/* Image Upload card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ background: 'linear-gradient(135deg,#7C6EF1,#2DD4BF)', width: 44, height: 44 }}>
                                <CloudUpload sx={{ fontSize: 22 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Importer une nouvelle image</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Dimensions requises : exactement 888x888 pixels</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{
                                flex: 1, minHeight: 250, borderRadius: 3, border: '2px dashed rgba(255,255,255,0.1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                                bgcolor: 'rgba(255,255,255,0.01)', position: 'relative'
                            }}>
                                {previewUrl ? (
                                    <img
                                        src={previewUrl}
                                        alt="Preview 888x888"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: 240 }}
                                    />
                                ) : (
                                    <Box sx={{ textAlign: 'center', p: 3 }}>
                                        <CloudUpload sx={{ fontSize: 48, color: 'rgba(255,255,255,0.2)', mb: 1.5 }} />
                                        <Typography color="textSecondary" variant="body2">
                                            Glissez-déposez ou cliquez pour parcourir
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="broadcast-image-input"
                                type="file"
                                onChange={handleFileChange}
                            />

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <label htmlFor="broadcast-image-input" style={{ flex: 1 }}>
                                    <Button variant="outlined" component="span" fullWidth size="medium"
                                        sx={{ borderColor: 'rgba(124,110,241,0.4)', color: '#7C6EF1' }}>
                                        {selectedFile ? 'Changer l\'image' : 'Sélectionner une image'}
                                    </Button>
                                </label>

                                {selectedFile && (
                                    <>
                                        <Button
                                            variant="contained"
                                            onClick={handleUpload}
                                            disabled={uploading}
                                            sx={{ background: 'linear-gradient(135deg,#7C6EF1,#5B4FCC)', color: '#fff' }}
                                        >
                                            {uploading ? 'Importation...' : 'Diffuser'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={handleCancel}
                                            disabled={uploading}
                                            startIcon={<Delete />}
                                        >
                                            Annuler
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Current Broadcast Image Display */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 4, borderRadius: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                            <Avatar sx={{ background: 'linear-gradient(135deg,#34D399,#059669)', width: 44, height: 44 }}>
                                <Info sx={{ fontSize: 22 }} />
                            </Avatar>
                            <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>Image de diffusion active</Typography>
                                <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>Actuellement affichée sur les logiciels Bokeland</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.02)', borderRadius: 3, p: 2, minHeight: 250 }}>
                            {currentBroadcast ? (
                                <Box sx={{ textAlign: 'center', width: '100%' }}>
                                    <img
                                        src={`${API_URL}${currentBroadcast.imageUrl}`}
                                        alt="Current Broadcast"
                                        style={{ maxWidth: '100%', maxHeight: 240, objectFit: 'contain', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}
                                        onError={(e) => {
                                            // Handle case where image url can't be resolved or file deleted
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 2 }}>
                                        ID de diffusion : {currentBroadcast.id}
                                    </Typography>
                                </Box>
                            ) : (
                                <Typography color="textSecondary" variant="body1">
                                    Aucune image de diffusion active actuellement.
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InformationPage;
