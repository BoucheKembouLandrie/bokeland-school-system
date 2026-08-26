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

transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP Server is ready to take messages!');
    }
    process.exit();
});
