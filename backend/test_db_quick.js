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

async function testDatabase() {
    try {
        console.log('🔌 Testing database connection...');
        await sequelize.authenticate();
        console.log('✅ Database connected successfully!\n');

        // Test queries
        const [students] = await sequelize.query('SELECT COUNT(*) as count FROM students');
        console.log(`👨‍🎓 Students: ${students[0].count}`);

        const [classes] = await sequelize.query('SELECT COUNT(*) as count FROM classes');
        console.log(`🏫 Classes: ${classes[0].count}`);

        const [teachers] = await sequelize.query('SELECT COUNT(*) as count FROM teachers');
        console.log(`👨‍🏫 Teachers: ${teachers[0].count}`);

        const [payments] = await sequelize.query('SELECT COUNT(*) as count FROM payments');
        console.log(`💰 Payments: ${payments[0].count}`);

        const [schoolYears] = await sequelize.query('SELECT * FROM school_years');
        console.log(`\n📅 School Years: ${schoolYears.length}`);
        schoolYears.forEach(year => {
            console.log(`   - ${year.name} (Active: ${year.isActive})`);
        });

        const [classYears] = await sequelize.query('SELECT DISTINCT annee FROM classes');
        console.log(`\n🏫 Class Years in DB:`);
        classYears.forEach(cy => {
            console.log(`   - ${cy.annee}`);
        });

        await sequelize.close();
        console.log('\n✅ Test completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testDatabase();
