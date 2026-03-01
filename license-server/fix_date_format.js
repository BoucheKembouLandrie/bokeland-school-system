const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Fixing date format to match SQLite format...\n');

// SQLite expects: "YYYY-MM-DD HH:MM:SS.mmm +00:00"
const now = new Date();
const sqliteFormat = now.toISOString().replace('T', ' ').replace('Z', ' +00:00');

console.log(`Converting to SQLite format: ${sqliteFormat}\n`);

db.run(
    'UPDATE clients SET subscription_end_date = ? WHERE id = 1',
    [sqliteFormat],
    function (err) {
        if (err) {
            console.error('❌ Error:', err);
            db.close();
            return;
        }

        console.log(`✅ Updated client`);

        // Verify
        db.get('SELECT * FROM clients WHERE id = 1', [], (err, row) => {
            if (err) {
                console.error('❌ Error:', err);
            } else {
                console.log('\n📋 Updated client data:');
                console.log(`   subscription_end_date: ${row.subscription_end_date}`);
                console.log(`   trial_start_date: ${row.trial_start_date}`);
                console.log('\n✅ Both dates now in same format!');
            }
            db.close();
        });
    }
);
