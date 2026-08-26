import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'mail.bokelandgroupservices.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'admin@bokelandgroupservices.com',
        pass: process.env.SMTP_PASS || 'Bouche@1990',
    },
    tls: {
        rejectUnauthorized: false
    }
});

export const sendInvoiceEmail = async (to: string, schoolName: string, invoicePath: string) => {
    try {
        const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'admin@bokelandgroupservices.com';
        const info = await transporter.sendMail({
            from: `"${process.env.COMPANY_NAME || 'Bokeland'}" <${senderEmail}>`,
            to: to,
            subject: `Votre facture ${process.env.COMPANY_NAME || 'Bokeland'} - Abonnement Leuana School`,
            html: `
                <p>Bonjour ${schoolName},</p>
                <p>Merci pour votre confiance !</p>
                <p>Votre abonnement <strong>Leuana School</strong> a été activé avec succès pour une durée de <strong>444 jours</strong>.</p>
                <p>Vous trouverez ci-joint votre facture.</p>
                <br>
                <p>Cordialement,</p>
                <p><strong>L'équipe ${process.env.COMPANY_NAME || 'Bokeland'}</strong></p>
                <p>${process.env.COMPANY_PHONE || ''}</p>
                <p>${process.env.COMPANY_ADDRESS || ''}</p>
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

export const sendCustomEmail = async (
    fromName: string,
    fromEmail: string,
    to: string,
    subject: string,
    message: string,
    schoolName: string
) => {
    try {
        const personalizedSubject = subject.replace(/{{school_name}}/g, schoolName);
        const personalizedMessage = message.replace(/{{school_name}}/g, schoolName);
        const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'admin@bokelandgroupservices.com';

        const info = await transporter.sendMail({
            from: `"${fromName || 'Bokeland'}" <${senderEmail}>`,
            replyTo: fromEmail || senderEmail,
            to: to,
            subject: personalizedSubject,
            html: `
                <div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #333; padding: 10px;">
                    ${personalizedMessage.replace(/\n/g, '<br/>')}
                </div>
            `
        });
        console.log('Custom email sent to %s: %s', to, info.messageId);
        return info;
    } catch (error) {
        console.error('Email Error:', error);
        throw error;
    }
};

