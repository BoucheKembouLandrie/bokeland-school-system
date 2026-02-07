const axios = require('axios');

const API_URL = 'http://localhost:5006/api';
// Use the token from logs
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzcwNDc2NTI3LCJleHAiOjE3NzA1NjI5Mjd9.8zAWIyNoRZY8DJVFZZd6TJeqQ4torMAlYNrB2I-YbPA";

const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'x-school-year-id': '4'
};

async function check() {
    console.log('--- Checking Endpoints for Payments page ---');
    try {
        console.log('1. Fetching Classes...');
        const classes = await axios.get(`${API_URL}/classes`, { headers });
        if (!Array.isArray(classes.data)) {
            console.error('ERROR: classes.data is NOT an array:', typeof classes.data);
        } else {
            console.log(`OK: Got ${classes.data.length} classes.`);
            if (classes.data.length > 0) {
                const c = classes.data[0];
                if (!c.id || !c.libelle || c.pension === undefined) console.error('ERROR: Malformed class:', c);
            }
        }

        console.log('2. Fetching Students...');
        const students = await axios.get(`${API_URL}/students`, { headers });
        if (!Array.isArray(students.data)) {
            console.error('ERROR: students.data is NOT an array:', typeof students.data);
        } else {
            console.log(`OK: Got ${students.data.length} students.`);
            if (students.data.length > 0) {
                const s = students.data[0];
                if (!s.id || !s.nom || !s.prenom || !s.classe_id) console.error('ERROR: Malformed student:', s);
            }
        }

        console.log('3. Fetching Payments...');
        const payments = await axios.get(`${API_URL}/payments`, { headers });
        if (!Array.isArray(payments.data)) {
            console.error('ERROR: payments.data is NOT an array:', typeof payments.data);
        } else {
            console.log(`OK: Got ${payments.data.length} payments.`);
            if (payments.data.length > 0) {
                const p = payments.data[0];
                if (!p.id || !p.eleve_id || !p.montant || !p.date_paiement) console.error('ERROR: Malformed payment:', p);
            }
        }

    } catch (e) {
        console.error('API Error:', e.message);
        if (e.response) console.error('Response:', e.response.status, e.response.data);
    }
}

check();
