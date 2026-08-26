"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailsToClients = exports.createAffiliate = exports.updateAffiliate = exports.getAllAffiliates = exports.forgotPassword = exports.deleteAdmin = exports.updateAdmin = exports.createAdmin = exports.getAllAdmins = exports.deleteAllPayments = exports.uploadSignature = exports.uploadLogo = exports.updateConfig = exports.getConfig = exports.deleteClient = exports.communityBan = exports.updateClientStatus = exports.getClientStats = exports.getAllClients = exports.adminLogin = void 0;
const Payment_1 = require("../models/Payment");
const Client_1 = require("../models/Client");
const Config_1 = require("../models/Config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const emailService_1 = require("../services/emailService");
// Uses AdminUser model for authentication
const bcrypt_1 = __importDefault(require("bcrypt"));
const AdminUser_1 = require("../models/AdminUser");
// In production, you would generate a real JWT using jsonwebtoken
// For now, we will return a simple token based on the user's ID
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield AdminUser_1.AdminUser.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
        }
        const match = yield bcrypt_1.default.compare(password, user.password_hash);
        if (match) {
            res.json({ success: true, token: 'admin-token-placeholder', userId: user.id });
        }
        else {
            res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
        }
    }
    catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.adminLogin = adminLogin;
const getAllClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield Client_1.Client.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(clients);
    }
    catch (error) {
        console.error('Error fetching clients', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getAllClients = getAllClients;
const getClientStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalClients = yield Client_1.Client.count();
        const activeClients = yield Client_1.Client.count({ where: { status: 'ACTIVE' } });
        const trialClients = yield Client_1.Client.count({ where: { status: 'TRIAL' } });
        const expiredClients = yield Client_1.Client.count({ where: { status: 'EXPIRED' } });
        res.json({
            total: totalClients,
            active: activeClients,
            trial: trialClients,
            expired: expiredClients
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getClientStats = getClientStats;
const updateClientStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        let { status, days } = req.body;
        const client = yield Client_1.Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }
        console.log(`DEBUG: Updating client ${id}`, { status, days, currentEnd: client.subscription_end_date, currentStatus: client.status });
        // CRITICAL: Save original status BEFORE changing it
        const wasExpired = client.status === 'EXPIRED';
        if (status) {
            client.status = status;
        }
        if (req.body.community_banned !== undefined) {
            client.community_banned = req.body.community_banned;
        }
        if (days) {
            const currentEnd = new Date(client.subscription_end_date);
            const now = new Date();
            // KEY RULE: If client WAS EXPIRED (checked BEFORE status update),
            // always start fresh from TODAY. Never accumulate on top of an old date.
            const baseDate = (status === 'TRIAL' || wasExpired) ? now : currentEnd;
            const newEnd = new Date(baseDate);
            newEnd.setDate(newEnd.getDate() + parseInt(days));
            client.subscription_end_date = newEnd;
            console.log(`DEBUG: New expiration: ${newEnd} | wasExpired: ${wasExpired} | base: ${wasExpired ? 'TODAY' : 'existing end date'}`);
            // Record a payment entry when activating with days (not for TRIAL)
            if (status === 'ACTIVE') {
                try {
                    const configRate = yield Config_1.Config.findByPk('annual_subscription_rate');
                    const amount = configRate ? parseInt(configRate.value) : 144000;
                    yield Payment_1.Payment.create({
                        client_id: client.id,
                        amount: amount,
                        payment_method: 'manual',
                        status: 'completed',
                        days_added: parseInt(days),
                        payment_date: new Date(),
                        invoice_number: `BOK-${Date.now()}`
                    });
                    console.log(`Payment recorded: ${amount} FCFA for ${days} days`);
                }
                catch (payErr) {
                    console.error('Failed to record payment (non-critical):', payErr);
                }
            }
        }
        yield client.save();
        res.json(client);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.updateClientStatus = updateClientStatus;
const communityBan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        const client = yield Client_1.Client.findOne({ where: { email } });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        client.community_banned = true;
        yield client.save();
        res.json({ message: 'Client blocked from community' });
    }
    catch (error) {
        console.error('Error banning client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.communityBan = communityBan;
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const client = yield Client_1.Client.findByPk(id);
        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }
        yield client.destroy();
        res.json({ message: 'Client deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteClient = deleteClient;
const getConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rateConf, logoConf, sigConf] = yield Promise.all([
            Config_1.Config.findByPk('annual_subscription_rate'),
            Config_1.Config.findByPk('company_logo'),
            Config_1.Config.findByPk('company_signature'),
        ]);
        console.log('DEBUG getConfig — signature value:', sigConf === null || sigConf === void 0 ? void 0 : sigConf.value);
        res.json({
            annual_subscription_rate: rateConf ? rateConf.value : '144000',
            company_logo: logoConf ? logoConf.value : null,
            company_signature: sigConf ? sigConf.value : null,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
});
exports.getConfig = getConfig;
const updateConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { annual_subscription_rate } = req.body;
        if (!annual_subscription_rate) {
            return res.status(400).json({ error: 'annual_subscription_rate is required' });
        }
        yield Config_1.Config.upsert({ key: 'annual_subscription_rate', value: annual_subscription_rate.toString() });
        res.json({ message: 'Configuration updated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update config' });
    }
});
exports.updateConfig = updateConfig;
const uploadLogo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        // Delete old logo file if different from new one
        try {
            const oldConf = yield Config_1.Config.findByPk('company_logo');
            if (oldConf === null || oldConf === void 0 ? void 0 : oldConf.value) {
                const oldFname = path_1.default.basename(oldConf.value);
                const newFname = req.file.filename;
                if (oldFname !== newFname) {
                    const oldPath = path_1.default.resolve(__dirname, '../../public/uploads', oldFname);
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlinkSync(oldPath);
                        console.log('[Config] Deleted old logo:', oldPath);
                    }
                }
            }
        }
        catch (e) {
            console.warn('[Config] Could not delete old logo:', e);
        }
        yield Config_1.Config.upsert({ key: 'company_logo', value: `/uploads/${req.file.filename}` });
        res.json({
            message: 'Logo updated successfully',
            logo_url: `/uploads/${req.file.filename}`
        });
    }
    catch (error) {
        console.error('Logo upload error', error);
        res.status(500).json({ error: 'Failed to upload logo' });
    }
});
exports.uploadLogo = uploadLogo;
const uploadSignature = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }
        // Delete old signature file if different from new one
        try {
            const oldConf = yield Config_1.Config.findByPk('company_signature');
            if (oldConf === null || oldConf === void 0 ? void 0 : oldConf.value) {
                const oldFname = path_1.default.basename(oldConf.value);
                const newFname = req.file.filename;
                if (oldFname !== newFname) {
                    const oldPath = path_1.default.resolve(__dirname, '../../public/uploads', oldFname);
                    if (fs_1.default.existsSync(oldPath)) {
                        fs_1.default.unlinkSync(oldPath);
                        console.log('[Config] Deleted old signature:', oldPath);
                    }
                }
            }
        }
        catch (e) {
            console.warn('[Config] Could not delete old signature:', e);
        }
        yield Config_1.Config.upsert({ key: 'company_signature', value: `/uploads/${req.file.filename}` });
        res.json({
            message: 'Signature updated successfully',
            signature_url: `/uploads/${req.file.filename}`
        });
    }
    catch (error) {
        console.error('Signature upload error', error);
        res.status(500).json({ error: 'Failed to upload signature' });
    }
});
exports.uploadSignature = uploadSignature;
// Delete ALL payments (for test data cleanup only)
const deleteAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Payment: PaymentModel } = yield Promise.resolve().then(() => __importStar(require('../models/Payment')));
        const count = yield PaymentModel.count();
        yield PaymentModel.destroy({ where: {}, truncate: true });
        res.json({ message: `Deleted ${count} payments successfully` });
    }
    catch (error) {
        console.error('Error deleting payments:', error);
        res.status(500).json({ error: 'Failed to delete payments' });
    }
});
exports.deleteAllPayments = deleteAllPayments;
// ─── ADMIN USERS CRUD ─────────────────────────────────────────────
const getAllAdmins = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admins = yield AdminUser_1.AdminUser.findAll({
            attributes: ['id', 'username', 'email', 'is_default', 'createdAt']
        });
        res.json(admins);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});
