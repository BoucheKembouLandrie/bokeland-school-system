
import axios from 'axios';

const run = async () => {
    try {
        console.log("Checking API status...");
        const baseUrl = 'http://localhost:5006/api';

        try {
            console.log("GET /settings");
            const settings = await axios.get(`${baseUrl}/settings`);
            console.log("Response:", JSON.stringify(settings.data, null, 2));
        } catch (e: any) {
            console.error("Error fetching settings:", e.message);
        }

        try {
            console.log("GET /onboarding/status");
            const status = await axios.get(`${baseUrl}/onboarding/status`);
            console.log("Response:", JSON.stringify(status.data, null, 2));
        } catch (e: any) {
            console.error("Error fetching onboarding status:", e.message);
        }

    } catch (error: any) {
        console.error("Global Error:", error);
    }
};

run();
