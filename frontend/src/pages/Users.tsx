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
    Chip,
} from '@mui/material';
import { Edit, Delete, Add, Visibility, VisibilityOff } from '@mui/icons-material';
import { InputAdornment } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../services/api';
import { useTranslation } from 'react-i18next';

const createSchema = (t: any) => z.object({
    username: z.string().min(3, t('users.validation.usernameRequired')),
    password: z.string().min(6, t('users.validation.passwordRequired')),
    email: z.string().email(t('users.validation.emailInvalid')).optional().or(z.literal('')),
    role: z.enum(['admin', 'secretary', 'teacher']),
    teacher_id: z.string().optional(),
    permissions: z.array(z.string()).optional(),
});

type FormData = z.infer<ReturnType<typeof createSchema>>;

interface User {
    id: number;
    username: string;
    email?: string;
    role: 'admin' | 'secretary' | 'teacher';
    is_default?: boolean;
    teacher_id?: number | null;
    permissions?: string[] | null;
}

const Users: React.FC = () => {
    const { t } = useTranslation();
    const schema = createSchema(t);
    const [users, setUsers] = useState<User[]>([]);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('teacher');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [isDefaultUser, setIsDefaultUser] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        // Note: You might need to implement a specific endpoint for listing users if not already done
        // For now, we'll assume there's one or simulate it
        // Since we didn't explicitly create a GET /users endpoint in the backend walkthrough, 
        // this might fail if not implemented. Let's assume it exists or handle gracefully.
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const [usersRes, teachersRes] = await Promise.all([
                api.get('/users'),
                api.get('/teachers')
            ]);
            setUsers(usersRes.data);
            setTeachers(teachersRes.data);
            setError('');
        } catch (err) {
            console.error('Error fetching users', err);
            setError(t('users.messages.loadError'));
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const payload: any = {
                username: data.username,
                password: data.password,
                email: data.email || null,
                role: data.role,
            };

            if (data.role === 'teacher') {
                payload.teacher_id = data.teacher_id;
            } else if (data.role === 'secretary') {
                payload.permissions = selectedPermissions;
            }

            if (editingId) {
                await api.put(`/users/${editingId}`, payload);
            } else {
                await api.post('/users', payload);
            }
            fetchUsers();
            handleClose();
            setError('');
        } catch (err: any) {
            console.error('Error saving user', err);
            setError(err.response?.data?.message || t('users.messages.saveError'));
        }
    };

    const handleEdit = (user: User) => {
        setEditingId(user.id);
        setSelectedRole(user.role);
        setSelectedPermissions(user.permissions || []);
        setIsDefaultUser(!!user.is_default);
        reset({
            username: user.username,
            email: user.email || '',
            role: user.role,
            password: '',
            teacher_id: user.teacher_id?.toString() || '',
        });
        setOpen(true);
    };

    const handleDelete = async (id: number) => {
        const user = users.find(u => u.id === id);
        if (user?.is_default) {
            alert(t('users.messages.cannotDeleteDefault'));
            return;
        }
        if (confirm(t('users.messages.deleteConfirm'))) {
            try {
                await api.delete(`/users/${id}`);
                fetchUsers();
                setError('');
            } catch (err: any) {
                console.error('Error deleting user', err);
                setError(err.response?.data?.message || t('users.messages.deleteError'));
            }
        }
    };

    const handleClose = () => {
        setOpen(false);
        setEditingId(null);
        setSelectedRole('teacher');
        setSelectedPermissions([]);
        setIsDefaultUser(false);
        reset();
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'error';
            case 'secretary': return 'primary';
            case 'teacher': return 'success';
            default: return 'default';
        }
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                    sx={{ backgroundColor: '#8e24aa', '&:hover': { backgroundColor: '#6a1b9a' } }}
                >
                    {t('users.actions.newUser')}
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} sx={{ maxHeight: 586 }}>
                <Table size="small" stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('users.fields.username')}</TableCell>
                            <TableCell>{t('users.fields.email')}</TableCell>
                            <TableCell>{t('users.fields.role')}</TableCell>
                            <TableCell>{t('users.fields.actions')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f6edf8' } }}>
                                <TableCell>
                                    {user.username}
                                    {user.is_default && <Chip label={t('users.labels.default')} size="small" color="warning" sx={{ ml: 1 }} />}
                                </TableCell>
                                <TableCell>{user.email || '-'}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={t(`users.roles.${user.role}`)}
                                        color={getRoleColor(user.role) as any}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => handleEdit(user)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDelete(user.id)}
                                        color="error"
                                        disabled={user.is_default}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{editingId ? t('users.titles.edit') : t('users.titles.add')}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label={t('users.fields.username')}
                            {...register('username')}
                            error={!!errors.username}
                            helperText={isDefaultUser ? 'Non modifiable pour le compte par défaut' : errors.username?.message}
                            fullWidth
                            disabled={isDefaultUser}
                            sx={isDefaultUser ? { backgroundColor: '#f5f5f5' } : {}}
                        />
                        <TextField
                            label={t('users.fields.password')}
                            type={showPassword ? 'text' : 'password'}
                            {...register('password')}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                            fullWidth
                            placeholder={editingId ? t('users.fields.passwordPlaceholder') : ""}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setShowPassword(prev => !prev)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                        <TextField
                            label={`${t('users.fields.email')} (${t('common.optional', 'optionnel')})`}
                            type="email"
                            {...register('email')}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            fullWidth
                            placeholder={t('users.fields.emailPlaceholder')}
                        />
                        <TextField
                            select
                            label={t('users.fields.role')}
                            {...register('role')}
                            error={!!errors.role}
                            helperText={errors.role?.message}
                            fullWidth
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={isDefaultUser}
                            sx={isDefaultUser ? { backgroundColor: '#f5f5f5' } : {}}
                        >
                            <MenuItem value="admin">{t('users.roles.admin')}</MenuItem>
                            <MenuItem value="secretary">{t('users.roles.secretary')}</MenuItem>
                            <MenuItem value="teacher">{t('users.roles.teacher')}</MenuItem>
                        </TextField>

                        {!isDefaultUser && selectedRole === 'teacher' && (
                            <TextField
                                select
                                label={t('users.fields.teacher')}
                                {...register('teacher_id')}
                                fullWidth
                                defaultValue=""
                            >
                                <MenuItem value="">{t('users.fields.selectTeacher')}</MenuItem>
                                {teachers.map((teacher) => (
                                    <MenuItem key={teacher.id} value={teacher.id.toString()}>
                                        {teacher.nom} {teacher.prenom}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {!isDefaultUser && selectedRole === 'secretary' && (
                            <Box>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('users.fields.permissions')}</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {['eleves', 'classes', 'enseignants', 'matieres', 'notes', 'paiements', 'presences', 'parametres'].map((perm) => (
                                        <Chip
                                            key={perm}
                                            label={t(`users.permissions.${perm}`)}
                                            onClick={() => {
                                                setSelectedPermissions(prev =>
                                                    prev.includes(perm)
                                                        ? prev.filter(p => p !== perm)
                                                        : [...prev, perm]
                                                );
                                            }}
                                            color={selectedPermissions.includes(perm) ? 'primary' : 'default'}
                                            variant={selectedPermissions.includes(perm) ? 'filled' : 'outlined'}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{t('users.actions.cancel')}</Button>
                    <Button onClick={handleSubmit(onSubmit)} variant="contained">
                        {editingId ? t('users.actions.edit') : t('users.actions.create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
};

export default Users;
