import { Request, Response } from 'express';
import { Affiliate } from '../models/Affiliate';
import { Client } from '../models/Client';
import { Commission } from '../models/Commission';
import { Config } from '../models/Config';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mailer setup (should be configured via env vars in production)
// Use local Exim4 relay if no external SMTP configured, otherwise use env vars
const useLocalRelay = !process.env.SMTP_USER;

const transporter = nodemailer.createTransport(useLocalRelay ? {
    host: 'localhost',
    port: 25,
    secure: false,
    tls: {
        rejectUnauthorized: false // Accept self-signed cert from local Exim4
    }
} : {
    host: process.env.SMTP_HOST || 'mail.bokelandgroupservices.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS || 'Bouche@1990'
    },
    tls: {
        rejectUnauthorized: false
    }
});


const JWT_SECRET = process.env.JWT_SECRET || 'bokeland-affiliate-secret';

// 1. Request OTP to claim account
export const requestOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const affiliate = await Affiliate.findOne({ where: { email: email.trim().toLowerCase() } });
        if (!affiliate) {
            return res.status(404).json({ error: 'Aucun compte partenaire trouvé pour cet email. Assurez-vous d\'avoir installé Bokeland avec cet email.' });
        }

        // Generate exactly 6-digit OTP
        const otpCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Valid for 15 mins

        affiliate.otp_code = otpCode;
        affiliate.otp_expires_at = expiresAt;
        await affiliate.save();

        console.log(`\n=== 🧪 MODE TEST LOCAL ===`);
        console.log(`CODE OTP GÉNÉRÉ POUR ${email} : ${otpCode}`);
        console.log(`=============================\n`);

        // Send Email
        try {
            await transporter.sendMail({
                from: `"Bokeland Partenaires" <admin@bokelandgroupservices.com>`,
                to: affiliate.email,
                subject: 'Code de vérification - Partenaire Bokeland',
                html: `<h3>Bonjour,</h3><p>Voici votre code de vérification pour réclamer votre compte partenaire :</p><h2>${otpCode}</h2><p>Ce code expire dans 15 minutes.</p>`
            });
            console.log(`[Affiliate] OTP sent to ${affiliate.email}`);
        } catch (mailError) {
            console.error('[Affiliate] Mail error (OTP still generated in DB):', (mailError as any).message);
            // OTP is saved in DB — return success so the user can still proceed.
            // The admin can communicate the code from the server logs if needed.
        }

        res.json({ message: 'Un code a été envoyé à votre adresse email.' });
    } catch (error: any) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

