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

async function fixClassYears() {
    try {
        console.log('🔧 Fixing class years...\n');

        // Get the school year (there should be only one)
        const [schoolYears] = await sequelize.query('SELECT * FROM school_years LIMIT 1');

        if (schoolYears.length === 0) {
            console.log('❌ No school year found in database!');
            process.exit(1);
        }

        const yearName = schoolYears[0].name;

        console.log(`📅 School year: ${yearName}\n`);

        // Check current state
        const [classesBefore] = await sequelize.query('SELECT id, nom, annee FROM classes');
        console.log('📊 Current classes:');
        classesBefore.forEach(c => {
            console.log(`   - ${c.nom} (Year: "${c.annee || 'NULL'}")`);
        });

        // Update all classes to have the active school year
        const [result] = await sequelize.query(
            `UPDATE classes SET annee = ? WHERE annee IS NULL OR annee = ''`,
            { replacements: [yearName] }
        );

        console.log(`\n✅ Updated ${result.affectedRows} classes to year "${yearName}"\n`);

        // Verify
        const [classesAfter] = await sequelize.query('SELECT id, nom, annee FROM classes');
        console.log('📊 Updated classes:');
        classesAfter.forEach(c => {
            console.log(`   - ${c.nom} (Year: "${c.annee}")`);
        });

        await sequelize.close();
        console.log('\n✅ Fix completed!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixClassYears();
