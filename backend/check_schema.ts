import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(
    process.env.DB_NAME || 'school_db',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 3306,
        dialect: 'mysql',
        logging: false
    }
);

async function checkSchema() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const queryInterface = sequelize.getQueryInterface();

        console.log('--- Checking table: Classes ---');
        try {
            const columns = await queryInterface.describeTable('Classes');
            console.log('Classes columns:', Object.keys(columns));
            console.log('Classes full details:', columns);
        } catch (e: any) {
            console.error('Error describing Classes (trying lowercase):', e.message);
            try {
                const columns = await queryInterface.describeTable('classes');
                console.log('classes columns:', Object.keys(columns));
                console.log('classes full details:', columns);
            } catch (e2: any) {
                console.error('Error describing classes:', e2.message);
            }
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
