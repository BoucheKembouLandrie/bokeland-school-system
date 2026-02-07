import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';
import { Op } from 'sequelize';
import * as campayService from '../services/campayService';
import * as emailService from '../services/emailService';
import * as invoiceService from '../services/invoiceService';
import path from 'path';
import fs from 'fs';

export const getAllPayments = async (req: Request, res: Response) => {
    console.log('\n🔍 GET ALL PAYMENTS - START');
    console.log('Query params:', req.query);

    try {
        // TEMPORARY: Return hardcoded test data to verify the endpoint works
        const testPayments = [
            {
                id: 1,
                client_id: 1,
                amount: 88800,
                payment_date: new Date(),
                payment_method: 'manual',
                transaction_id: null,
                status: 'completed',
                days_added: 444,
                invoice_number: 'TEST-001',
                Client: {
                    id: 1,
                    school_name: 'Test School',
                    email: 'test@example.com',
                    phone: '123456789',
                    status: 'ACTIVE'
                }
            }
        ];

        console.log('✅ Returning test data:', testPayments.length, 'payments');
        res.json(testPayments);
    } catch (error) {
        console.error('❌ Error in getAllPayments:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const getRevenueSummary = async (req: Request, res: Response) => {
    try {
        const { start_date, end_date } = req.query;

        const whereClause: any = {
            status: 'completed'
        };

        if (start_date && end_date) {
            whereClause.payment_date = {
                [Op.between]: [new Date(start_date as string), new Date(end_date as string)]
            };
        }

        const payments = await Payment.findAll({
            where: whereClause,
            attributes: ['payment_method', 'amount']
        });

        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const paymentCount = payments.length;
        const averagePayment = paymentCount > 0 ? totalRevenue / paymentCount : 0;

        const methodBreakdown: { [key: string]: number } = {};
        payments.forEach(p => {
            methodBreakdown[p.payment_method] = (methodBreakdown[p.payment_method] || 0) + parseFloat(p.amount.toString());
        });

        res.json({
            total_revenue: totalRevenue,
            payment_count: paymentCount,
            average_payment: averagePayment,
            method_breakdown: methodBreakdown
        });
    } catch (error) {
        console.error('Error calculating revenue', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// ... rest of the file remains the same
