import { sequelize } from './src/models/index';

async function forceAlter() {
    try {
        await sequelize.authenticate();
        console.log('Connected.');

        const queryInterface = sequelize.getQueryInterface();

        // Add columns directly using SQL or queryInterface
        // matricule
        try {
            console.log('Adding matricule...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN matricule VARCHAR(255) AFTER id");
        } catch (e: any) { console.log('Matricule exists or error:', e.message); }

        // sexe
        try {
            console.log('Adding sexe...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN sexe VARCHAR(10)");
        } catch (e: any) { console.log('Sexe exists or error:', e.message); }

        // adresse
        try {
            console.log('Adding adresse...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN adresse TEXT");
        } catch (e: any) { console.log('Adresse exists or error:', e.message); }

        // parent_tel
        try {
            console.log('Adding parent_tel...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN parent_tel VARCHAR(255)");
        } catch (e: any) { console.log('parent_tel exists or error:', e.message); }

        // category
        try {
            console.log('Adding category...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN category VARCHAR(50) DEFAULT 'NON AFFECTE'");
        } catch (e: any) { console.log('category exists or error:', e.message); }

        // date_inscription
        try {
            console.log('Adding date_inscription...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN date_inscription DATETIME");
        } catch (e: any) { console.log('date_inscription exists or error:', e.message); }

        // date_naissance (often needed)
        try {
            console.log('Adding date_naissance...');
            await sequelize.query("ALTER TABLE Students ADD COLUMN date_naissance DATE");
        } catch (e: any) { console.log('date_naissance exists or error:', e.message); }

        console.log('Manual alteration complete.');

    } catch (error) {
        console.error('Fatal error:', error);
    } finally {
        await sequelize.close();
    }
}

forceAlter();
