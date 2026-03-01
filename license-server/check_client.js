require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkClient() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        port: 3307,
        user: 'root',
        password: '',
        database: 'leuana_school'
    });

    console.log('✅ Connected to database\n');

    // Get the most recent client
    const [clients] = await connection.execute(
        'SELECT * FROM clients ORDER BY id DESC LIMIT 1'
    );

    if (clients.length === 0) {
        console.log('❌ No clients found');
        return;
    }

    const client = clients[0];
    console.log('📋 CLIENT INFO:');
    console.log(`   ID: ${client.id}`);
    console.log(`   School: ${client.school_name}`);
    console.log(`   Status: ${client.status}`);
    console.log(`   Expiration: ${client.subscription_end_date}`);

    const now = new Date();
    const expDate = new Date(client.subscription_end_date);
    const isExpired = expDate < now;
    const daysRemaining = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));

    console.log(`   Is Expired: ${isExpired}`);
    console.log(`   Days Remaining: ${daysRemaining}\n`);

    // Get payment history
    const [payments] = await connection.execute(
        'SELECT * FROM payments WHERE client_id = ? ORDER BY payment_date DESC LIMIT 5',
        [client.id]
    );

    console.log(`💰 PAYMENT HISTORY (last 5):`);
    payments.forEach((p, i) => {
        console.log(`   ${i + 1}. Date: ${p.payment_date} | Days: ${p.days_added} | Amount: ${p.amount}`);
    });

    await connection.end();
}

checkClient().catch(console.error);
