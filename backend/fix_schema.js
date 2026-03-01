const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3308,
    user: 'leuana',
    password: 'leuana123',
    database: 'bokeland_school_system_db'
});

const alterQueries = [
    "ALTER TABLE school_settings ADD COLUMN license_status VARCHAR(255) DEFAULT 'TRIAL';",
    "ALTER TABLE school_settings ADD COLUMN license_expiration_date DATETIME;",
    "ALTER TABLE school_settings ADD COLUMN license_check_date DATETIME;",
    "ALTER TABLE school_settings ADD COLUMN date_format VARCHAR(255) DEFAULT 'dd/mm/yyyy';"
];

connection.connect((err) => {
    if (err) {
        console.error('Connection failed:', err);
        return;
    }
    console.log('Connected to DB. Fixing schema...');

    let queriesRun = 0;
    alterQueries.forEach(query => {
        connection.query(query, (error) => {
            if (error) console.error('Query failed:', error.message);
            else console.log('Executed:', query);

            queriesRun++;
            if (queriesRun === alterQueries.length) {
                console.log('All schema fixes applied.');
                connection.end();
            }
        });
    });
});
