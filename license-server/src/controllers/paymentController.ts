import { Request, Response } from 'express';
import { Payment } from '../models/Payment';
import { Client } from '../models/Client';

// GET ALL PAYMENTS - ULTRA SIMPLIFIED
export const getAllPayments = async (req: Request, res: Response) => {
    console.log('\n=== GET ALL PAYMENTS ===');

    try {
        // Fetch ALL payments without any filters
        const payments = await Payment.findAll({
            order: [['id', 'DESC']],
            limit: 100
        });

        console.log(`✅ Found ${payments.length} payments`);

        // Manually get client for each payment
        const result = [];
        for (let i = 0; i < payments.length; i++) {
            const payment = payments[i];
            try {
                const client = await Client.findByPk(payment.client_id);
                result.push({
                    id: payment.id,
                    client_id: payment.client_id,
                    amount: payment.amount,
                    payment_date: payment.payment_date,
                    payment_method: payment.payment_method,
                    transaction_id: payment.transaction_id,
                    status: payment.status,
                    days_added: payment.days_added,
                    invoice_number: payment.invoice_number,
                    Client: client ? {
                        id: client.id,
                        school_name: client.school_name,
                        email: client.email,
                        phone: client.phone,
                        status: client.status
                    } : null
                });
            } catch (err) {
                console.error(`Error fetching client for payment ${payment.id}:`, err);
                result.push({
                    id: payment.id,
                    client_id: payment.client_id,
                    amount: payment.amount,
                    payment_date: payment.payment_date,
                    payment_method: payment.payment_method,
                    transaction_id: payment.transaction_id,
                    status: payment.status,
                    days_added: payment.days_added,
                    invoice_number: payment.invoice_number,
                    Client: null
                });
            }
        }

        console.log(`📤 Returning ${result.length} payments`);
        res.json(result);
    } catch (error) {
        console.error('❌ ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
};

// GET REVENUE SUMMARY
export const getRevenueSummary = async (req: Request, res: Response) => {
    try {
        const payments = await Payment.findAll();
        const completed = payments.filter(p => p.status === 'completed');
        const totalRevenue = completed.reduce((sum, p) => sum + Number(p.amount), 0);

        res.json({
            total_revenue: totalRevenue,
            payment_count: completed.length,
            average_payment: completed.length > 0 ? totalRevenue / completed.length : 0,
            method_breakdown: { manual: totalRevenue }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: String(error) });
    }
};

// CREATE MANUAL PAYMENT
export const createPayment = async (req: Request, res: Response) => {
    console.log('\n=== CREATE MANUAL PAYMENT ===');

    try {
        const { client_id, amount, days } = req.body;

        if (!client_id || !amount) {
            return res.status(400).json({ error: 'Client ID and amount required' });
        }

        const client = await Client.findByPk(client_id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        const payment = await Payment.create({
            client_id,
            amount,
            payment_method: 'manual',
            status: 'completed',
            days_added: days || 444,
            payment_date: new Date(),
            invoice_number: `BOK-${Date.now()}`
        });

        console.log(`✅ Payment created: ${payment.id}`);

        // Update client
        const currentEnd = new Date(client.subscription_end_date);
        const now = new Date();
        const baseDate = currentEnd > now ? currentEnd : now;
        const newEnd = new Date(baseDate);
        newEnd.setDate(newEnd.getDate() + (days || 444));

        client.subscription_end_date = newEnd;
        client.status = 'ACTIVE';
        await client.save();

        res.json({ success: true, payment });
    } catch (error) {
        console.error('❌ ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
};

// Disabled functions
export const initiatePayment = async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Not implemented' });
};

export const handleWebhook = async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Not implemented' });
};

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { Config } from '../models/Config';

export const downloadInvoice = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [payment, configLogo, configSignature] = await Promise.all([
            Payment.findByPk(id),
            Config.findByPk('company_logo'),
            Config.findByPk('company_signature')
        ]);

        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }

        const client = await Client.findByPk(payment.client_id);
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Create PDF
        const doc = new PDFDocument({ margin: 50 });
        const filename = `Recu_${payment.invoice_number || payment.id}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // --- HEADER ---
        // --- HEADER ---
        // --- HEADER ---
        // Try to load logo
        try {
            let logoPath = null;

            if (configLogo && configLogo.value) {
                // Remove leading slash to ensure path.join treats it as relative
                const relativePath = configLogo.value.replace(/^\/+/, '');
                logoPath = path.join(__dirname, '../../public', relativePath);
                console.log('DEBUG: Attempting to load logo from:', logoPath);
            }

            if (logoPath && fs.existsSync(logoPath)) {
                doc.image(logoPath, 50, 45, { width: 150 });
                doc.moveDown();
            } else {
                console.log('DEBUG: Logo file not found or not configured at:', logoPath);
                doc.fontSize(20).font('Helvetica-Bold').text('BOKELAND SCHOOL SYSTEM', 50, 57);
            }
        } catch (e) {
            console.error('DEBUG: Error loading logo:', e);
            doc.fontSize(20).font('Helvetica-Bold').text('BOKELAND SCHOOL SYSTEM', 50, 57);
        }

        doc.fontSize(10).font('Helvetica').text('Solution de Gestion Scolaire', 200, 65, { align: 'right' });
        doc.text('Support: support@bokeland.com', 200, 80, { align: 'right' });
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();

        // --- TITLE ---
        doc.fontSize(20).font('Helvetica-Bold').text('REÇU DE PAIEMENT', 50, 150, { align: 'center', underline: true });
        doc.moveDown();

        // --- INFO GRID ---
        const startY = 200;

        // Col 1: Client Info
        doc.fontSize(12).font('Helvetica-Bold').text('CLIENT:', 50, startY);
        doc.fontSize(10).font('Helvetica').text(client.school_name, 50, startY + 15);
        doc.text(`Email: ${client.email}`, 50, startY + 30);
        doc.text(client.phone ? `Tel: ${client.phone}` : '', 50, startY + 45);

        // Col 2: Invoice Info
        doc.font('Helvetica-Bold').text('DÉTAILS:', 300, startY);
        doc.font('Helvetica').text(`Référence: ${payment.invoice_number || payment.external_reference || 'N/A'}`, 300, startY + 15);
        doc.text(`Date: ${new Date(payment.payment_date).toLocaleDateString()}`, 300, startY + 30);
        doc.text(`Méthode: ${payment.payment_method.toUpperCase()}`, 300, startY + 45);

        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();

        // --- TABLE HEADER ---
        const tableTop = 320;
        doc.font('Helvetica-Bold');
        doc.text('DESCRIPTION', 50, tableTop);
        doc.text('DURÉE', 300, tableTop, { width: 90, align: 'right' });
        doc.text('MONTANT', 400, tableTop, { width: 90, align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // --- TABLE ROW ---
        const rowTop = tableTop + 30;
        doc.font('Helvetica');
        doc.text('Abonnement Licence Logiciel Leuana School', 50, rowTop);
        doc.text(`${payment.days_added} Jours`, 300, rowTop, { width: 90, align: 'right' });
        doc.text(`${Number(payment.amount).toLocaleString()} FCFA`, 400, rowTop, { width: 90, align: 'right' });

        doc.moveTo(50, rowTop + 20).lineTo(550, rowTop + 20).stroke();

        // --- TOTAL ---
        const totalTop = rowTop + 40;
        doc.font('Helvetica-Bold').fontSize(14);
        doc.text('TOTAL PAYÉ:', 300, totalTop);
        doc.text(`${Number(payment.amount).toLocaleString()} FCFA`, 400, totalTop, { width: 90, align: 'right' });

        // --- SIGNATURE ---
        // Add signature section at bottom right
        const signatureTop = 550;
        doc.font('Helvetica-Bold').fontSize(12).text(
            'La Direction Générale',
            350,
            signatureTop,
            { underline: true }
        );

        try {
            let signaturePath = null;
            if (configSignature && configSignature.value) {
                const relativePath = configSignature.value.replace(/^\/+/, '');
                signaturePath = path.join(__dirname, '../../public', relativePath);
            }

            if (signaturePath && fs.existsSync(signaturePath)) {
                doc.image(signaturePath, 340, signatureTop + 20, { width: 200 });
            }
        } catch (e) {
            console.error('Error loading signature:', e);
        }

        // --- FOOTER ---
        doc.fontSize(10).font('Helvetica').text(
            'Merci pour votre confiance. Ce reçu est généré électroniquement.',
            50,
            700,
            { align: 'center', width: 500 }
        );

        doc.end();

    } catch (error) {
        console.error('Error generating PDF', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
};

export const checkPaymentStatus = async (req: Request, res: Response) => {
    res.status(501).json({ error: 'Not implemented' });
};
