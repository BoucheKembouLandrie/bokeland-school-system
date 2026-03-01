
import axios from 'axios';
import { sequelize } from './src/models';

const API_URL = 'http://localhost:5006/api';

async function testTransfer() {
    try {
        console.log('--- Starting Transfer Test ---');

        // 1. Get a token (login as admin)
        // assuming standard admin credentials or hash from DB
        // For simplicity, let's try to hit the endpoint if we have a way to auth or just use a known token?
        // Actually, better to use the internal controller logic directly if possible, OR login first.

        // Let's force a login
        // Check if we have a user
        const { User, SchoolYear, Class } = require('./src/models');

        // Ensure DB connection
        await sequelize.authenticate();
        console.log('DB Connected');

        // Find Years
        const years = await SchoolYear.findAll();
        console.log('Years:', years.map((y: any) => ({ id: y.id, name: y.name })));

        if (years.length < 2) {
            console.error('Not enough years to test transfer');
            return;
        }

        const sourceYear = years.find((y: any) => y.isActive) || years[0];
        const destYear = years.find((y: any) => y.id !== sourceYear.id);

        console.log(`Source: ${sourceYear.name} (${sourceYear.id}) -> Dest: ${destYear.name} (${destYear.id})`);

        // Find a class in source year
        let sourceClass = await Class.findOne({ where: { school_year_id: sourceYear.id } });
        if (!sourceClass) {
            console.log('Creating dummy source class...');
            // Need to provide title here too if creating new class!
            sourceClass = await Class.create({
                libelle: 'TEST-TRANSFER-CLASS',
                niveau: '6eme',
                annee: sourceYear.name,
                school_year_id: sourceYear.id,
                title: 'TEST-TRANSFER-CLASS' // Also needed for creation if column exists!
            });
        }
        console.log('Source Class:', sourceClass.toJSON());

        // Perform Transfer Request via Axios to test Route & Controller
        // We need a token. 
        // Let's simulate the controller call DIRECTLY to avoid auth issues in this script
        // by mocking req/res

        const { transferClasses } = require('./src/controllers/classController');

        const req = {
            headers: { 'x-school-year-id': sourceYear.id },
            body: {
                classIds: [sourceClass.id],
                destYearId: destYear.id
            }
        };

        const res = {
            json: (data: any) => console.log('RESPONSE JSON:', data),
            status: (code: number) => {
                console.log('RESPONSE STATUS:', code);
                return { json: (data: any) => console.log('RESPONSE JSON (after status):', data) };
            }
        };

        console.log('Calling controller directly...');
        await transferClasses(req, res);

    } catch (error) {
        console.error('TEST ERROR:', error);
    } finally {
        await sequelize.close();
    }
}

testTransfer();
