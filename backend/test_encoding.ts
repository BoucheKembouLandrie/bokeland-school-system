import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

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

async function testEncoding() {
    try {
        await sequelize.authenticate();
        console.log('Connection established.');

        // Create a temporary table or just use existing one? 
        // Safer to use existing Student model but raw query is faster for test
        // We will insert into Students

        const testName = "Hélène";
        const testPrenom = "Noël";

        console.log(`Inserting: ${testName} ${testPrenom}`);

        const [id] = await sequelize.query(
            `INSERT INTO Students (
                nom, prenom, school_year_id, category, 
                matricule, sexe, date_naissance, adresse, parent_tel, date_inscription,
                createdAt, updatedAt
            ) VALUES (
                :nom, :prenom, 4, 'TEST',
                'TEST-001', 'M', '2010-01-01', 'Rue Test', '00000000', NOW(),
                NOW(), NOW()
            )`,
            {
                replacements: { nom: testName, prenom: testPrenom }
            }
        );

        console.log('Insert ID:', id);

        const [results] = await sequelize.query(
            `SELECT * FROM Students WHERE id = :id`,
            {
                replacements: { id: id }
            }
        );

        console.log('Retrieved:', results);

        // Clean up
        await sequelize.query(`DELETE FROM Students WHERE id = :id`, { replacements: { id: id } });
        console.log('Cleaned up test record.');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await sequelize.close();
    }
}

testEncoding();
