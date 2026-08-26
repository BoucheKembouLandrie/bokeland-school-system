async function check() {
    try {
        const affiliatesRes = await fetch('https://licence.bokelandgroupservices.com/api/admin/affiliates');
        console.log('Affiliates:', await affiliatesRes.json());
        
        const clientsRes = await fetch('https://licence.bokelandgroupservices.com/api/admin/clients');
        console.log('Clients:', await clientsRes.json());
    } catch(e) {
        console.error(e.message);
    }
}
check();
