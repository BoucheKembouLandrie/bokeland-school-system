const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'bokeland_school_system_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3308,
        dialect: 'mysql',
        logging: false,
    }
);

async function checkSchoolSettings() {
    try {
        console.log('🔍 Checking school_settings table...\n');

        // Check if table exists
        const [tables] = await sequelize.query("SHOW TABLES LIKE 'school_settings'");

        if (tables.length === 0) {
            console.log('❌ Table school_settings does NOT exist!');
            console.log('Creating table...\n');

            await sequelize.query(`
                CREATE TABLE IF NOT EXISTS school_settings (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    school_name VARCHAR(255),
                    email VARCHAR(255),
                    phone VARCHAR(50),
                    address TEXT,
                    license_status VARCHAR(50) DEFAULT 'NOT_REGISTERED',
                    license_expiration_date DATETIME,
                    license_check_date DATETIME,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);

            console.log('✅ Table created!');

            // Insert default row
            await sequelize.query(`
                INSERT INTO school_settings (school_name, license_status)
                VALUES ('BOKELAND SCHOOL SYSTEM', 'TRIAL')
            `);

            console.log('✅ Default settings inserted!\n');
        } else {
            console.log('✅ Table school_settings exists\n');
        }

        // Check contents
        const [rows] = await sequelize.query('SELECT * FROM school_settings');
        console.log('📊 Current settings:');
        console.log(JSON.stringify(rows, null, 2));

        await sequelize.close();
        console.log('\n✅ Check completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkSchoolSettings();
