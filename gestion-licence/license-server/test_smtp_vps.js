const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mail.bokeland.com',
    port: 465,
    secure: true,
    auth: {
        user: 'infos@bokeland.com',
        pass: 'Bouche@1990'
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('Testing SMTP connection from VPS to mail.bokeland.com:465...');

transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Verification Failed on VPS:', error);
    } else {
        console.log('SMTP Verification Succeeded on VPS! Connection is fully ready.');
    }
    process.exit();
});
