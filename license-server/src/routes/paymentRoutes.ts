import { Router } from 'express';
import { getAllPayments, getRevenueSummary, createPayment, initiatePayment, handleWebhook, downloadInvoice, checkPaymentStatus } from '../controllers/paymentController';

const router = Router();

router.get('/payments', getAllPayments);
router.get('/revenue/summary', getRevenueSummary);
router.post('/payments', createPayment); // Manual payment

// CamPay endpoints
router.post('/payments/initiate', initiatePayment);
router.post('/payments/webhook', handleWebhook);
router.get('/payments/:id/invoice', downloadInvoice);
router.get('/payments/status/:reference', checkPaymentStatus);

export default router;
