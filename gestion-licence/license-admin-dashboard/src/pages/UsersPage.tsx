import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import { Add, Edit, Delete, Security } from '@mui/icons-material';
import axios from 'axios';
import { API_URL } from '../config';

interface AdminUser {
    id: number;
    username: string;
    email: string;
    is_default: boolean;
    createdAt: string;
}

const UsersPage = () => {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [open, setOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/admin/users`);
            setUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSave = async () => {
        try {
            if (editingUser) {
                const payload: any = { username: formData.username, email: formData.email };
                if (formData.password) payload.password = formData.password;
                await axios.put(`${API_URL}/api/admin/users/${editingUser.id}`, payload);
            } else {
                await axios.post(`${API_URL}/api/admin/users`, formData);
            }
            setOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erreur lors de la sauvegarde');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet administrateur ?')) return;
        try {
            await axios.delete(`${API_URL}/api/admin/users/${id}`);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erreur lors de la suppression');
        }
    };

    const openDialog = (user?: AdminUser) => {
        setEditingUser(user || null);
        setFormData(user ? { username: user.username, email: user.email, password: '' } : { username: '', email: '', password: '' });
        setOpen(true);
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Security color="primary" /> Administrateurs
                </Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => openDialog()}>
                    Nouvel Administrateur
                </Button>
            </Box>

            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                        <TableRow>
                            <TableCell>Nom d'utilisateur</TableCell>
                            <TableCell>Email / Contact</TableCell>
                            <TableCell>Statut</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {user.is_default ? (
                                        <Typography variant="caption" sx={{ bgcolor: 'rgba(124,110,241,0.1)', color: '#7C6EF1', px: 1, py: 0.5, borderRadius: 1, fontWeight: 'bold' }}>
                                            Admin par défaut
                                        </Typography>
                                    ) : (
                                        <Typography variant="caption" sx={{ bgcolor: '#f1f5f9', color: '#64748b', px: 1, py: 0.5, borderRadius: 1 }}>
                                            Administrateur
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => openDialog(user)}>
                                        <Edit fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" disabled={user.is_default} onClick={() => handleDelete(user.id)}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>{editingUser ? 'Modifier l\'administrateur' : 'Nouvel administrateur'}</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <TextField
                            label="Nom d'utilisateur"
                            fullWidth size="small"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            disabled={editingUser?.is_default}
                        />
                        <TextField
                            label="Email"
                            fullWidth size="small"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <TextField
                            label={editingUser ? 'Nouveau mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe'}
                            fullWidth size="small"
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="inherit">Annuler</Button>
                    <Button onClick={handleSave} variant="contained" disabled={!formData.username || !formData.email || (!editingUser && !formData.password)}>
                        Enregistrer
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default UsersPage;
