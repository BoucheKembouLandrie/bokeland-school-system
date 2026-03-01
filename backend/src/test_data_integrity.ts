
import { sequelize } from './models';
import User from './models/User';
import Class from './models/Class';
import Student from './models/Student';
import SchoolSettings from './models/SchoolSettings';

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");

        const users = await User.findAll();
        console.log(`Users count: ${users.length}`);
        if (users.length > 0) {
            console.log("First User:", users[0].toJSON());
        } else {
            console.log("NO USERS FOUND!");
        }

        const classes = await Class.findAll();
        console.log(`Classes count: ${classes.length}`);

        const students = await Student.findAll();
        console.log(`Students count: ${students.length}`);

        const settings = await SchoolSettings.findOne();
        console.log(`Settings: ${settings ? 'Found' : 'Missing'}`);
        if (settings) {
            console.log(`License Status: ${settings.license_status}`);
        }

    } catch (error: any) {
        console.error("Error checking integrity:", error);
    } finally {
        await sequelize.close();
    }
};

run();
