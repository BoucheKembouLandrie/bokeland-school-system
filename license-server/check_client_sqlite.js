const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('✅ Connected to SQLite database\n');

db.get('SELECT * FROM clients ORDER BY id DESC LIMIT 1', [], (err, client) => {
    if (err) {
        console.error('❌ Error:', err);
        return;
    }

    if (!client) {
        console.log('❌ No clients found');
        db.close();
        return;
    }

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
    db.all('SELECT * FROM payments WHERE client_id = ? ORDER BY payment_date DESC LIMIT 5', [client.id], (err, payments) => {
        if (err) {
            console.error('❌ Error:', err);
            db.close();
            return;
        }

        console.log(`💰 PAYMENT HISTORY (last 5):`);
        if (payments.length === 0) {
            console.log('   No payments found');
        } else {
            payments.forEach((p, i) => {
                console.log(`   ${i + 1}. Date: ${p.payment_date} | Days: ${p.days_added} | Amount: ${p.amount}`);
            });
        }

        db.close();
    });
});
