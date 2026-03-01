const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('📋 RAW DATABASE CONTENT:\n');

db.all('SELECT * FROM clients', [], (err, rows) => {
    if (err) {
        console.error('❌ Error:', err);
        db.close();
        return;
    }

    console.log('Number of clients:', rows.length);
    console.log('\nFull client data:');
    rows.forEach((row, i) => {
        console.log(`\n--- Client ${i + 1} ---`);
        console.log(JSON.stringify(row, null, 2));
    });

    db.close();
});
