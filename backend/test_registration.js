const axios = require('axios');
const { machineId } = require('node-machine-id');

async function testRegistration() {
    try {
        const mId = await machineId();
        console.log('Machine ID:', mId);

        const response = await axios.post('http://localhost:5005/api/license/activate', {
            machine_id: mId,
            school_name: 'boky',
            email: 'bouchekembou@gmail.com',
            phone: '+237 9298334437',
            country: 'Cameroon',
            address: '',
            city: '',
        }, { timeout: 5000 });

        console.log('✓ Registration successful:', response.data);
    } catch (error) {
        console.error('✗ Registration failed:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
    }
}

testRegistration();
