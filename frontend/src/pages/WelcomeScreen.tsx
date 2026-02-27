import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    MenuItem,
    Grid,
    InputAdornment,
    Alert,
    useTheme,
    Paper,
    Grow,
    Fade,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { africanCountries } from '../data/africanCountries';
import api from '../services/api';
import { ArrowForward, ArrowBack, VerifiedUser, School, Language } from '@mui/icons-material';
import { useSettings } from '../contexts/SettingsContext';
import { useAuthContext } from '../App';
import { useLicense } from '../contexts/LicenseContext';

// Validation schema
const schema = z.object({
    language: z.enum(['fr', 'en']),
    school_name: z.string().min(1, 'validation.required'),
    school_year: z.string().regex(/^\d{4}-\d{4}$/, 'Format: YYYY-YYYY (ex: 2025-2026)'),
    email: z.string().email('validation.invalidEmail'),
    country_code: z.string().min(1, 'validation.required'),
    country: z.string().min(1, 'validation.required'),
    phone: z.string().min(1, 'validation.required'),
    address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

// Animated Blob Component
const AnimatedBlob = ({
    color,
    top,
    left,
    size,
    delay,
}: {
    color: string;
    top: string;
    left: string;
    size: string;
    delay: string;
}) => (
    <Box
        sx={{
            position: 'absolute',
            top,
            left,
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            filter: 'blur(80px)', // Increased blur for smoother effect
            opacity: 0.5,
            zIndex: 0,
            animation: `float 15s infinite ease-in-out ${delay}`, // Slower animation
            '@keyframes float': {
                '0%': { transform: 'translate(0, 0) scale(1)' },
                '33%': { transform: 'translate(40px, -60px) scale(1.1)' },
                '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
                '100%': { transform: 'translate(0, 0) scale(1)' },
            },
        }}
    />
);

const WelcomeScreen: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { refreshSettings } = useSettings();
    const { login } = useAuthContext();
    const { checkLicense } = useLicense();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            language: 'fr',
            school_year: '2025-2026',
            country_code: '+237',
            country: 'CM',
        },
    });

    const selectedLanguage = watch('language');
    const selectedCountry = watch('country');

    const handleLanguageChange = (lang: 'fr' | 'en') => {
        setValue('language', lang);
        i18n.changeLanguage(lang);
    };

    const handleCountryChange = (countryCode: string) => {
        const country = africanCountries.find((c) => c.code === countryCode);
        if (country) {
            setValue('country', countryCode);
            setValue('country_code', country.dialCode);
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const steps = [
        { label: t('welcome.language.title'), icon: <Language /> },
        { label: t('welcome.schoolInfo.title'), icon: <School /> },
        { label: t('welcome.confirmation.title'), icon: <VerifiedUser /> },
    ];

    const [canSubmit, setCanSubmit] = useState(false);

    // Prevent accidental double-submit by adding a delay before allowing confirmation
    React.useEffect(() => {
        if (activeStep === steps.length - 1) {
            setCanSubmit(false);
            const timer = setTimeout(() => setCanSubmit(true), 1000); // 1 second delay
            return () => clearTimeout(timer);
        }
    }, [activeStep, steps.length]);

    const onSubmit = async (data: FormData) => {
        // If not on the last step (Confirmation), treat submit as "Next"
        if (activeStep < steps.length - 1) {
            handleNext();
            return;
        }

        if (!canSubmit) return; // Ignore if delay hasn't passed

        setLoading(true);
        setError('');
        try {
            const response = await api.post('/onboarding/complete', {
                school_name: data.school_name,
                school_year: data.school_year,
                email: data.email,
                phone: data.phone,
                country_code: data.country_code,
                country: data.country,
                address: data.address || '',
                language: data.language,
            });
            console.log('Onboarding response:', response.data);

            // Auto-login logic
            if (response.data.token && response.data.user) {
                localStorage.setItem('token', response.data.token);
                login(response.data.user);
            }

            // Refresh settings context to update is_onboarding_complete
            await refreshSettings();

            // Force license check to ensure status is updated to TRIAL
            await checkLicense();

            // Redirect to dashboard after successful onboarding
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Onboarding error:', err);
            setError(err.response?.data?.message || 'An error occurred during onboarding');
        } finally {
            setLoading(false);
        }
    };



    const getCountryName = (code: string) => {
        const country = africanCountries.find((c) => c.code === code);
        return country ? (i18n.language === 'fr' ? country.nameFr : country.name) : '';
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                // Light background with custom gradient
                bgcolor: '#ffffff',
                background: 'linear-gradient(135deg, #888888 0%, #ffffff 100%)',
            }}
        >
            {/* Animated Background Elements covering the whole page */}
            <AnimatedBlob color="#ffffff" top="-10%" left="-10%" size="600px" delay="0s" />
            <AnimatedBlob color="#008888" top="40%" left="80%" size="500px" delay="5s" />
            <AnimatedBlob color="#007cf0" top="80%" left="20%" size="600px" delay="2s" />

            {/* Floating Glassmorphism Card */}
            <Fade in timeout={1000}>
                <Paper
                    elevation={24}
                    sx={{
                        position: 'relative',
                        zIndex: 10,
                        width: '100%',
                        maxWidth: 800,
                        bgcolor: 'rgba(255, 255, 255, 0.85)', // High transparency glass effect
                        backdropFilter: 'blur(20px)',
                        borderRadius: 4,
                        p: { xs: 3, md: 6 },
                        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                        border: '1px solid rgba(255, 255, 255, 0.18)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                    }}
                >
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 5 }}>
                        <img
                            src="/logo-bokeland-school-system.png"
                            alt="Bokeland School System"
                            style={{
                                maxWidth: '100%',
                                height: 'auto',
                                maxHeight: '150px',
                                marginBottom: '20px'
                            }}
                        />
                        {/* Stepper Indicator */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3 }}>
                            {steps.map((step, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '50%',
                                            bgcolor: activeStep >= index ? '#008888' : 'rgba(0,0,0,0.05)',
                                            color: activeStep >= index ? 'white' : 'grey.400',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            boxShadow: activeStep === index ? '0 0 0 4px rgba(48, 43, 99, 0.2)' : 'none',
                                        }}
                                    >
                                        {step.icon}
                                    </Box>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            {/* Step 1: Language */}
                            {activeStep === 0 && (
                                <Grow in>
                                    <Grid container spacing={3} justifyContent="center">
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 600 }}>
                                                {t('welcome.language.title')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 4,
                                                    border: '2px solid',
                                                    borderColor: selectedLanguage === 'fr' ? '#008888' : 'grey.200',
                                                    borderRadius: 3,
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    transition: 'all 0.2s',
                                                    bgcolor: selectedLanguage === 'fr' ? 'rgba(48, 43, 99, 0.05)' : 'transparent',
                                                    '&:hover': { borderColor: '#24243e', transform: 'translateY(-4px)' },
                                                }}
                                                onClick={() => handleLanguageChange('fr')}
                                            >
                                                <Typography variant="h2" sx={{ mb: 1 }}>🇫🇷</Typography>
                                                <Typography variant="h6" fontWeight="bold">Français</Typography>
                                            </Paper>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 5 }}>
                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    p: 4,
                                                    border: '2px solid',
                                                    borderColor: selectedLanguage === 'en' ? '#008888' : 'grey.200',
                                                    borderRadius: 3,
                                                    cursor: 'pointer',
                                                    textAlign: 'center',
                                                    transition: 'all 0.2s',
                                                    bgcolor: selectedLanguage === 'en' ? 'rgba(48, 43, 99, 0.05)' : 'transparent',
                                                    '&:hover': { borderColor: '#24243e', transform: 'translateY(-4px)' },
                                                }}
                                                onClick={() => handleLanguageChange('en')}
                                            >
                                                <Typography variant="h2" sx={{ mb: 1 }}>🇬🇧</Typography>
                                                <Typography variant="h6" fontWeight="bold">English</Typography>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grow>
                            )}

                            {/* Step 2: Form */}
                            {activeStep === 1 && (
                                <Grow in>
                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12 }}>
                                            <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 600 }}>
                                                {t('welcome.schoolInfo.title')}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <TextField
                                                fullWidth
                                                label={t('welcome.schoolInfo.schoolName')}
                                                {...register('school_name')}
                                                error={!!errors.school_name}
                                                helperText={errors.school_name && t(errors.school_name.message as string)}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Année Scolaire (ex: 2025-2026)"
                                                {...register('school_year')}
                                                error={!!errors.school_year}
                                                helperText={errors.school_year && (errors.school_year.message as string)}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label={t('welcome.schoolInfo.email')}
                                                type="email"
                                                {...register('email')}
                                                error={!!errors.email}
                                                helperText={errors.email && t(errors.email.message as string)}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                select
                                                label={t('welcome.schoolInfo.country')}
                                                value={selectedCountry}
                                                onChange={(e) => handleCountryChange(e.target.value)}
                                            >
                                                {africanCountries.map((country) => (
                                                    <MenuItem key={country.code} value={country.code}>
                                                        {country.flag} {i18n.language === 'fr' ? country.nameFr : country.name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label={t('welcome.schoolInfo.phone')}
                                                {...register('phone')}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">{watch('country_code')}</InputAdornment>
                                                    ),
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grow>
                            )}

                            {/* Step 3: Confirmation */}
                            {activeStep === 2 && (
                                <Grow in>
                                    <Box>
                                        <Typography variant="h5" align="center" sx={{ mb: 4, fontWeight: 600 }}>
                                            {t('welcome.confirmation.title')}
                                        </Typography>
                                        <Box sx={{ bgcolor: 'grey.50', p: 4, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
                                            <Grid container spacing={2}>
                                                {[
                                                    { label: t('welcome.confirmation.language'), value: selectedLanguage === 'fr' ? '🇫🇷 Français' : '🇬🇧 English' },
                                                    { label: t('welcome.confirmation.schoolName'), value: watch('school_name') },
                                                    { label: 'Année Scolaire', value: watch('school_year') },
                                                    { label: t('welcome.confirmation.email'), value: watch('email') },
                                                    { label: t('welcome.confirmation.country'), value: `${africanCountries.find(c => c.code === selectedCountry)?.flag} ${getCountryName(selectedCountry)}` },
                                                ].map((item, idx) => (
                                                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                                        <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                                            {item.label}
                                                        </Typography>
                                                        <Typography variant="body1" fontWeight="500">
                                                            {item.value}
                                                        </Typography>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Box>
                                    </Box>
                                </Grow>
                            )}
                        </Box>

                        {/* Actions */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                startIcon={<ArrowBack />}
                                type="button" // Prevent form submission
                                sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
                            >
                                {t('welcome.buttons.previous')}
                            </Button>

                            {activeStep < steps.length - 1 ? (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForward />}
                                    type="button" // Prevent form submission
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        background: 'linear-gradient(45deg, #008888 30%, #24243e 90%)',
                                    }}
                                >
                                    {t('welcome.buttons.next')}
                                </Button>
                            ) : (
                                <Button
                                    type="button" // Changed to button to prevent implicit form submission
                                    onClick={handleSubmit(onSubmit)} // Manually trigger submit
                                    variant="contained"
                                    disabled={loading || !canSubmit}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        bgcolor: canSubmit ? 'success.main' : 'grey.400',
                                        '&:hover': { bgcolor: canSubmit ? 'success.dark' : 'grey.500' },
                                    }}
                                >
                                    {loading ? t('common.loading') :
                                        !canSubmit ? 'Veuillez patienter...' : t('welcome.buttons.submit')}
                                </Button>
                            )}
                        </Box>
                    </form>
                </Paper>
            </Fade>
        </Box>
    );
};

export default WelcomeScreen;
