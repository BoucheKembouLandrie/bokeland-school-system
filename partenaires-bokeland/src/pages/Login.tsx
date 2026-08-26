import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { affiliateApi } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, KeyRound, Loader2, Phone, CheckCircle2 } from 'lucide-react';

type AuthStep = 'EMAIL' | 'OTP' | 'SETUP' | 'PASSWORD';

const CURRENCIES = [
    { code: 'XAF', label: 'XAF — Franc CFA (CEMAC) · CM, GA, CG, CF, TD, GQ' },
    { code: 'XOF', label: 'XOF — Franc CFA (UEMOA) · SN, CI, ML, BF, BJ, TG, NE, GW' },
    { code: 'GNF', label: 'GNF — Franc Guinéen · GN' },
    { code: 'CDF', label: 'CDF — Franc Congolais · CD' },
    { code: 'BIF', label: 'BIF — Franc Burundais · BI' },
    { code: 'KMF', label: 'KMF — Franc Comorien · KM' },
    { code: 'DJF', label: 'DJF — Franc Djibouti · DJ' },
    { code: 'SCR', label: 'SCR — Roupie Seychelloise · SC' },
];

const Login = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<AuthStep>('EMAIL');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Form state
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [setupToken, setSetupToken] = useState('');
    const [currency, setCurrency] = useState(''); // No default — partner MUST choose

    const handleError = (err: any) => {
        setError(err.response?.data?.error || 'Une erreur est survenue.');
    };

    const requestOtp = async () => {
        if (!email) {
            setError('Veuillez entrer votre email');
            return;
        }
        setError('');
        setLoading(true);
        try {
            await affiliateApi.requestOtp(email);
            setStep('OTP');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await affiliateApi.verifyOtp(email, otp);
            setSetupToken(res.data.setupToken);
            setStep('SETUP');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const setupAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!currency) {
            setError('Veuillez sélectionner une devise pour votre compte.');
            return;
        }
        setLoading(true);
        try {
            await affiliateApi.setupAccount(setupToken, password, phone, currency);
            // Now log them in directly
            const loginRes = await affiliateApi.login(email, password);
            localStorage.setItem('affiliateToken', loginRes.data.token);
            navigate('/dashboard');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await affiliateApi.login(email, password);
            localStorage.setItem('affiliateToken', res.data.token);
            navigate('/dashboard');
        } catch (err) {
            handleError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
            {/* Background design - Glowing Blobs from Logo Colors */}
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary-600/10 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent-500/5 blur-[130px] rounded-full pointer-events-none"></div>
            <div className="absolute top-[30%] right-[20%] w-[40%] h-[40%] bg-rose-500/5 blur-[120px] rounded-full pointer-events-none"></div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card-dark p-8 sm:p-10 shadow-2xl border border-white/5 relative overflow-hidden">
                    {/* Inner top glow */}
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/30 to-transparent"></div>
                    
                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-4 group">
                            <div className="absolute inset-0 bg-primary-500/25 blur-xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-500"></div>
                            <img 
                                src="/default-logo.png" 
                                alt="Bokeland Logo" 
                                className="w-20 h-20 mx-auto object-contain relative z-10 filter drop-shadow-[0_4px_12px_rgba(14,165,233,0.3)] transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="mb-1">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">Espace Affiliation</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-white">Bokeland Partenaires</h1>
                        <p className="text-slate-400 text-sm mt-1">Gérez vos revenus d'affiliation en toute simplicité</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-sm mb-6 flex items-start gap-2.5 animate-in fade-in duration-300">
                            <span className="shrink-0 mt-0.5 text-base">⚠️</span>
                            <p className="leading-relaxed">{error}</p>
                        </div>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 'EMAIL' && (
                            <motion.div 
                                key="email" 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Adresse Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-primary-400" />
                                            <input 
                                                type="email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all placeholder:text-slate-500"
                                                placeholder="votre@email.com"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-2 gap-3 flex flex-col">
                                        <button 
                                            onClick={() => setStep('PASSWORD')}
                                            disabled={!email}
                                            className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-medium rounded-xl shadow-lg shadow-primary-500/10 transform transition-all active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            Se connecter
                                        </button>
                                        <div className="relative flex items-center py-2">
                                            <div className="flex-grow border-t border-slate-800/80"></div>
                                            <span className="flex-shrink-0 mx-4 text-slate-500 text-xs uppercase tracking-wider font-semibold">ou</span>
                                            <div className="flex-grow border-t border-slate-800/80"></div>
                                        </div>
                                        <button 
                                            onClick={requestOtp}
                                            disabled={!email || loading}
                                            className="w-full bg-slate-900/60 hover:bg-slate-850 text-white py-3 rounded-xl font-medium transition-all border border-slate-800 flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin text-primary-400" /> : 'Réclamer mon compte'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'PASSWORD' && (
                            <motion.form 
                                key="password" 
                                onSubmit={loginUser} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-400 mb-4 flex items-center justify-between">
                                        <span>Connexion pour <strong className="text-slate-200">{email}</strong></span>
                                        <button type="button" onClick={() => setStep('EMAIL')} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Modifier</button>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Mot de passe</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={!password || loading}
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 rounded-xl font-medium transition-all flex justify-center items-center gap-2 mt-4 shadow-lg shadow-primary-500/10 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Connexion'}
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 'OTP' && (
                            <motion.form 
                                key="otp" 
                                onSubmit={verifyOtp} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <div className="text-sm text-slate-400 mb-4 leading-relaxed">
                                        Un code à 6 chiffres a été envoyé à l'adresse <strong className="text-slate-200">{email}</strong>.
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Code de vérification</label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input 
                                                type="text" 
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500/30 text-center tracking-[0.5em] font-bold text-lg outline-none transition-all placeholder:tracking-normal placeholder:font-normal"
                                                placeholder="000000"
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        type="submit"
                                        disabled={otp.length < 6 || loading}
                                        className="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white py-3 rounded-xl font-medium transition-all flex justify-center items-center gap-2 mt-4 shadow-lg shadow-primary-500/10 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Vérifier le code'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setStep('EMAIL')} 
                                        className="w-full text-sm text-slate-400 hover:text-white mt-4 transition-colors font-medium"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </motion.form>
                        )}

                        {step === 'SETUP' && (
                            <motion.form 
                                key="setup" 
                                onSubmit={setupAccount} 
                                initial={{ opacity: 0, x: -10 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2.5 text-primary-400 mb-6 bg-primary-500/5 border border-primary-500/20 p-3 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                                        <span className="text-sm font-medium">Email vérifié avec succès</span>
                                    </div>
                                    <p className="text-sm text-slate-350 leading-relaxed mb-4">Finalisez la création de votre compte pour commencer à suivre et retirer vos gains d'affiliation.</p>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Numéro de téléphone (Mobile Money)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input 
                                                type="tel" 
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
                                                placeholder="+237 600 000 000"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Créer un mot de passe de connexion</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                            <input 
                                                type="password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary-500/30 outline-none transition-all"
                                                placeholder="••••••••"
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Devise de votre compte</label>
                                        <select
                                            id="currency-select"
                                            value={currency}
                                            onChange={(e) => setCurrency(e.target.value)}
                                            required
                                            className="w-full bg-slate-900/60 border border-slate-800 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>— Sélectionnez votre devise —</option>
                                            {CURRENCIES.map(c => (
                                                <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                                                    {c.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="mt-2.5 flex items-start gap-2 bg-amber-500/10 border border-amber-500/25 rounded-xl p-3">
                                            <span className="text-amber-400 shrink-0 text-base mt-0.5">⚠️</span>
                                            <p className="text-amber-300/90 text-xs leading-relaxed">
                                                Uniquement les écoles liées à vous et qui utilisent cette devise pourront s'afficher dans votre compte et vous générer des commissions. Ce choix est <strong>définitif</strong>.
                                            </p>
                                        </div>
                                    </div>
 
                                    <button 
                                        type="submit"
                                        disabled={!password || !phone || !currency || loading}
                                        className="w-full bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white py-3 rounded-xl font-medium transition-all flex justify-center items-center gap-2 mt-6 shadow-lg shadow-accent-500/10 active:scale-[0.98]"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Terminer l\'inscription'}
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
