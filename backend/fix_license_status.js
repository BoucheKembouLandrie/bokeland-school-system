const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: console.log
});

async function fixLicenseStatus() {
    try {
        await sequelize.authenticate();
        console.log('Connected to leuana_school_db.');

        // Check current status
        const [current] = await sequelize.query("SELECT * FROM school_settings LIMIT 1");
        console.log('Current Settings:', current[0]);

        // Update to ACTIVE
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);

        await sequelize.query(
            "UPDATE school_settings SET license_status = 'ACTIVE', license_expiration_date = :expDate, is_onboarding_complete = 1 WHERE id > 0",
            {
                replacements: { expDate: nextYear }
            }
        );

        console.log('Updated license_status to ACTIVE and expiration date.');

        const [check] = await sequelize.query("SELECT school_name, license_status, is_onboarding_complete FROM school_settings LIMIT 1");
        console.log('Verification:', check[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixLicenseStatus();
