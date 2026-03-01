import nodemailer from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}

// Create reusable transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

export const sendPasswordRecoveryEmail = async (
    email: string,
    username: string,
    temporaryPassword: string
): Promise<void> => {
    const subject = 'Récupération de mot de passe - BOKELAND SCHOOL SYSTEM';

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008888;">Récupération de mot de passe</h2>
            <p>Bonjour,</p>
            <p>Vous avez demandé la récupération de votre mot de passe administrateur.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Nom d'utilisateur:</strong> ${username}</p>
                <p><strong>Mot de passe temporaire:</strong> ${temporaryPassword}</p>
            </div>
            <p style="color: #d32f2f;"><strong>Important:</strong> Ce mot de passe est temporaire. Veuillez le changer dès votre prochaine connexion.</p>
            <p>Si vous n'avez pas demandé cette récupération, veuillez ignorer cet email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">Cet email a été envoyé automatiquement par le système BOKELAND SCHOOL SYSTEM.</p>
        </div>
    `;

    const text = `
Récupération de mot de passe

Bonjour,

Vous avez demandé la récupération de votre mot de passe administrateur.

Nom d'utilisateur: ${username}
Mot de passe temporaire: ${temporaryPassword}

IMPORTANT: Ce mot de passe est temporaire. Veuillez le changer dès votre prochaine connexion.

Si vous n'avez pas demandé cette récupération, veuillez ignorer cet email.
    `;

    await sendEmail({
        to: email,
        subject,
        text,
        html,
    });
};

export const sendWelcomeEmail = async (
    email: string,
    schoolName: string,
    username: string
): Promise<void> => {
    const subject = 'Bienvenue - BOKELAND SCHOOL SYSTEM';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008888;">Bienvenue sur BOKELAND SCHOOL SYSTEM</h2>
            <p>Félicitations !</p>
            <p>L'établissement <strong>${schoolName}</strong> a été configuré avec succès.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Votre compte administrateur:</strong></p>
                <p>Nom d'utilisateur: ${username}</p>
                <p>Email: ${email}</p>
            </div>
            <p>Vous pouvez maintenant vous connecter et commencer à gérer votre établissement.</p>
        </div>
    `;
    const text = `Bienvenue sur BOKELAND SCHOOL SYSTEM. L'établissement ${schoolName} a été configuré avec succès. Utilisateur: ${username}.`;

    try {
        await sendEmail({ to: email, subject, text, html });
    } catch (e) {
        console.warn('Welcome email failed', e);
    }
};

export const sendEmailChangeNotification = async (
    email: string,
    username: string,
    newEmail: string
): Promise<void> => {
    const subject = 'Changement de votre adresse email - BOKELAND SCHOOL SYSTEM';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #008888;">Mise à jour de votre compte</h2>
            <p>Bonjour ${username},</p>
            <p>Votre adresse email a été modifiée.</p>
            <p><strong>Nouvelle adresse:</strong> ${newEmail}</p>
            <p>Si vous n'êtes pas à l'origine de ce changement, veuillez contacter le support immédiatement.</p>
        </div>
    `;
    const text = `Bonjour ${username}, votre adresse email a été modifiée pour ${newEmail}.`;

    try {
        await sendEmail({ to: email, subject, text, html });
    } catch (e) {
        console.warn('Email change notification failed', e);
    }
};
