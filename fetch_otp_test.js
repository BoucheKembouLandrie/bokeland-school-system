async function check() {
    try {
        const emailToTest = 'bokelandlloyd@gmail.com';
        const res = await fetch('https://licence.bokelandgroupservices.com/api/affiliate/otp/request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailToTest })
        });
        console.log('Status:', res.status);
        console.log('Data:', await res.json());
    } catch(e) {
        console.error(e.message);
    }
}
check();
