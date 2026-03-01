
const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

// Configurer manuellement l'environnement
dotenv.config({ path: path.join(__dirname, '.env') });

const sequelize = require('./src/config/database').default;

// Importer les modèles comme dans l'app
// Attention: ts-node est nécessaire pour importer les .ts directement
// Mais ici on va essayer d'importer les fichiers compilés ou utiliser ts-node
// On va supposer qu'on lance avec ts-node

async function testModels() {
    try {
        console.log('Testing Model Loading...');

        // Dynamic imports to match how controllers do it generally
        const Student = require('./src/models/Student').default;
        const Class = require('./src/models/Class').default;
        const Subject = require('./src/models/Subject').default;
        const Teacher = require('./src/models/Teacher').default;
        const SchoolYear = require('./src/models/SchoolYear').default;

        // Import associations
        require('./src/models/index');

        console.log('✅ Models imported successfully.');

        // Test Class query with Student include (Fail point?)
        console.log('Testing Class.findAll with Student include...');
        try {
            const classes = await Class.findAll({
                limit: 1,
                include: [{ model: Student, as: 'students' }]
            });
            console.log(`✅ Class query success. Found: ${classes.length}`);
        } catch (err: any) {
            console.error('❌ Class query FAILED:', err.message);
            console.error(err);
        }

        // Test Subject query
        console.log('Testing Subject.findAll...');
        try {
            const subjects = await Subject.findAll({ limit: 1 });
            console.log(`✅ Subject query success. Found: ${subjects.length}`);
        } catch (err: any) {
            console.error('❌ Subject query FAILED:', err.message);
        }

    } catch (error: any) {
        console.error('❌ Global script error:', error);
    } finally {
        await sequelize.close();
    }
}

testModels();
