import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';
import { Config } from '../models/Config';
import { Op } from 'sequelize';
import fs from 'fs';
import path from 'path';
import { sendCustomEmail } from '../services/emailService';

// Uses AdminUser model for authentication
import bcrypt from 'bcrypt';
import { AdminUser } from '../models/AdminUser';
// In production, you would generate a real JWT using jsonwebtoken
// For now, we will return a simple token based on the user's ID
export const adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await AdminUser.findOne({ where: { username } });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (match) {
            res.json({ success: true, token: 'admin-token-placeholder', userId: user.id });
        } else {
            res.status(401).json({ error: 'Utilisateur ou mot de passe incorrect' });
        }
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.findAll({
            order: [['createdAt', 'DESC']]
        });

        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getClientStats = async (req: Request, res: Response) => {
    try {
        const totalClients = await Client.count();
        const activeClients = await Client.count({ where: { status: 'ACTIVE' } });
        const trialClients = await Client.count({ where: { status: 'TRIAL' } });
        const expiredClients = await Client.count({ where: { status: 'EXPIRED' } });

        res.json({
            total: totalClients,
            active: activeClients,
            trial: trialClients,
            expired: expiredClients
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateClientStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { status, days } = req.body;

        const client = await Client.findByPk(id);
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
                    const configRate = await Config.findByPk('annual_subscription_rate');
                    const amount = configRate ? parseInt(configRate.value) : 144000;
                    await Payment.create({
                        client_id: client.id,
                        amount: amount,
                        payment_method: 'manual',
                        status: 'completed',
                        days_added: parseInt(days),
                        payment_date: new Date(),
                        invoice_number: `BOK-${Date.now()}`
                    });
                    console.log(`Payment recorded: ${amount} FCFA for ${days} days`);
                } catch (payErr) {
                    console.error('Failed to record payment (non-critical):', payErr);
                }
            }
        }

        await client.save();
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const communityBan = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        const client = await Client.findOne({ where: { email } });
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }
        client.community_banned = true;
        await client.save();
        res.json({ message: 'Client blocked from community' });
    } catch (error) {
        console.error('Error banning client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const client = await Client.findByPk(id);

        if (!client) {
            res.status(404).json({ error: 'Client not found' });
            return;
        }

        await client.destroy();
        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getConfig = async (req: Request, res: Response) => {
    try {
        const [rateConf, logoConf, sigConf] = await Promise.all([
            Config.findByPk('annual_subscription_rate'),
            Config.findByPk('company_logo'),
            Config.findByPk('company_signature'),
        ]);
        console.log('DEBUG getConfig — signature value:', sigConf?.value);
        res.json({
            annual_subscription_rate: rateConf ? rateConf.value : '144000',
            company_logo: logoConf ? logoConf.value : null,
            company_signature: sigConf ? sigConf.value : null,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch config' });
    }
};


export const updateConfig = async (req: Request, res: Response) => {
    try {
        const { annual_subscription_rate } = req.body;
        if (!annual_subscription_rate) {
            return res.status(400).json({ error: 'annual_subscription_rate is required' });
        }
        await Config.upsert({ key: 'annual_subscription_rate', value: annual_subscription_rate.toString() });
        res.json({ message: 'Configuration updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update config' });
    }
};

export const uploadLogo = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Delete old logo file if different from new one
        try {
            const oldConf = await Config.findByPk('company_logo');
            if (oldConf?.value) {
                const oldFname = path.basename(oldConf.value);
                const newFname = req.file.filename;
                if (oldFname !== newFname) {
                    const oldPath = path.resolve(__dirname, '../../public/uploads', oldFname);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                        console.log('[Config] Deleted old logo:', oldPath);
                    }
                }
            }
        } catch (e) { console.warn('[Config] Could not delete old logo:', e); }

        await Config.upsert({ key: 'company_logo', value: `/uploads/${req.file.filename}` });

        res.json({
            message: 'Logo updated successfully',
            logo_url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Logo upload error', error);
        res.status(500).json({ error: 'Failed to upload logo' });
    }
};

export const uploadSignature = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Delete old signature file if different from new one
        try {
            const oldConf = await Config.findByPk('company_signature');
            if (oldConf?.value) {
                const oldFname = path.basename(oldConf.value);
                const newFname = req.file.filename;
                if (oldFname !== newFname) {
                    const oldPath = path.resolve(__dirname, '../../public/uploads', oldFname);
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                        console.log('[Config] Deleted old signature:', oldPath);
                    }
                }
            }
        } catch (e) { console.warn('[Config] Could not delete old signature:', e); }

        await Config.upsert({ key: 'company_signature', value: `/uploads/${req.file.filename}` });

        res.json({
            message: 'Signature updated successfully',
            signature_url: `/uploads/${req.file.filename}`
        });
    } catch (error) {
        console.error('Signature upload error', error);
        res.status(500).json({ error: 'Failed to upload signature' });
    }
};

// Delete ALL payments (for test data cleanup only)
export const deleteAllPayments = async (req: Request, res: Response) => {
    try {
        const { Payment: PaymentModel } = await import('../models/Payment');
        const count = await PaymentModel.count();
        await PaymentModel.destroy({ where: {}, truncate: true });
        res.json({ message: `Deleted ${count} payments successfully` });
    } catch (error) {
        console.error('Error deleting payments:', error);
        res.status(500).json({ error: 'Failed to delete payments' });
    }
};

