"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const licenseController_1 = require("../controllers/licenseController");
const broadcastController_1 = require("../controllers/broadcastController");
const router = (0, express_1.Router)();
router.post('/check', licenseController_1.checkLicense);
router.post('/activate', licenseController_1.activateTrial);
router.post('/pay', licenseController_1.initiateClientPayment);
router.post('/extend', licenseController_1.extendSubscription); // In production, add authentication middleware here!
router.get('/broadcast/current', broadcastController_1.getCurrentBroadcast);
exports.default = router;
