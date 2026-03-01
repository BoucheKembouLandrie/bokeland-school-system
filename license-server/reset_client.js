const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Resetting client to EXPIRED status with old date...\n');

// Set the client to expired with a date in the past
const pastDate = new Date();
pastDate.setDate(pastDate.getDate() - 10); // 10 days ago

db.run(
    'UPDATE clients SET status = ?, subscription_end_date = ? WHERE id = 1',
    ['EXPIRED', pastDate.toISOString()],
    function (err) {
        if (err) {
            console.error('❌ Error:', err);
            db.close();
            return;
        }

        console.log(`✅ Client reset to EXPIRED`);
        console.log(`   New expiration date: ${pastDate.toISOString()}`);
        console.log(`   (10 days in the past)\n`);
        console.log('📝 Now you can test:');
        console.log('   1. Go to admin dashboard');
        console.log('   2. Edit the client');
        console.log('   3. Set status to ACTIVE');
        console.log('   4. Add 100 days');
        console.log('   5. Save');
        console.log('   6. Client should have EXACTLY 100 days!\n');

        db.close();
    }
);
