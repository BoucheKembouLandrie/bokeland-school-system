import React, { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';

const UpdateNotification: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'info' | 'success'>('info');

    useEffect(() => {
        if (window.electronAPI) {
            window.electronAPI.onUpdateAvailable((_event, info) => {
                setMessage(`Une mise à jour est disponible (v${info.version}). Téléchargement en cours...`);
                setSeverity('info');
                setOpen(true);
            });

            window.electronAPI.onUpdateDownloaded((_event, _info) => {
                setMessage('Mise à jour prête ! Elle sera installée au prochain démarrage.');
                setSeverity('success');
                setOpen(true);
            });
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default UpdateNotification;
