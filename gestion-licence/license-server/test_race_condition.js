const axios = require('axios');
const machineId = "test-machine-id-" + Date.now();

async function run() {
    console.log("Simulating checkLicense (Request 1)...");
    const req1 = axios.post('http://localhost:5005/api/license/check', {
        machine_id: machineId,
        school_name: "Test School Race",
        email: "school@test.com"
    });

    console.log("Simulating activateTrial (Request 2) with sponsor...");
    const req2 = axios.post('http://localhost:5005/api/license/activate', {
        machine_id: machineId,
        school_name: "Test School Race",
        email: "school@test.com",
        affiliate_email: "sponsor@test.com"
    });

    try {
        const [res1, res2] = await Promise.all([req1, req2]);
        console.log("Req 1 (Check):", res1.data);
        console.log("Req 2 (Activate):", res2.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
}
run();
