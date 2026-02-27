
import { sequelize } from './models';
import SchoolSettings from './models/SchoolSettings';

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB.");

        await SchoolSettings.destroy({ where: {} });
        console.log("Cleared existing settings.");

        const settings = await SchoolSettings.create({
            school_name: "Test School Manual",
            email: "manual@test.com",
            phone: "690000000",
            country_code: "+237",
            country: "CM",
            address: "Yaounde",
            language: "fr",
            date_format: "DD-MM-YYYY",
            is_onboarding_complete: true, // Bypass onboarding
            license_status: 'TRIAL',
            license_check_date: new Date()
        });

        console.log("Created Settings:", settings.toJSON());

    } catch (error: any) {
        console.error("Error seeding settings:", error);
    } finally {
        await sequelize.close();
    }
};

run();
