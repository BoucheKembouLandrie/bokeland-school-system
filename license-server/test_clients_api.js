const axios = require('axios');

async function testClientsAPI() {
    try {
        const response = await axios.get('http://localhost:5005/api/admin/clients');
        console.log('✓ API Response:');
        console.log(JSON.stringify(response.data, null, 2));
        console.log(`\nTotal clients returned: ${response.data.length}`);
    } catch (error) {
        console.error('✗ API Error:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testClientsAPI();
