"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentController_1 = require("../controllers/paymentController");
const pricingController_1 = require("../controllers/pricingController");
const router = (0, express_1.Router)();
// ── Payments ──────────────────────────────────────────────────────────────────
router.get('/payments', paymentController_1.getAllPayments);
router.get('/revenue/summary', paymentController_1.getRevenueSummary);
router.get('/revenue/by-currency', pricingController_1.getRevenueByCurrency);
router.post('/payments', paymentController_1.createPayment); // Manual payment (admin)
router.post('/payments/initiate', paymentController_1.initiatePayment); // Swychr payment initiation
router.post('/payments/webhook', paymentController_1.handleWebhook); // Swychr webhook
router.get('/payments/:id/invoice', paymentController_1.downloadInvoice);
router.get('/payments/status/:reference', paymentController_1.checkPaymentStatus); // Polling status
// ── Pricing (admin CRUD) ──────────────────────────────────────────────────────
router.get('/pricing', pricingController_1.getAllPricing);
router.post('/pricing', pricingController_1.createPricing);
router.put('/pricing/:id', pricingController_1.updatePricing);
router.delete('/pricing/:id', pricingController_1.deletePricing);
// ── Pricing (public — called from Bokeland School System) ─────────────────────
router.get('/pricing/by-currency', pricingController_1.getPricingByCurrency); // ?currency=XAF
router.get('/pricing/currencies', pricingController_1.getAvailableCurrencies); // List all active currencies+prices
exports.default = router;
