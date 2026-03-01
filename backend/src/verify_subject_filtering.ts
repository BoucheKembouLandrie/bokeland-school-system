
const API_URL = 'http://localhost:5006/api';

async function verify() {
    try {
        console.log("Attempting Login...");
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'admin', password: 'password' })
        });

        let data = await loginRes.json();
        if (!loginRes.ok) {
            console.log("Login failed with 'password', trying 'Admin@123'...");
            const loginRes2 = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
            });
            data = await loginRes2.json();
            if (!loginRes2.ok) {
                console.error("Login failed:", data);
                process.exit(1);
            }
        }

        const token = data.token;
        console.log("Login successful.");

        console.log("Fetching ALL subjects (no filter)...");
        const allSubjectsRes = await fetch(`${API_URL}/subjects`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-school-year-id': '1'
            }
        });
        const allSubjects = await allSubjectsRes.json();
        console.log(`Total subjects in DB: ${allSubjects.length}`);

        if (allSubjects.length > 0) {
            const targetClassId = allSubjects[0].classe_id;
            console.log(`Testing filter for class ${targetClassId}...`);

            const filteredRes = await fetch(`${API_URL}/subjects?classe_id=${targetClassId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'x-school-year-id': '1'
                }
            });
            const filteredSubjects = await filteredRes.json();
            console.log(`Fetched ${filteredSubjects.length} subjects for class ${targetClassId}.`);

            const invalid = filteredSubjects.filter((s: any) => s.classe_id != targetClassId);
            if (invalid.length > 0) {
                console.error("FAILURE: Filter returned wrong subjects.");
                process.exit(1);
            } else if (filteredSubjects.length === 0) {
                console.error("FAILURE: Filter returned 0 subjects but expected some.");
                process.exit(1);
            } else {
                console.log("SUCCESS: Filter verification passed.");
            }
        } else {
            console.log("WARNING: No subjects in DB to test with. Please add subjects first.");
        }

    } catch (err) {
        console.error("Verification Error:", err);
    }
}

verify();
