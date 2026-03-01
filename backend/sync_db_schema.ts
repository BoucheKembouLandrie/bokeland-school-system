import { sequelize } from './src/models/index';

async function syncSchema() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        console.log('Syncing database (alter: true)...');
        await sequelize.sync({ alter: true });
        console.log('Database synced successfully.');

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

syncSchema();
