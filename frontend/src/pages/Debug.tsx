import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Button, Alert, CircularProgress } from '@mui/material';
import api from '../services/api';

const Debug: React.FC = () => {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [counts, setCounts] = useState<any>({});

    const checkSystem = async () => {
        setLoading(true);
        setError(null);
        setCounts({});
        try {
            // Check License/Server Status
            const licenseRes = await api.get('/license/status');
            setStatus(licenseRes.data);

            // Check Data Counts
            const studentsRes = await api.get('/students');
            const classesRes = await api.get('/classes');
            const teachersRes = await api.get('/teachers');

            setCounts({
                students: studentsRes.data.length,
                classes: classesRes.data.length,
                teachers: teachersRes.data.length
            });

        } catch (err: any) {
            console.error(err);
            setError(err.message + (err.response ? ` - ${err.response.status}` : ''));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkSystem();
    }, []);

    const localYear = localStorage.getItem('currentSchoolYear');

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>System Diagnostic</Typography>

            <Button variant="contained" onClick={checkSystem} sx={{ mb: 2 }}>
                Refresh Diagnostics
            </Button>

            {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    System Error: {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Frontend State</Typography>
                        <pre>{JSON.stringify({
                            apiBaseURL: api.defaults.baseURL,
                            currentSchoolYear: localYear ? JSON.parse(localYear) : 'Missing',
                            tokenPresent: !!localStorage.getItem('token')
                        }, null, 2)}</pre>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Backend Status (Port 5006)</Typography>
                        {status ? (
                            <pre>{JSON.stringify(status, null, 2)}</pre>
                        ) : (
                            <Typography color="textSecondary">Waiting for check...</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid size={12}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Data Accessibility Check</Typography>
                        <Grid container>
                            <Grid size={4}>
                                <Typography>Students: <b>{counts.students !== undefined ? counts.students : '...'}</b></Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>Classes: <b>{counts.classes !== undefined ? counts.classes : '...'}</b></Typography>
                            </Grid>
                            <Grid size={4}>
                                <Typography>Teachers: <b>{counts.teachers !== undefined ? counts.teachers : '...'}</b></Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Debug;
