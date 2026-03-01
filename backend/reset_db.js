const mysql = require('mysql2/promise');

async function resetDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Empty password from .env
            port: 3308    // Port 3308 from .env
        });

        console.log('Connected to MySQL server on port 3308');

        // Drop and recreate leuana_school_db
        await connection.query('DROP DATABASE IF EXISTS leuana_school_db');
        console.log('Dropped leuana_school_db');

        await connection.query('CREATE DATABASE leuana_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('Created leuana_school_db');

        await connection.end();
        console.log('✅ Application database reset successfully');
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();
