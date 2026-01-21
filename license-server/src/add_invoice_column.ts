import { sequelize } from './config/database';

async function migrate() {
    try {
        console.log('Starting migration...');

        // Check if column exists (optional for SQLite, but good practice. For now just try adding it)
        try {
            await sequelize.query('ALTER TABLE Payments ADD COLUMN invoice_number TEXT;');
            console.log('Added invoice_number column.');
        } catch (error: any) {
            if (error.message.includes('duplicate column name')) {
                console.log('Column invoice_number already exists.');
            } else {
                throw error;
            }
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await sequelize.close();
    }
}

migrate();
