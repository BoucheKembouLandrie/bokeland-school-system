// Verify all columns exist
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('bokeland_school_system_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: false,
});

async function verifyColumns() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query('SHOW COLUMNS FROM school_settings');
        console.log('\n=== ALL COLUMNS IN school_settings ===');
        results.forEach((col, index) => {
            console.log(`${index + 1}. ${col.Field} (${col.Type})`);
        });
        console.log('\nTotal columns:', results.length);

        // Check for required columns
        const requiredColumns = [
            'country_code', 'country', 'language', 'is_onboarding_complete',
            'license_status', 'license_expiration_date', 'license_check_date', 'date_format'
        ];

        console.log('\n=== REQUIRED COLUMNS CHECK ===');
        requiredColumns.forEach(col => {
            const exists = results.some(r => r.Field === col);
            console.log(`${exists ? '✓' : '✗'} ${col}`);
        });

        await sequelize.close();
    } catch (error) {
        console.error('Error:', error);
        await sequelize.close();
    }
}

verifyColumns();
