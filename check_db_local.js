async function check() {
    try {
        const adminRes = await fetch('http://localhost:3001/api/admin/affiliates');
        console.log('Affiliates Status:', adminRes.status);
        console.log('Affiliates Data:', await adminRes.json());
    } catch(e) {
        console.error(e.message);
    }
}
check();
