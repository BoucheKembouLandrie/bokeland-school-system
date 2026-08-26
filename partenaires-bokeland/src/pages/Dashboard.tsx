import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { affiliateApi } from '../services/api';
import { motion } from 'framer-motion';
import { 
    LogOut, 
    Wallet, 
    Users, 
    History, 
    ArrowUpRight, 
    Download,
    Loader2
} from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [message, setMessage] = useState('');
    const [showWithdraw, setShowWithdraw] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await affiliateApi.getDashboard();
            setData(res.data);
        } catch (err: any) {
            if (err.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('affiliateToken');
        navigate('/login');
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        const amount = Number(withdrawAmount);
        if (amount < 5000) {
            setMessage(`⚠️ Le montant minimum est de 5 000 ${data?.currency || 'devise non définie'}`);
            return;
        }
        if (amount > data.balance) {
            setMessage('⚠️ Solde insuffisant');
            return;
        }

        setWithdrawLoading(true);
        try {
            await affiliateApi.requestWithdrawal(amount);
            setMessage('✅ Demande envoyée avec succès.');
            setShowWithdraw(false);
            setWithdrawAmount('');
            fetchDashboard(); // refresh balance
        } catch (err: any) {
            setMessage(`⚠️ ${err.response?.data?.error || 'Erreur lors de la demande'}`);
        } finally {
            setWithdrawLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary-500/20 blur-lg rounded-full scale-125 animate-pulse"></div>
                    <img src="/default-logo.png" alt="Loading" className="w-16 h-16 object-contain relative z-10 animate-bounce" />
                </div>
                <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* Top Navigation */}
            <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center gap-3">
                            <img src="/default-logo.png" alt="Logo" className="w-9 h-9 object-contain filter drop-shadow-sm" />
                            <span className="font-bold text-slate-900 hidden sm:inline-block tracking-tight text-lg">
                                Bokeland <span className="text-primary-600 font-semibold">Partenaires</span>
                            </span>
                        </div>
                        <div className="flex items-center">
                            <button 
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-slate-500 hover:text-rose-500 transition-colors px-3 py-2 rounded-xl hover:bg-rose-50 font-medium"
                            >
                                <LogOut className="w-5 h-5 text-rose-500" />
                                <span className="hidden sm:block">Déconnexion</span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
                    <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-primary-600">Vue d'ensemble</span>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Espace Partenaire</h1>
                    </div>
                    <button 
                        onClick={() => setShowWithdraw(!showWithdraw)}
                        className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-primary-600/10 hover:shadow-primary-600/20 active:scale-[0.98] flex items-center gap-2 justify-center"
                    >
                        <Download className="w-4 h-4" />
                        Retirer mes gains
                    </button>
                </div>

                {message && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2.5 border animate-in fade-in slide-in-from-top-4 ${
                        message.includes('⚠️') ? 'bg-accent-500/5 border-accent-500/20 text-accent-700' :
                        message.includes('✅') ? 'bg-primary-500/5 border-primary-500/20 text-primary-700' :
                        'bg-slate-900 text-white border-transparent'
                    }`}>
                        <span>{message}</span>
                    </div>
                )}

                {!data?.currency && (
                    <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 p-5 rounded-2xl text-sm flex items-start gap-3.5 animate-in fade-in duration-300">
                        <span className="shrink-0 text-xl">⚠️</span>
                        <div>
                            <p className="font-extrabold text-amber-900">Aucune devise n'est configurée pour ce compte partenaire.</p>
                            <p className="text-amber-850 mt-1 font-medium leading-relaxed">
                                Veuillez réclamer ou configurer votre compte via le processus de configuration pour définir votre devise de retrait définitive. Aucun parrainage ou commission ne pourra être affiché ou crédité tant que votre devise n'est pas définie dans le serveur de licences.
                            </p>
                        </div>
                    </div>
                )}

                {/* Withdraw Form Panel (Collapsible) */}
                {showWithdraw && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200/80 overflow-hidden"
                    >
                        <form onSubmit={handleWithdraw} className="p-6 sm:p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Demander un retrait</h3>
                            <p className="text-slate-500 text-sm mb-6">Le montant sera envoyé sur votre numéro de téléphone (Mobile Money) enregistré dans les 48h.</p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full sm:flex-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Montant ({data?.currency || 'Devise non définie'})</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(e.target.value)}
                                            className="w-full border border-slate-200 bg-slate-50/50 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                                            placeholder="Ex: 10000"
                                            min="5000"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">{data?.currency || 'devise non définie'}</span>
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={withdrawLoading || !withdrawAmount}
                                    className="w-full sm:w-auto bg-gradient-to-r from-accent-600 to-accent-500 hover:from-accent-500 hover:to-accent-600 text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md shadow-accent-500/10 active:scale-[0.98]"
                                >
                                    {withdrawLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmer'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 shadow-xl shadow-primary-500/10 text-white relative overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <Wallet className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-primary-100 font-semibold tracking-wide">Solde Disponible</h2>
                        </div>
                        <div className="relative z-10 flex items-baseline">
                            <span className="text-4xl font-extrabold tracking-tight">{Number(data?.balance || 0).toLocaleString()}</span>
                            <span className="text-primary-200 ml-2 font-semibold text-lg">{data?.currency || 'Non définie'}</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-100 border border-slate-200/80 transition-transform duration-300 hover:scale-[1.01] hover:border-accent-500/10">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-accent-500/10 rounded-xl text-accent-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-slate-500 font-semibold tracking-wide">Écoles Parrainées</h2>
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-4xl font-extrabold text-slate-900 tracking-tight">{data?.clients?.length || 0}</span>
                            <span className="text-slate-400 ml-2 font-semibold text-lg">écoles actives</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
                    {/* Clients List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary-600" />
                            Mes Écoles Parrainées
                        </h2>
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200/80 overflow-hidden">
                            {data?.clients?.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {data.clients.map((client: any) => (
                                        <li key={client.id} className="p-5 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                                            <div>
                                                <p className="font-bold text-slate-800 text-base">{client.school_name}</p>
                                                <p className="text-sm text-slate-400 mt-0.5">{client.city || 'Ville non spécifiée'}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                                                    client.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' : 
                                                    client.status === 'TRIAL' ? 'bg-accent-50 text-accent-600 border-accent-200/50' : 
                                                    'bg-rose-50 text-rose-600 border-rose-200/50'
                                                }`}>
                                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                                    {client.status}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-10 text-center text-slate-400 font-medium">
                                    Aucune école parrainée pour le moment.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Commissions History */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <History className="w-5 h-5 text-primary-600" />
                            Historique des Gains
                        </h2>
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-200/80 overflow-hidden">
                            {data?.commissions?.length > 0 ? (
                                <ul className="divide-y divide-slate-100">
                                    {data.commissions.map((comm: any) => (
                                        <li key={comm.id} className="p-4 flex gap-4 hover:bg-slate-50/30 transition-colors">
                                            <div className="mt-1">
                                                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                                                    <ArrowUpRight className="w-4 h-4 text-primary-600" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-slate-900 truncate">
                                                    +{Number(comm.amount).toLocaleString()} {data?.currency || ''}
                                                </p>
                                                <p className="text-xs font-semibold text-slate-400 truncate mt-0.5">
                                                    {comm.client?.school_name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium mt-1">
                                                    {new Date(comm.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-10 text-center text-slate-400 font-medium">
                                    Aucune commission pour le moment.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default Dashboard;
