const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');

// Configuration
const sequelize = new Sequelize(
    'bokeland_school_system_db',
    'root',
    '',
    {
        host: 'localhost',
        port: 3308,
        dialect: 'mysql',
        logging: false,
    }
);

// Define simplified models
const SchoolYear = sequelize.define('school_years', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    name: DataTypes.STRING,
    is_active: DataTypes.BOOLEAN
}, { timestamps: false });

const Class = sequelize.define('classes', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    libelle: DataTypes.STRING,
    annee: DataTypes.STRING,
    school_year_id: DataTypes.INTEGER
}, { timestamps: false });

const Student = sequelize.define('students', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    school_year_id: DataTypes.INTEGER
}, { timestamps: false });

async function checkData() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        // 1. Check School Years
        const years = await SchoolYear.findAll();
        console.log('\n📅 School Years:');
        years.forEach(y => console.log(`   - ID: ${y.id}, Name: "${y.name}", Active: ${y.is_active}`));

        if (years.length === 0) {
            console.error('❌ No School Years found!');
            return;
        }

        const activeYear = years.find(y => y.is_active) || years[0];
        console.log(`\n👉 Assuming Current Year is: "${activeYear.name}" (ID: ${activeYear.id})`);

        // 2. Check Classes linked to this year
        const classes = await Class.findAll();
        console.log(`\n🏫 Total Classes: ${classes.length}`);

        const validClasses = classes.filter(c => c.school_year_id === activeYear.id);
        const validClassesByName = classes.filter(c => c.annee === activeYear.name);

        console.log(`   - Linked by ID (${activeYear.id}): ${validClasses.length}`);
        console.log(`   - Linked by Name ("${activeYear.name}"): ${validClassesByName.length}`);

        if (classes.length > 0 && validClasses.length === 0) {
            console.warn('⚠️ Classes have mismatching school_year_id!');
            classes.slice(0, 3).forEach(c => console.log(`   Sample Class: ID ${c.id}, school_year_id: ${c.school_year_id}, annee: "${c.annee}"`));
        }

        // 3. Check Students linked to this year
        const students = await Student.findAll();
        console.log(`\n👨‍🎓 Total Students: ${students.length}`);

        const validStudents = students.filter(s => s.school_year_id === activeYear.id);
        console.log(`   - Linked by ID (${activeYear.id}): ${validStudents.length}`);

        if (students.length > 0 && validStudents.length === 0) {
            console.warn('⚠️ Students have mismatching school_year_id!');
            students.slice(0, 3).forEach(s => console.log(`   Sample Student: ID ${s.id}, school_year_id: ${s.school_year_id}, Name: ${s.nom}`));
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkData();
