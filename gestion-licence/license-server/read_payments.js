const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'license.sqlite');
console.log('Opening DB:', dbPath);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error('Error opening DB:', err.message);
        return;
    }
    console.log('Connected to SQLite.');
});

db.all('SELECT * FROM Payments ORDER BY id DESC LIMIT 20', [], (err, rows) => {
    if (err) {
        console.error('Error querying payments:', err.message);
        return;
    }
    console.log('Last 20 payments:');
    console.table(rows);
    db.close();
});
