const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'license.sqlite');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Cleaning License Server Database...');

db.serialize(() => {
    db.run("DELETE FROM payments", (err) => {
        if (err) console.error('Error clearing payments:', err);
        else console.log('✅ Payments cleared');
    });

    db.run("DELETE FROM clients", (err) => {
        if (err) console.error('Error clearing clients:', err);
        else console.log('✅ Clients cleared');
    });

    db.run("DELETE FROM sqlite_sequence WHERE name='clients' OR name='payments'", (err) => {
        if (!err) console.log('✅ ID counters reset');
    });
});

db.close(() => {
    console.log('🏁 License Database clean complete.');
});
