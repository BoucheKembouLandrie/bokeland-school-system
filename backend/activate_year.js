const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: console.log
});

async function activateSchoolYear() {
    try {
        await sequelize.authenticate();
        console.log('Connected to leuana_school_db.');

        // Update school year 4 to active
        await sequelize.query("UPDATE school_years SET is_active = 1 WHERE id = 4");
        console.log('Updated school year 4 to ACTIVE.');

        // Check verification
        const [years] = await sequelize.query("SELECT * FROM school_years WHERE id = 4");
        console.log('Verification:', years[0]);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

activateSchoolYear();
