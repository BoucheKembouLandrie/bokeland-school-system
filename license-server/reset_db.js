const mysql = require('mysql2/promise');

async function resetLicenseDatabase() {
    try {
        // Try connecting with empty password first, default port 3306 (or 3308 if they share the same instance)
        // Given backend uses 3308, license server might too if on same machine/XAMPP
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            port: 3308 // Assuming same MySQL instance
        });

        console.log('Connected to MySQL server');

        // Drop and recreate license_server_db
        await connection.query('DROP DATABASE IF EXISTS license_server_db');
        console.log('Dropped license_server_db');

        await connection.query('CREATE DATABASE license_server_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
        console.log('Created license_server_db');

        await connection.end();
        console.log('✅ License server database reset successfully');
    } catch (error) {
        console.error('❌ Error resetting license database:', error);
        process.exit(1);
    }
}

resetLicenseDatabase();
