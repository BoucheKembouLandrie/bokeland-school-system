import { sequelize } from './config/database';

async function addMissingColumns() {
    try {
        console.log('Adding missing columns to Payments table...');

        // Add external_reference column if it doesn't exist
        await sequelize.query(`
            ALTER TABLE Payments ADD COLUMN external_reference TEXT;
        `).catch(() => console.log('external_reference column already exists'));

        console.log('✅ Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

addMissingColumns();
