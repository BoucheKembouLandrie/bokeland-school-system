import axios from 'axios';

const run = async () => {
    try {
        console.log("Testing attendance API...");
        const baseUrl = 'http://localhost:5006/api';

        // Test 1: POST without school_year_id header
        try {
            console.log("\n1. POST /attendance WITHOUT school_year_id header:");
            const response = await axios.post(`${baseUrl}/attendance`, {
                date: '2026-02-16',
                eleve_id: 1,
                statut: 'retard',
                motif: 'absence justifiée',
                time: '08:30'
            });
            console.log("Success:", response.data);
        } catch (e: any) {
            console.error("Error:", e.response?.status, e.response?.data);
        }

        // Test 2: POST with school_year_id header
        try {
            console.log("\n2. POST /attendance WITH school_year_id header:");
            const response = await axios.post(`${baseUrl}/attendance`, {
                date: '2026-02-16',
                eleve_id: 1,
                statut: 'retard',
                motif: 'absence justifiée',
                time: '08:30'
            }, {
                headers: {
                    'x-school-year-id': '1'
                }
            });
            console.log("Success:", response.data);
        } catch (e: any) {
            console.error("Error:", e.response?.status, e.response?.data);
        }

    } catch (error: any) {
        console.error("Global Error:", error.message);
    }
};

run();
