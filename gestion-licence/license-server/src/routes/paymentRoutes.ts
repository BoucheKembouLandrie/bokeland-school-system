import { Router } from 'express';
import { getAllPayments, getRevenueSummary, createPayment, initiatePayment, handleWebhook, downloadInvoice, checkPaymentStatus } from '../controllers/paymentController';
import { getAllPricing, getPricingByCurrency, getAvailableCurrencies, createPricing, updatePricing, deletePricing, getRevenueByCurrency } from '../controllers/pricingController';

const router = Router();

// ── Payments ──────────────────────────────────────────────────────────────────
router.get('/payments', getAllPayments);
router.get('/revenue/summary', getRevenueSummary);
router.get('/revenue/by-currency', getRevenueByCurrency);
router.post('/payments', createPayment);                                // Manual payment (admin)
router.post('/payments/initiate', initiatePayment);                    // Swychr payment initiation
router.post('/payments/webhook', handleWebhook);                       // Swychr webhook
router.get('/payments/:id/invoice', downloadInvoice);
router.get('/payments/status/:reference', checkPaymentStatus);         // Polling status

// ── Pricing (admin CRUD) ──────────────────────────────────────────────────────
router.get('/pricing', getAllPricing);
router.post('/pricing', createPricing);
router.put('/pricing/:id', updatePricing);
router.delete('/pricing/:id', deletePricing);

// ── Pricing (public — called from Bokeland School System) ─────────────────────
router.get('/pricing/by-currency', getPricingByCurrency);              // ?currency=XAF
router.get('/pricing/currencies', getAvailableCurrencies);             // List all active currencies+prices

export default router;
