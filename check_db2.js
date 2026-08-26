async function check() {
    try {
        const adminRes = await fetch('https://licence.bokelandgroupservices.com/api/admin/affiliates');
        console.log('Affiliates Status:', adminRes.status);
        console.log('Affiliates Error:', await adminRes.text());
    } catch(e) {
        console.error(e.message);
    }
}
check();
