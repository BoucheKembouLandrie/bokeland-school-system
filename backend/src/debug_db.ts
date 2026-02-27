
import { sequelize } from './models';
import SchoolSettings from './models/SchoolSettings';

const run = async () => {
    try {
        console.log("Authenticating...");
        await sequelize.authenticate();
        console.log("Connected.");

        console.log("Listing tables...");
        const tables = await sequelize.getQueryInterface().showAllSchemas();
        console.log("Tables:", tables);

        console.log("Checking columns for school_settings...");
        const columns = await sequelize.getQueryInterface().describeTable('school_settings');
        console.log("Columns:", Object.keys(columns));

        console.log("Checking SchoolSettings...");
        const settings = await SchoolSettings.findAll();
        console.log("Settings found:", settings.length);

    } catch (error: any) {
        console.error("FULL ERROR DETAILS:");
        console.error("Message:", error.message);
        console.error("Name:", error.name);
        console.error("Original:", error.original);
        console.error("Stack:", error.stack);
    } finally {
        await sequelize.close();
    }
};

run();
