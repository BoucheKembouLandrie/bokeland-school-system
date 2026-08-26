"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendCustomEmail = exports.sendInvoiceEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
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
const sendInvoiceEmail = (to, schoolName, invoicePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'admin@bokelandgroupservices.com';
        const info = yield transporter.sendMail({
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
                    filename: path_1.default.basename(invoicePath),
                    path: invoicePath
                }
            ]
        });
        console.log('Email sent: %s', info.messageId);
        return info;
    }
    catch (error) {
        console.error('Email Error:', error);
        throw error;
    }
});
exports.sendInvoiceEmail = sendInvoiceEmail;
const sendCustomEmail = (fromName, fromEmail, to, subject, message, schoolName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const personalizedSubject = subject.replace(/{{school_name}}/g, schoolName);
        const personalizedMessage = message.replace(/{{school_name}}/g, schoolName);
        const senderEmail = process.env.SENDER_EMAIL || process.env.SMTP_USER || 'admin@bokelandgroupservices.com';
        const info = yield transporter.sendMail({
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
    }
    catch (error) {
        console.error('Email Error:', error);
        throw error;
    }
});
exports.sendCustomEmail = sendCustomEmail;
