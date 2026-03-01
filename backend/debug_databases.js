const { Sequelize } = require('sequelize');

const config = {
    username: 'root',
    password: '',
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: false
};

async function checkDatabases() {
    // Connect without specific DB to list all
    const sequelize = new Sequelize('', config.username, config.password, config);

    try {
        console.log('Connecting...');
        await sequelize.authenticate();
        console.log('Connected.');

        const [results] = await sequelize.query('SHOW DATABASES');
        console.log('\nAvailable Databases:');
        results.forEach(db => console.log(`- ${db.Database}`));

        // Check "leuana_school" (if exists)
        if (results.some(db => db.Database === 'leuana_school')) {
            console.log('\nChecking "leuana_school"...');
            await checkTable(sequelize, 'leuana_school');
        }

        // Check "leuana_school_db" (if exists)
        if (results.some(db => db.Database === 'leuana_school_db')) {
            console.log('\nChecking "leuana_school_db"...');
            await checkTable(sequelize, 'leuana_school_db');
        }

        // Check "bokeland_school_system_db" (if exists)
        if (results.some(db => db.Database === 'bokeland_school_system_db')) {
            console.log('\nChecking "bokeland_school_system_db"...');
            await checkTable(sequelize, 'bokeland_school_system_db');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

async function checkTable(sequelize, dbName) {
    try {
        const [rows] = await sequelize.query(`SELECT count(*) as count FROM ${dbName}.school_settings`);
        console.log(`- ${dbName}.school_settings rows: ${rows[0].count}`);

        const [settings] = await sequelize.query(`SELECT school_name, is_onboarding_complete FROM ${dbName}.school_settings LIMIT 1`);
        if (settings.length > 0) {
            console.log(`- School Name: ${settings[0].school_name}`);
            console.log(`- Is Onboarding Complete: ${settings[0].is_onboarding_complete}`);
        } else {
            console.log(`- No settings found.`);
        }

        const [students] = await sequelize.query(`SELECT count(*) as count FROM ${dbName}.students`);
        console.log(`- ${dbName}.students count: ${students[0].count}`);

    } catch (e) {
        console.log(`- Error checking ${dbName}: ${e.message}`);
    }
}

checkDatabases();
