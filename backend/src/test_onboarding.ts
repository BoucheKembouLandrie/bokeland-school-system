
import axios from 'axios';

const run = async () => {
    try {
        console.log("Sending onboarding request...");
        const response = await axios.post('http://localhost:5006/api/onboarding/complete', {
            school_name: "Test School Debug",
            school_year: "2025-2026",
            email: "debug@test.com",
            phone: "123456789",
            country_code: "+237",
            country: "CM",
            address: "Debug Address",
            language: "fr"
        });
        console.log("Success:", response.data);
    } catch (error: any) {
        console.error("Error:", error.response?.data || error.message);
    }
};

run();
