import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';
import { Config } from '../models/Config';
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

        console.log(`DEBUG: Updating client ${id}`, { status, days, currentEnd: client.subscription_end_date, currentStatus: client.status });

        // CRITICAL: Save original status BEFORE changing it
        const wasExpired = client.status === 'EXPIRED';

        if (status) {
            client.status = status;
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

