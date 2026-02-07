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
        }

        if (days) {
            const currentEnd = new Date(client.subscription_end_date);
            const now = new Date();

            // STRICT RULE: If switching to TRIAL, we RESET the expiration to start from NOW.
            // This effectively cancels any previous "Active" days.
            // For ACTIVE/Other, we add to the existing expiration if it's in the future.
            const baseDate = status === 'TRIAL' ? now : (currentEnd > now ? currentEnd : now);

            const newEnd = new Date(baseDate);
            newEnd.setDate(newEnd.getDate() + parseInt(days)); // Ensure integer addition
            client.subscription_end_date = newEnd;
            console.log(`DEBUG: New expiration date calculated: ${newEnd} (Status: ${status})`);
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
