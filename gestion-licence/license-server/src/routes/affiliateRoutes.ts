import { Router } from 'express';
import { requestOTP, verifyOTP, setupAccount, login, getDashboard, requestWithdrawal } from '../controllers/affiliateController';
import { verifyAffiliate } from '../middleware/affiliateAuth';

const router = Router();

// Public routes
router.post('/otp/request', requestOTP);
router.post('/otp/verify', verifyOTP);
router.post('/setup', setupAccount);
router.post('/login', login);

// Protected routes
router.get('/dashboard', verifyAffiliate, getDashboard);
router.post('/withdraw', verifyAffiliate, requestWithdrawal);

export default router;
