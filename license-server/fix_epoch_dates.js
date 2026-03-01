const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Fixing clients with epoch date (1969/1970)...\n');

const now = new Date();

db.run(
    `UPDATE clients 
     SET subscription_end_date = ? 
     WHERE subscription_end_date < '1971-01-01'`,
    [now.toISOString()],
    function (err) {
        if (err) {
            console.error('❌ Error:', err);
            db.close();
            return;
        }

        console.log(`✅ Updated ${this.changes} client(s)`);
        console.log(`   New expiration date: ${now.toISOString()}`);
        console.log(`   (Set to today's date)\n`);

        // Show updated clients
        db.all('SELECT id, school_name, subscription_end_date, status FROM clients', [], (err, rows) => {
            if (err) {
                console.error('❌ Error:', err);
            } else {
                console.log('📋 All clients:');
                rows.forEach(row => {
                    const expDate = new Date(row.subscription_end_date);
                    const daysRemaining = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
                    console.log(`   - ${row.school_name}: ${expDate.toLocaleDateString()} (${daysRemaining} days, ${row.status})`);
                });
            }
            db.close();
        });
    }
);
