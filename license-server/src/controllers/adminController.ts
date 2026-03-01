import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';
import { Config } from '../models/Config';
import { UpdateVersion } from '../models/UpdateVersion';
import { Op } from 'sequelize';

// Simple admin authentication (in production, use proper JWT/session)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Change this!

export const adminLogin = async (req: Request, res: Response) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'admin-token-placeholder' });
    } else {
        res.status(401).json({ error: 'Invalid password' });
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

        // AUTO-RULE: If ACTIVE and no days specified, default to 444 and CREATE PAYMENT RECORD
        if (status === 'ACTIVE' && !days) {
            days = 444;

            try {
                // Fetch configured rate for the payment record
                const configRate = await Config.findByPk('annual_subscription_rate');
                const amount = configRate ? parseInt(configRate.value) : 144000;

                console.log(`DEBUG: Auto-generating payment record for client ${id} (${amount} FCFA, 444 days)`);

                await Payment.create({
                    client_id: client.id,
                    amount: amount,
                    payment_method: 'manual',
                    status: 'completed',
                    days_added: 444,
                    payment_date: new Date(),
                    invoice_number: `AUTO-${Date.now()}`
                });
            } catch (payErr) {
                console.error('Error creating auto-payment record:', payErr);
                // Continue even if payment record fails? 
                // Maybe better to log it; we verified the logic is correct but runtime errors could happen.
            }
        }

        console.log(`DEBUG: Updating client ${id}`, { status, days, currentEnd: client.subscription_end_date });

        if (status) {
            client.status = status;

            // AUTO-RESET: When manually setting to EXPIRED, reset expiration date to today
            // This makes it easier to test renewals and ensures expired clients have a current reference date
            if (status === 'EXPIRED' && !days) {
                const now = new Date();
                client.subscription_end_date = now;
                console.log(`🔄 Auto-reset expiration date to today for EXPIRED status: ${now.toISOString()}`);
            }
        }

        if (days) {
            const currentEnd = new Date(client.subscription_end_date);
            const now = new Date();
            const isExpired = currentEnd < now;

            // CRITICAL FIX for EXPIRED licenses:
            // - If TRIAL status: Always reset from today (existing behavior)
            // - If EXPIRED (regardless of new status): Reset from today
            // - If ACTIVE and not expired: Extend from current end date
            let baseDate;
            if (status === 'TRIAL') {
                baseDate = now; // TRIAL always resets
            } else if (isExpired) {
                baseDate = now; // EXPIRED always resets
            } else {
                baseDate = currentEnd; // ACTIVE and not expired: extend
            }

            const newEnd = new Date(baseDate);
            newEnd.setDate(newEnd.getDate() + parseInt(days));
            client.subscription_end_date = newEnd;

            console.log(`DEBUG: New expiration calculated:`, {
                status,
                was_expired: isExpired,
                old_expiration: currentEnd.toISOString(),
                new_expiration: newEnd.toISOString(),
                days_added: days
            });
        }

        await client.save();
        res.json(client);
    } catch (error) {
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
        const config = await Config.findByPk('annual_subscription_rate');
        res.json({ annual_subscription_rate: config ? config.value : '144000' });
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

        // Save path to config
        // Filename is generated by multer (or we can assume 'logo.png' if simpler, but req.file.filename is safer with multer config)
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

        // Save path to config
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


export const uploadUpdate = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const isYml = req.file.originalname.endsWith('.yml');
        const filename = req.file.filename;
        let version = null;

        // Try to extract version from filename (setup-1.0.0.exe) if it's an exe
        if (!isYml) {
            const match = filename.match(/(\d+\.\d+\.\d+)/);
            if (match) version = match[0];
        }

        await UpdateVersion.create({
            filename: filename,
            type: isYml ? 'yml' : 'exe',
            size: req.file.size,
            version: version
        });

        console.log(`Update file uploaded: ${filename}`);

        res.json({
            message: 'Update file uploaded successfully',
            file_url: `/updates/${filename}`,
            filename: filename
        });
    } catch (error) {
        console.error('Update upload error', error);
        res.status(500).json({ error: 'Failed to upload update file' });
    }
};

export const getUpdateHistory = async (req: Request, res: Response) => {
    try {
        const history = await UpdateVersion.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch update history' });
    }
};
