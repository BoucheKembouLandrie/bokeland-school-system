const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('leuana_school_db', 'root', '', {
    host: 'localhost',
    port: 3308,
    dialect: 'mysql',
    logging: false
});

async function debugSchoolYears() {
    try {
        await sequelize.authenticate();
        console.log('Connected to leuana_school_db.');

        // Check School Years
        const [years] = await sequelize.query("SELECT * FROM school_years");
        console.log('\nSchool Years:');
        console.table(years);

        // Check Students distribution by School Year
        const [distribution] = await sequelize.query(`
            SELECT school_year_id, COUNT(*) as count 
            FROM students 
            GROUP BY school_year_id
        `);
        console.log('\nStudent Distribution by Year:');
        console.table(distribution);

        // Check Global Settings current year
        // const [settings] = await sequelize.query("SELECT current_school_year_id FROM school_settings LIMIT 1");
        // console.log('\nSettings Current Year ID:', settings[0]?.current_school_year_id || 'N/A');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

debugSchoolYears();
