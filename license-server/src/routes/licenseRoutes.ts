import { Router } from 'express';
import { checkLicense, activateTrial, extendSubscription, initiateClientPayment } from '../controllers/licenseController';

const router = Router();

router.post('/check', checkLicense);
router.post('/activate', activateTrial);
router.post('/pay', initiateClientPayment);
router.post('/extend', extendSubscription); // In production, add authentication middleware here!

export default router;
