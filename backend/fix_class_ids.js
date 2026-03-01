const { Sequelize, DataTypes } = require('sequelize');

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

async function fixClasses() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        // 1. Get Active Year
        const years = await SchoolYear.findAll();
        const activeYear = years.find(y => y.is_active) || years[0];

        if (!activeYear) {
            console.error('No school year found');
            return;
        }

        console.log(`Target Year: ${activeYear.name} (ID: ${activeYear.id})`);

        // 2. Find Classes with mismatch
        const classes = await Class.findAll();
        let updatedCount = 0;

        for (const cls of classes) {
            // Match logic: strict equality on string name
            if (cls.annee === activeYear.name && cls.school_year_id !== activeYear.id) {
                console.log(`Fixing Class ${cls.libelle} (ID: ${cls.id})... setting school_year_id to ${activeYear.id}`);

                cls.school_year_id = activeYear.id;
                await cls.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 Fixed ${updatedCount} classes.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

fixClasses();
