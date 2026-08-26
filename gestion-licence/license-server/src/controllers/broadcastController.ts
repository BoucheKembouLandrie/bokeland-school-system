import { Request, Response } from 'express';
import { BroadcastImage } from '../models/BroadcastImage';
import { io } from '../server';
import path from 'path';
import fs from 'fs';

export const uploadBroadcastImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const broadcastsDir = path.join(__dirname, '../../public/broadcasts');

        // Clean up: delete all previous files in public/broadcasts/
        if (fs.existsSync(broadcastsDir)) {
            const files = fs.readdirSync(broadcastsDir);
            for (const file of files) {
                // Keep the newly uploaded file, delete others
                if (file !== req.file.filename) {
                    try {
                        fs.unlinkSync(path.join(broadcastsDir, file));
                    } catch (err) {
                        console.warn(`Could not delete old broadcast file ${file}:`, err);
                    }
                }
            }
        }

        // Clean up: delete all previous records from DB
        await BroadcastImage.destroy({ where: {} });

        // Create new record
        const imageUrl = `/api/admin/broadcast/file/${req.file.filename}`;
        const broadcast = await BroadcastImage.create({
            filename: req.file.filename,
            imageUrl: imageUrl
        });

        // Push Socket.IO event to all connected clients
        io.emit('broadcast_image_push', {
            id: broadcast.id,
            imageUrl: imageUrl
        });

        console.log(`[License Server] New broadcast image published: ${broadcast.id}`);

        res.status(201).json({
            message: 'Broadcast image uploaded and pushed successfully',
            broadcast
        });
    } catch (error) {
        console.error('Error publishing broadcast image:', error);
        res.status(500).json({ error: 'Failed to publish broadcast image' });
    }
};

export const getCurrentBroadcast = async (req: Request, res: Response) => {
    try {
        const broadcast = await BroadcastImage.findOne();
        if (!broadcast) {
            return res.json(null);
        }
        res.json({
            id: broadcast.id,
            imageUrl: broadcast.imageUrl
        });
    } catch (error) {
        console.error('Error fetching current broadcast image:', error);
        res.status(500).json({ error: 'Failed to fetch current broadcast image' });
    }
};
