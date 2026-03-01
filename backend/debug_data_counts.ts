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

async function checkCounts() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        const tables = ['Staff', 'Schedules', 'Students', 'Classes'];

        for (const table of tables) {
            console.log(`--- Counts for ${table} ---`);
            try {
                // Check if table uses 'school_year_id'
                const [results] = await sequelize.query(`
                    SELECT school_year_id, COUNT(*) as count 
                    FROM ${table} 
                    GROUP BY school_year_id
                `);
                console.log(results);
            } catch (e: any) {
                // Try lowercase if uppercase fails
                try {
                    const [results] = await sequelize.query(`
                        SELECT school_year_id, COUNT(*) as count 
                        FROM ${table.toLowerCase()} 
                        GROUP BY school_year_id
                    `);
                    console.log(results);
                } catch (e2: any) {
                    console.error(`Error querying ${table}:`, e2.message);
                }
            }
        }


        console.log('--- Inspecting Student Names for Encoding ---');
        const [students] = await sequelize.query("SELECT id, nom, prenom FROM Students LIMIT 5");
        console.log(students);

        console.log('--- Inspecting Schedules Details ---');
        const [schedules] = await sequelize.query("SELECT id, classe_id, subject_id, day_of_week, start_time, end_time FROM Schedules");
        console.log(schedules);

    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await sequelize.close();
    }
}

checkCounts();
