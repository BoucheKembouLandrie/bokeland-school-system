import { Router } from 'express';
import { activateLicense, checkLicense, getCachedLicenseStatus, initiatePayment } from '../services/licenseService';

const router = Router();

router.post('/activate', async (req, res) => {
    try {
        const { school_name, email } = req.body;
        if (!school_name || !email) {
            res.status(400).json({ error: 'School name and email required' });
            return;
        }

        const result = await activateLicense(school_name, email);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/status', async (req, res) => {
    // Force check if requested (e.g. user clicked "Refresh License")
    const force = req.query.force === 'true';
    const status = await checkLicense(force);
    console.log('License Status Response:', JSON.stringify(status, null, 2));
    res.json(status);
});

router.post('/pay', async (req, res) => {
    try {
        const { amount, phone_number } = req.body;
        const result = await initiatePayment(amount, phone_number);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
