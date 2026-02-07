const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3308,
    user: 'leuana',
    password: 'leuana123',
    database: 'bokeland_school_system_db'
});

console.log('Testing connection...');

connection.connect((err) => {
    if (err) {
        console.error('Connection failed: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);

    connection.query('SELECT * FROM school_years', (error, results) => {
        if (error) throw error;
        console.log('School Years found:', results.length);
        console.log(results);
        connection.end();
    });
});
