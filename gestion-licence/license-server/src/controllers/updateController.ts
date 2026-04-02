import { Request, Response } from 'express';
import { Update } from '../models/Update';
import { UpdateDelivery } from '../models/UpdateDelivery';
import { Client } from '../models/Client';
import { io } from '../server';

export const publishUpdate = async (req: Request, res: Response) => {
    try {
        const { version, changelog, manifest: rawManifest } = req.body;
        let manifest = typeof rawManifest === 'string' ? JSON.parse(rawManifest) : (rawManifest || {});

        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
        if (files) {
            const fs = require('fs');
            const path = require('path');
            const targetDir = path.join(__dirname, `../../public/uploads/updates/${version}`);
            if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
            }

            if (files.frontendArchive && files.frontendArchive[0]) {
                const fPath = path.join(targetDir, 'frontend.zip');
                fs.renameSync(files.frontendArchive[0].path, fPath);
                manifest.frontend_url = `/uploads/updates/${version}/frontend.zip`;
            }
            if (files.backendArchive && files.backendArchive[0]) {
                const bPath = path.join(targetDir, 'backend.zip');
                fs.renameSync(files.backendArchive[0].path, bPath);
                manifest.backend_url = `/uploads/updates/${version}/backend.zip`;
            }
        }

        // Ensure atomic create
        const update = await Update.create({
            version,
            changelog,
            manifest: JSON.stringify(manifest),
        });

        // Get all active clients
        const clients = await Client.findAll({
            where: {
                status: ['ACTIVE', 'TRIAL']
            }
        });

        // Create delivery records
        const deliveries = clients.map(client => ({
            update_id: update.id,
            client_id: client.id,
            status: 'PENDING' as 'PENDING'
        }));
        await UpdateDelivery.bulkCreate(deliveries);

        // Emit socket event to all active clients
        clients.forEach(client => {
            io.to(`client_${client.email}`).emit('update_available', {
                version: update.version,
                changelog: update.changelog,
                manifest: update.manifest
            });
        });

        res.status(201).json({ message: 'Update published successfully', update });
    } catch (error) {
        console.error('Error publishing update:', error);
        res.status(500).json({ error: 'Failed to publish update' });
    }
};

export const getUpdates = async (req: Request, res: Response) => {
    try {
        const updates = await Update.findAll({
            order: [['release_date', 'DESC']],
            include: [{
                model: UpdateDelivery,
                as: 'deliveries',
                include: [{
                    model: Client,
                    as: 'client',
                    attributes: ['id', 'school_name', 'email', 'status']
                }]
            }]
        });
        res.json(updates);
    } catch (error) {
        console.error('Error fetching updates:', error);
        res.status(500).json({ error: 'Failed to fetch updates' });
    }
};

export const getLatestUpdateForClient = async (req: Request, res: Response) => {
    try {
        const { email } = req.params;
        const client = await Client.findOne({ where: { email } });
        if (!client) return res.status(404).json({ error: 'Client not found' });

        const pendingDelivery = await UpdateDelivery.findOne({
            where: {
                client_id: client.id,
                status: 'PENDING'
            },
            include: [{
                model: Update,
                as: 'update'
            }],
            order: [[{ model: Update, as: 'update' }, 'release_date', 'ASC']]
        });

        if (!pendingDelivery) {
            return res.json({ update_available: false });
        }

        res.json({
            update_available: true,
            delivery_id: pendingDelivery.id,
            update: pendingDelivery.update
        });
    } catch (error) {
        console.error('Error fetching latest update for client:', error);
        res.status(500).json({ error: 'Failed to fetch' });
    }
};

export const acknowledgeUpdate = async (req: Request, res: Response) => {
    try {
        const { delivery_id } = req.params;
        const delivery = await UpdateDelivery.findByPk(delivery_id);
        if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

        delivery.status = 'DELIVERED';
        delivery.delivered_at = new Date();
        await delivery.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error acknowledging update:', error);
        res.status(500).json({ error: 'Failed to acknowledge' });
    }
};

export const markUpdateInstalled = async (req: Request, res: Response) => {
    try {
        const { delivery_id } = req.params;
        const delivery = await UpdateDelivery.findByPk(delivery_id);
        if (!delivery) return res.status(404).json({ error: 'Delivery not found' });

        delivery.status = 'INSTALLED';
        delivery.acknowledged_at = new Date(); // Using this as installation complete time
        await delivery.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error marking update as installed:', error);
        res.status(500).json({ error: 'Failed to mark as installed' });
    }
};
