import express from 'express';
import { completeOnboarding, getOnboardingStatus } from '../controllers/onboardingController';
import { debugOnboarding } from '../controllers/debugOnboardingController';

console.log('Loading onboardingRoutes...');
const router = express.Router();

// POST /api/onboarding/complete
router.post('/complete', completeOnboarding);

// POST /api/onboarding/debug (temporary debug endpoint)
router.post('/debug', debugOnboarding);

// GET /api/onboarding/status
router.get('/status', getOnboardingStatus);

export default router;
