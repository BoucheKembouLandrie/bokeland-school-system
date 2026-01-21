import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';

// SIMPLIFIED VERSION - Returns all payments with mock client data
export const getAllPayments = async (req: Request, res: Response) => {
    console.log('\n=== GET ALL PAYMENTS ===');

    try {
        const payments = await Payment.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });

        console.log(`Found ${payments.length} payments`);

        const result = payments.map(p => ({
            ...p.toJSON(),
            Client: {
                id: 1,
                school_name: 'LEUANA SCHOOL',
                email: 'contact@leuana.com',
                phone: '+237123456789',
                status: 'ACTIVE'
            }
        }));

        res.json(result);
    } catch (error) {
        console.error('ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
};
