const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const dbConfig = {
    host: '127.0.0.1',
    port: 3308,
    user: 'leuana',
    password: 'leuana123',
    database: 'bokeland_school_system_db'
};

async function fixUsers() {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to DB.');

    try {
        // 1. Fix Schema
        const alterQueries = [
            "ALTER TABLE users ADD COLUMN role ENUM('admin', 'secretary', 'teacher') DEFAULT 'secretary';",
            "ALTER TABLE users ADD COLUMN is_default BOOLEAN DEFAULT false;",
            "ALTER TABLE users ADD COLUMN permissions JSON;",
            "ALTER TABLE users ADD COLUMN email VARCHAR(255);",
            "ALTER TABLE users ADD COLUMN teacher_id INTEGER;",
            "ALTER TABLE users ADD COLUMN createdAt DATETIME DEFAULT CURRENT_TIMESTAMP;",
            "ALTER TABLE users ADD COLUMN updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"
        ];

        for (const query of alterQueries) {
            try {
                await connection.query(query);
                console.log('Executed:', query);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log('Column already exists (skipped):', query);
                } else {
                    console.error('Schema Error:', err.message);
                }
            }
        }

        // 2. Create/Reset Admin
        const username = 'admin';
        const rawPassword = 'admin123'; // Temporary password
        const hashedPassword = await bcrypt.hash(rawPassword, 10);

        const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            // Update existing
            await connection.query('UPDATE users SET password = ?, role = ? WHERE username = ?', [hashedPassword, 'admin', username]);
            console.log(`Admin user '${username}' updated. Password reset to '${rawPassword}'.`);
        } else {
            // Create new
            await connection.query('INSERT INTO users (username, password, role, is_default, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
                [username, hashedPassword, 'admin', true]);
            console.log(`Admin user '${username}' created. Password is '${rawPassword}'.`);
        }

    } catch (error) {
        console.error('Fatal Error:', error);
    } finally {
        await connection.end();
    }
}

fixUsers();