// ─── ADMIN USERS CRUD ─────────────────────────────────────────────

export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const admins = await AdminUser.findAll({
            attributes: ['id', 'username', 'email', 'is_default', 'createdAt']
        });
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        
        const existing = await AdminUser.findOne({ where: { username } });
        if (existing) {
            return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const admin = await AdminUser.create({
            username,
            password_hash,
            email,
            is_default: false
        });

        res.json({ id: admin.id, username: admin.username, email: admin.email });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la création' });
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { username, password, email } = req.body;
        
        const admin = await AdminUser.findByPk(id);
        if (!admin) return res.status(404).json({ error: 'Admin introuvable' });

        if (admin.is_default && username && username !== admin.username) {
            return res.status(403).json({ error: 'Le nom d\'utilisateur par défaut ne peut être modifié' });
        }

        if (username) admin.username = username;
        if (email) admin.email = email;
        if (password) {
            admin.password_hash = await bcrypt.hash(password, 10);
        }

        await admin.save();
        res.json({ message: 'Administrateur mis à jour' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const admin = await AdminUser.findByPk(id);
        
        if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
        if (admin.is_default) return res.status(403).json({ error: 'Impossible de supprimer l\'administrateur par défaut' });

        await admin.destroy();
        res.json({ message: 'Administrateur supprimé' });
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression' });
    }
};

import nodemailer from 'nodemailer';

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: 'Nom d\'utilisateur requis' });

        const admin = await AdminUser.findOne({ where: { username } });
        if (!admin) return res.status(404).json({ error: 'Utilisateur introuvable' });

        // Generate temporary password
        const tempPassword = Math.random().toString(36).slice(-8);
        admin.password_hash = await bcrypt.hash(tempPassword, 10);
        await admin.save();

        // Nodemailer configuration
        const transporter = nodemailer.createTransport({
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

        await transporter.sendMail(mailOptions);
        
        res.json({ message: 'Les instructions ont été envoyées à votre adresse e-mail.' });
    } catch (err) {
        console.error('Password reset error:', err);
        res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
    }
};

// ─── ADMIN AFFILIATE MANAGEMENT ───────────────────────────────────

import { Affiliate } from '../models/Affiliate';
import { Commission } from '../models/Commission';

export const getAllAffiliates = async (req: Request, res: Response) => {
    try {
        const affiliates = await Affiliate.findAll({
            include: [
                { association: 'clients', attributes: ['school_name', 'status', 'currency'] },
                { association: 'commissions', attributes: ['amount'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        // Filter clients list for each affiliate dynamically to only include matching currency
        const filteredAffiliates = affiliates.map(affiliate => {
            const affJson = affiliate.toJSON() as any;
            if (!affJson.currency) {
                // If partner has no currency, they have no sponsored schools displayed
                affJson.clients = [];
            } else {
                affJson.clients = (affJson.clients || []).filter((client: any) => {
                    return (client.currency || 'XAF') === affJson.currency;
                });
            }
            return affJson;
        });

        res.json(filteredAffiliates);
    } catch (err) {
        console.error('Error fetching affiliates:', err);
        res.status(500).json({ error: 'Failed to fetch affiliates' });
    }
};

export const updateAffiliate = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { custom_commission_rate, balance_adjustment, status, note, currency } = req.body;

        const affiliate = await Affiliate.findByPk(id);
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

        await affiliate.save();
        res.json(affiliate);
    } catch (err) {
        console.error('Error updating affiliate:', err);
        res.status(500).json({ error: 'Failed to update affiliate' });
    }
};

export const createAffiliate = async (req: Request, res: Response) => {
    try {
        const { email, custom_commission_rate } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const normalizedEmail = email.trim().toLowerCase();
        
        // Check if affiliate already exists
        const existing = await Affiliate.findOne({ where: { email: normalizedEmail } });
        if (existing) {
            return res.status(400).json({ error: 'Un partenaire avec cet email existe déjà.' });
        }

        const affiliate = await Affiliate.create({
            email: normalizedEmail,
            status: 'GHOST',
            balance: 0,
            custom_commission_rate: custom_commission_rate !== undefined ? parseFloat(custom_commission_rate) : null
        });

        res.status(201).json(affiliate);
    } catch (err) {
        console.error('Error creating affiliate:', err);
        res.status(500).json({ error: 'Failed to create affiliate' });
    }
};

export const sendEmailsToClients = async (req: Request, res: Response) => {
    try {
        const { fromName, fromEmail, clients, subject, message } = req.body;
        
        if (!clients || !Array.isArray(clients) || clients.length === 0) {
            return res.status(400).json({ error: 'Aucun client destinataire spécifié.' });
        }
        if (!subject || !message) {
            return res.status(400).json({ error: 'Le sujet et le message sont requis.' });
        }

        const successes: string[] = [];
        const failures: { email: string; error: string }[] = [];

        for (const target of clients) {
            const { email, school_name } = target;
            if (!email) continue;
            try {
                await sendCustomEmail(
                    fromName,
                    fromEmail,
                    email,
                    subject,
                    message,
                    school_name || 'Établissement'
                );
                successes.push(email);
            } catch (err: any) {
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
    } catch (error: any) {
        console.error('Error in sendEmailsToClients:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
};




