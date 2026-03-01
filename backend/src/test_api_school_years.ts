import axios from 'axios';

const run = async () => {
    try {
        console.log("Testing /api/school-years endpoint...");
        const response = await axios.get('http://localhost:5006/api/school-years');
        console.log("Response status:", response.status);
        console.log("First school year data:", JSON.stringify(response.data[0], null, 2));
    } catch (error: any) {
        console.error("Error:", error.message);
    }
};

run();
