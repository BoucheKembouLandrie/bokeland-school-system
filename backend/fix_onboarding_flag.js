const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: console.log
});

async function setOnboardingComplete() {
    try {
        await sequelize.authenticate();
        console.log('Connected to leuana_school_db.');

        const [results] = await sequelize.query(
            "UPDATE school_settings SET is_onboarding_complete = 1 WHERE id > 0"
        );

        console.log('Updated is_onboarding_complete to 1.');

        const [check] = await sequelize.query("SELECT school_name, is_onboarding_complete FROM school_settings LIMIT 1");
        console.log('Verification:', check[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

setOnboardingComplete();
