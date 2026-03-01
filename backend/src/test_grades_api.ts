
import axios from 'axios';

const BASE_URL = 'http://localhost:5006/api';

const run = async () => {
    try {
        console.log("0. Authenticating...");
        const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
            username: "admin",
            password: "Admin@123"
        });
        const token = loginRes.data.token;
        console.log("Authenticated. Token acquired.");

        const headers = {
            Authorization: `Bearer ${token}`,
            'x-school-year-id': '1' // Found in school years check
        };

        console.log("1. Fetching Classes...");
        const classesRes = await axios.get(`${BASE_URL}/classes`, { headers });
        console.log(`Classes found: ${classesRes.data.length}`);
        const class6 = classesRes.data.find((c: any) => c.libelle.toLowerCase().includes('6'));
        if (!class6) throw new Error("Class '6ieme' not found");
        console.log(`Selected Class: ${class6.libelle} (ID: ${class6.id})`);

        console.log("2. Fetching Evaluations...");
        const evalsRes = await axios.get(`${BASE_URL}/evaluations`, { headers });
        console.log(`Evaluations found: ${evalsRes.data.length}`);
        const evalSeq1 = evalsRes.data.find((e: any) => e.nom.toLowerCase().includes('séquence 1'));
        if (!evalSeq1) {
            console.log("Warning: 'Séquence 1' not found, using first evaluation if available");
        }
        const selectedEval = evalSeq1 || evalsRes.data[0];
        console.log(`Selected Evaluation: ${selectedEval?.nom} (ID: ${selectedEval?.id})`);

        console.log(`3. Fetching Students for Class ${class6.id}...`);
        const studentsRes = await axios.get(`${BASE_URL}/students?classe_id=${class6.id}`, { headers });
        console.log(`Students found: ${studentsRes.data.length}`);
        const student = studentsRes.data[0];
        if (!student) throw new Error("No students found in class");
        console.log(`Selected Student: ${student.nom} ${student.prenom} (ID: ${student.id})`);

        console.log(`4. Fetching Subjects for Class ${class6.id}...`);
        try {
            const subjectsRes = await axios.get(`${BASE_URL}/subjects?classe_id=${class6.id}`, { headers });
            console.log(`Subjects found: ${subjectsRes.data.length}`);
        } catch (err: any) {
            console.error("FAIL: /subjects endpoint failed");
            console.error(err.response?.data || err.message);
        }

        console.log(`5. Fetching Grades for Student ${student.id} and Eval ${selectedEval.id}...`);
        try {
            const gradesRes = await axios.get(`${BASE_URL}/notes`, {
                params: {
                    eleve_id: student.id,
                    evaluation_id: selectedEval.id
                },
                headers
            });
            console.log(`Grades found: ${gradesRes.data.length}`);
            if (gradesRes.data.length > 0) {
                const firstGrade = gradesRes.data[0];
                console.log('First Grade Object Keys:', Object.keys(firstGrade));
                console.log('First Grade Object Values:', {
                    id: firstGrade.id,
                    note: firstGrade.note,
                    formatted_note: firstGrade.note?.toString(),
                    observation: firstGrade.observation
                });
            }
        } catch (err: any) {
            console.error("FAIL: /notes endpoint failed");
            console.error(err.response?.data || err.message);
        }

    } catch (error: any) {
        console.error("General Error:", error.message);
        console.error(error.response?.data);
    }
};

run();