exports.getAllAdmins = getAllAdmins;
const createAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        const existing = yield AdminUser_1.AdminUser.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
        }
        const password_hash = yield bcrypt_1.default.hash(password, 10);
        const admin = yield AdminUser_1.AdminUser.create({
            username,
            password_hash,
            email,
            is_default: false
        });
        res.json({ id: admin.id, username: admin.username, email: admin.email });
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
});
exports.createAdmin = createAdmin;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        const admin = yield AdminUser_1.AdminUser.findByPk(id);
        if (!admin)
            return res.status(404).json({ error: 'Admin introuvable' });
        if (admin.is_default && username && username !== admin.username) {
            return res.status(403).json({ error: 'Le nom d\'utilisateur par défaut ne peut être modifié' });
        }
        if (username)
            admin.username = username;
        if (email)
            admin.email = email;
        if (password) {
            admin.password_hash = yield bcrypt_1.default.hash(password, 10);
        }
        yield admin.save();
        res.json({ message: 'Administrateur mis à jour' });
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
});
exports.updateAdmin = updateAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const admin = yield AdminUser_1.AdminUser.findByPk(id);
        if (!admin)
            return res.status(404).json({ error: 'Admin introuvable' });
        if (admin.is_default)
            return res.status(403).json({ error: 'Impossible de supprimer l\'administrateur par défaut' });
        yield admin.destroy();
        res.json({ message: 'Administrateur supprimé' });
    }
    catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
});
exports.deleteAdmin = deleteAdmin;
const nodemailer_1 = __importDefault(require("nodemailer"));
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        if (!username)
            return res.status(400).json({ error: 'Nom d\'utilisateur requis' });
        const admin = yield AdminUser_1.AdminUser.findOne({ where: { username } });
        if (!admin)
            return res.status(404).json({ error: 'Utilisateur introuvable' });
        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        admin.password_hash = yield bcrypt_1.default.hash(tempPassword, 10);
        yield admin.save();
        // Nodemailer configuration
        const transporter = nodemailer_1.default.createTransport({
            host: 'mail.bokelandgroupservices.com',
            port: 465,
            secure: true,
            auth: {
                user: 'admin@bokelandgroupservices.com',
                pass: 'Bouche@1990'
            }
        });
        const mailOptions = {
            from: '"Bokeland License Server" <admin@bokelandgroupservices.com>',
            to: admin.email, // Send to the admin's currently configured email
            subject: 'Réinitialisation de votre mot de passe administrateur',
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2>Réinitialisation du mot de passe</h2>
                    <p>Bonjour <b>${admin.username}</b>,</p>
                    <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte sur le panneau d'administration des licences Bokeland.</p>
                    <p>Voici votre mot de passe temporaire :</p>
                    <h3 style="background: #f4f4f5; padding: 10px; display: inline-block; border-radius: 5px;">${tempPassword}</h3>
                    <p>Veuillez vous connecter avec ce mot de passe et le modifier immédiatement dans la section Administrateurs.</p>
                    <br/>
                    <p><small>Si vous n'êtes pas à l'origine de cette demande, veuillez ignorer ce message.</small></p>
                </div>
            `
        };
        yield transporter.sendMail(mailOptions);
        res.json({ message: 'Les instructions ont été envoyées à votre adresse e-mail.' });
    }
    catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
    }
});
exports.forgotPassword = forgotPassword;
// ─── ADMIN AFFILIATE MANAGEMENT ───────────────────────────────────
const Affiliate_1 = require("../models/Affiliate");
const getAllAffiliates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const affiliates = yield Affiliate_1.Affiliate.findAll({
            include: [
                { association: 'clients', attributes: ['school_name', 'status', 'currency'] },
                { association: 'commissions', attributes: ['amount'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        // Filter clients list for each affiliate dynamically to only include matching currency
        const filteredAffiliates = affiliates.map(affiliate => {
            const affJson = affiliate.toJSON();
            if (!affJson.currency) {
                // If partner has no currency, they have no sponsored schools displayed
                affJson.clients = [];
            }
            else {
                affJson.clients = (affJson.clients || []).filter((client) => {
                    return (client.currency || 'XAF') === affJson.currency;
                });
            }
            return affJson;
        });
        res.json(filteredAffiliates);
    }
    catch (err) {
        console.error('Error fetching affiliates:', err);
        res.status(500).json({ error: 'Failed to fetch affiliates' });
    }
});
exports.getAllAffiliates = getAllAffiliates;
const updateAffiliate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { custom_commission_rate, balance_adjustment, status, note, currency } = req.body;
        const affiliate = yield Affiliate_1.Affiliate.findByPk(id);
        if (!affiliate) {
            return res.status(404).json({ error: 'Affiliate not found' });
        }
        if (status) {
            affiliate.status = status;
        }
        if (custom_commission_rate !== undefined) {
            affiliate.custom_commission_rate = custom_commission_rate;
        }
        if (currency !== undefined) {
            affiliate.currency = currency;
        }
        if (balance_adjustment) {
            const adj = parseFloat(balance_adjustment);
            affiliate.balance = (parseFloat(affiliate.balance.toString()) + adj);
        }
        yield affiliate.save();
        res.json(affiliate);
    }
    catch (err) {
        console.error('Error updating affiliate:', err);
        res.status(500).json({ error: 'Failed to update affiliate' });
    }
});
exports.updateAffiliate = updateAffiliate;
const createAffiliate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, custom_commission_rate } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }
        const normalizedEmail = email.trim().toLowerCase();
        // Check if affiliate already exists
        const existing = yield Affiliate_1.Affiliate.findOne({ where: { email: normalizedEmail } });
        if (existing) {
            return res.status(400).json({ error: 'Un partenaire avec cet email existe déjà.' });
        }
        const affiliate = yield Affiliate_1.Affiliate.create({
            email: normalizedEmail,
            status: 'GHOST',
            balance: 0,
            custom_commission_rate: custom_commission_rate !== undefined ? parseFloat(custom_commission_rate) : null
        });
        res.status(201).json(affiliate);
    }
    catch (err) {
        console.error('Error creating affiliate:', err);
        res.status(500).json({ error: 'Failed to create affiliate' });
    }
});
exports.createAffiliate = createAffiliate;
const sendEmailsToClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fromName, fromEmail, clients, subject, message } = req.body;
        if (!clients || !Array.isArray(clients) || clients.length === 0) {
            return res.status(400).json({ error: 'Aucun client destinataire spécifié.' });
        }
        if (!subject || !message) {
            return res.status(400).json({ error: 'Le sujet et le message sont requis.' });
        }
        const successes = [];
        const failures = [];
        for (const target of clients) {
            const { email, school_name } = target;
            if (!email)
                continue;
            try {
                yield (0, emailService_1.sendCustomEmail)(fromName, fromEmail, email, subject, message, school_name || 'Établissement');
                successes.push(email);
            }
            catch (err) {
                console.error(`Failed to send email to ${email}:`, err);
                failures.push({ email, error: err.message || 'Error sending email' });
            }
        }
        const total = clients.length;
        if (failures.length > 0) {
            return res.status(207).json({
                message: `Envoi complété avec des avertissements. Réussis: ${successes.length}/${total}. Échecs: ${failures.length}/${total}.`,
                successes,
                failures
            });
        }
        return res.json({
            message: `Tous les e-mails (${successes.length}) ont été envoyés avec succès.`,
            successes
        });
    }
    catch (error) {
        console.error('Error in sendEmailsToClients:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
});
exports.sendEmailsToClients = sendEmailsToClients;
