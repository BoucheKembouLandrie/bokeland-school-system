import { Router } from 'express';
import { checkLicense, activateTrial, extendSubscription, initiateClientPayment } from '../controllers/licenseController';
import { getCurrentBroadcast } from '../controllers/broadcastController';

const router = Router();

router.post('/check', checkLicense);
router.post('/activate', activateTrial);
router.post('/pay', initiateClientPayment);
router.post('/extend', extendSubscription); // In production, add authentication middleware here!
router.get('/broadcast/current', getCurrentBroadcast);

export default router;
