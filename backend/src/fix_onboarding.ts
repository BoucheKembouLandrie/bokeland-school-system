
import { sequelize } from './models';
import SchoolSettings from './models/SchoolSettings';

const run = async () => {
    try {
        console.log("Authenticating...");
        await sequelize.authenticate();
        console.log("Connected.");

        const settings = await SchoolSettings.findOne();
        if (settings) {
            console.log("Current status:", settings.toJSON());
            console.log("Updating is_onboarding_complete to TRUE...");
            // @ts-ignore
            await settings.update({ is_onboarding_complete: true });
            console.log("Updated.");
        } else {
            console.log("No settings found. Creating default...");
            await SchoolSettings.create({
                school_name: "Bokeland School",
                // @ts-ignore
                is_onboarding_complete: true
            });
            console.log("Created default settings.");
        }

    } catch (error: any) {
        console.error("Error:", error);
    } finally {
        await sequelize.close();
    }
};

run();