// 2. Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;
        const affiliate = await Affiliate.findOne({ where: { email: email.trim().toLowerCase() } });

        if (!affiliate || affiliate.otp_code !== code) {
            return res.status(400).json({ error: 'Code invalide.' });
        }

        if (affiliate.otp_expires_at && new Date() > affiliate.otp_expires_at) {
            return res.status(400).json({ error: 'Code expiré. Veuillez en demander un nouveau.' });
        }

        // Clear OTP
        affiliate.otp_code = null;
        affiliate.otp_expires_at = null;
        await affiliate.save();

        // Generate temporary setup token
        const setupToken = jwt.sign({ id: affiliate.id, setup: true }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Code vérifié avec succès', setupToken, status: affiliate.status });
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 3. Setup Account (Password & Phone)
export const setupAccount = async (req: Request, res: Response) => {
    try {
        const { setupToken, password, phone_number, currency } = req.body;

        const decoded: any = jwt.verify(setupToken, JWT_SECRET);
        if (!decoded.setup) return res.status(401).json({ error: 'Invalid token' });

        const affiliate = await Affiliate.findByPk(decoded.id);
        if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

        // Currency is MANDATORY — no fallback allowed
        if (!currency) {
            return res.status(400).json({ error: 'La sélection d\'une devise est obligatoire pour finaliser la configuration de votre compte.' });
        }

        const allowedCurrencies = ['XAF', 'XOF', 'GNF', 'CDF', 'BIF', 'KMF', 'DJF', 'SCR'];
        const cleanCurrency = String(currency).toUpperCase();
        if (!allowedCurrencies.includes(cleanCurrency)) {
            return res.status(400).json({ error: 'Devise non valide ou non supportée.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        affiliate.password_hash = hashedPassword;
        affiliate.phone_number = phone_number;
        affiliate.currency = cleanCurrency;
        affiliate.status = 'ACTIVE';
        await affiliate.save();

        res.json({ message: 'Compte configuré avec succès. Vous pouvez maintenant vous connecter.' });
    } catch (error: any) {
        res.status(500).json({ error: 'Server error or invalid token' });
    }
};

// 4. Login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const affiliate = await Affiliate.findOne({ where: { email: email.trim().toLowerCase() } });

        if (!affiliate || !affiliate.password_hash) {
            return res.status(401).json({ error: 'Identifiants incorrects ou compte non réclamé.' });
        }

        const isValid = await bcrypt.compare(password, affiliate.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Identifiants incorrects.' });
        }

        if (affiliate.status === 'BANNED') {
            return res.status(403).json({ error: 'Ce compte a été suspendu.' });
        }

        const token = jwt.sign({ id: affiliate.id, role: 'affiliate' }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Connexion réussie',
            token,
            affiliate: {
                id: affiliate.id,
                email: affiliate.email,
                phone_number: affiliate.phone_number,
                balance: affiliate.balance,
                status: affiliate.status,
                currency: affiliate.currency
            }
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 5. Dashboard (Requires Auth)
export const getDashboard = async (req: Request, res: Response) => {
    try {
        const affiliateId = (req as any).user.id;
        
        const affiliate = await Affiliate.findByPk(affiliateId);
        if (!affiliate) return res.status(404).json({ error: 'Not found' });

        const affiliateCurrency = affiliate.currency;

        // Get clients matching affiliate's currency (only if currency is defined)
        let clients: Client[] = [];
        if (affiliateCurrency) {
            clients = await Client.findAll({ 
                where: { affiliate_id: affiliateId, currency: affiliateCurrency } as any,
                attributes: ['id', 'school_name', 'city', 'status', 'subscription_end_date']
            });
        }

        // Get commissions history
        const commissions = await Commission.findAll({
            where: { affiliate_id: affiliateId },
            order: [['createdAt', 'DESC']],
            include: [{ model: Client, as: 'client', attributes: ['school_name'] }]
        });

        res.json({
            balance: affiliate.balance,
            currency: affiliateCurrency,
            clients,
            commissions
        });

    } catch (error: any) {
        res.status(500).json({ error: 'Server error' });
    }
};

// 6. Request Withdrawal
export const requestWithdrawal = async (req: Request, res: Response) => {
    try {
        const affiliateId = (req as any).user.id;
        const { amount } = req.body;

        if (!amount || amount < 5000) {
            return res.status(400).json({ error: 'Le montant minimum de retrait est de 5000.' });
        }

        const affiliate = await Affiliate.findByPk(affiliateId);
        if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

        if (Number(affiliate.balance) < amount) {
            return res.status(400).json({ error: 'Solde insuffisant.' });
        }

        // For now, we will simply notify the admin via email and log it.
        // In Phase 5, we can add a formal Withdrawal table.
        try {
            await transporter.sendMail({
                from: `"Bokeland Partenaires" <${process.env.SMTP_USER || 'no-reply@bokeland.com'}>`,
                to: process.env.ADMIN_EMAIL || 'admin@bokeland.com',
                subject: `Demande de Retrait - ${affiliate.email}`,
                html: `<h3>Demande de Retrait</h3>
                       <p><strong>Partenaire :</strong> ${affiliate.email}</p>
                       <p><strong>Téléphone :</strong> ${affiliate.phone_number}</p>
                       <p><strong>Montant demandé :</strong> ${amount} XAF</p>
                       <p><strong>Solde actuel :</strong> ${affiliate.balance} XAF</p>`
            });
            console.log(`[Affiliate] Withdrawal request of ${amount} sent to admin for ${affiliate.email}`);
        } catch (mailError) {
            console.error('[Affiliate] Mail error for withdrawal:', mailError);
        }

        // Temporarily deduct balance to prevent double request before admin processes it.
        // Actually, we should probably just send the request, but without a table it's tricky.
        // Let's deduct it now. If admin rejects, admin can manually add it back.
        affiliate.balance = Number(affiliate.balance) - amount;
        await affiliate.save();

        res.json({ message: 'Demande de retrait envoyée avec succès. Elle sera traitée sous 48h.' });
    } catch (error: any) {
        res.status(500).json({ error: 'Server error' });
    }
};
