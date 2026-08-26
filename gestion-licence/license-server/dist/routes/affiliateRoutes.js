"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const affiliateController_1 = require("../controllers/affiliateController");
const affiliateAuth_1 = require("../middleware/affiliateAuth");
const router = (0, express_1.Router)();
// Public routes
router.post('/otp/request', affiliateController_1.requestOTP);
router.post('/otp/verify', affiliateController_1.verifyOTP);
router.post('/setup', affiliateController_1.setupAccount);
router.post('/login', affiliateController_1.login);
// Protected routes
router.get('/dashboard', affiliateAuth_1.verifyAffiliate, affiliateController_1.getDashboard);
router.post('/withdraw', affiliateAuth_1.verifyAffiliate, affiliateController_1.requestWithdrawal);
exports.default = router;
