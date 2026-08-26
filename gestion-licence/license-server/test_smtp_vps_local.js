const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: '127.0.0.1',
    port: 465,
    secure: true,
    auth: {
        user: 'admin@bokelandgroupservices.com',
        pass: 'Bouche@1990'
    },
    tls: {
        rejectUnauthorized: false
    }
});

console.log('Testing Local SMTP connection on VPS (127.0.0.1:465)...');

const mailOptions = {
    from: '"Bokeland" <infos@bokeland.com>',
    to: 'bouchekembou@gmail.com',
    subject: 'Test de délivrabilité Inbox - Bokeland',
    html: '<p>Ceci est un test pour valider la réception directe en boîte de réception suite à la mise à jour du SPF.</p>'
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error('Local SMTP Failed:', error);
    } else {
        console.log('Email sent successfully via local SMTP! Message ID:', info.messageId);
    }
    process.exit();
});
