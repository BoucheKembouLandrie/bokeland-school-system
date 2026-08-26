const axios = require('axios');

async function test() {
    try {
        console.log('Sending request to https://licence.bokelandgroupservices.com/api/license/pricing/currencies...');
        const res = await axios.get('https://licence.bokelandgroupservices.com/api/license/pricing/currencies', {
            timeout: 5000
        });
        console.log('Success:', res.status, JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error status:', err.response?.status);
        console.error('Error data:', err.response?.data);
        console.error('Error message:', err.message);
    }
}

test();
