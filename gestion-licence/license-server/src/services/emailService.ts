import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendInvoiceEmail = async (to: string, schoolName: string, invoicePath: string) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.COMPANY_NAME}" <${process.env.SMTP_USER}>`,
            to: to,
            subject: `Votre facture ${process.env.COMPANY_NAME} - Abonnement Leuana School`,
            html: `
                <p>Bonjour ${schoolName},</p>
                <p>Merci pour votre confiance !</p>
                <p>Votre abonnement <strong>Leuana School</strong> a été activé avec succès pour une durée de <strong>444 jours</strong>.</p>
                <p>Vous trouverez ci-joint votre facture.</p>
                <br>
                <p>Cordialement,</p>
                <p><strong>L'équipe ${process.env.COMPANY_NAME}</strong></p>
                <p>${process.env.COMPANY_PHONE}</p>
                <p>${process.env.COMPANY_ADDRESS}</p>
            `,
            attachments: [
                {
                    filename: path.basename(invoicePath),
                    path: invoicePath
                }
            ]
        });
        console.log('Email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Email Error:', error);
        throw error;
    }
};
