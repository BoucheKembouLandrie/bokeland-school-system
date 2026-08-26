"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoice = exports.checkPaymentStatus = exports.handleWebhook = exports.initiatePayment = exports.createPayment = exports.getRevenueSummary = exports.getAllPayments = void 0;
const axios_1 = __importDefault(require("axios"));
const Payment_1 = require("../models/Payment");
const Client_1 = require("../models/Client");
const Config_1 = require("../models/Config");
const Affiliate_1 = require("../models/Affiliate");
const Commission_1 = require("../models/Commission");
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// ─── Swychr API Configuration ────────────────────────────────────────────────
const SWYCHR_BASE_URL = process.env.SWYCHR_BASE_URL || 'https://api.accountpe.com';
const SWYCHR_EMAIL = process.env.SWYCHR_EMAIL || '';
const SWYCHR_PASSWORD = process.env.SWYCHR_PASSWORD || '';
const SERVER_URL = process.env.SERVER_URL || 'https://licence.bokelandgroupservices.com';
// ─── Swychr Dynamic Token Cache ──────────────────────────────────────────────
let swychrTokenCache = null;
function getSwychrToken() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        const now = Date.now();
        // Return cached token if still valid (55 min window)
        if (swychrTokenCache && now < swychrTokenCache.expiresAt) {
            return swychrTokenCache.token;
        }
        console.log('[Swychr] Fetching new auth token...');
        const authRes = yield axios_1.default.post(`${SWYCHR_BASE_URL}/api/payin/admin/auth`, { email: SWYCHR_EMAIL, password: SWYCHR_PASSWORD }, { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });
        // Token is typically in authRes.data.token or authRes.data.access_token
        const token = ((_a = authRes.data) === null || _a === void 0 ? void 0 : _a.token) || ((_b = authRes.data) === null || _b === void 0 ? void 0 : _b.access_token) || ((_d = (_c = authRes.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.token);
        if (!token) {
            throw new Error(`[Swychr] Auth succeeded but no token found in response: ${JSON.stringify(authRes.data)}`);
        }
        swychrTokenCache = { token, expiresAt: now + 55 * 60 * 1000 };
        console.log('[Swychr] Token obtained and cached for 55 minutes.');
        return token;
    });
}
// ─── GET ALL PAYMENTS ─────────────────────────────────────────────────────────
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n=== GET ALL PAYMENTS ===');
    try {
        const payments = yield Payment_1.Payment.findAll({ order: [['id', 'DESC']], limit: 200 });
        console.log(`✅ Found ${payments.length} payments`);
        const result = [];
        for (const payment of payments) {
            try {
                const client = yield Client_1.Client.findByPk(payment.client_id);
                result.push({
                    id: payment.id,
                    client_id: payment.client_id,
                    amount: payment.amount,
                    currency: payment.currency || 'XAF',
                    payment_date: payment.payment_date,
                    payment_method: payment.payment_method,
                    transaction_id: payment.transaction_id,
                    status: payment.status,
                    days_added: payment.days_added,
                    invoice_number: payment.invoice_number,
                    Client: client ? {
                        id: client.id,
                        school_name: client.school_name,
                        email: client.email,
                        phone: client.phone,
                        status: client.status
                    } : null
                });
            }
            catch (err) {
                console.error(`Error fetching client for payment ${payment.id}:`, err);
                result.push({
                    id: payment.id, client_id: payment.client_id, amount: payment.amount,
                    currency: payment.currency || 'XAF', payment_date: payment.payment_date,
                    payment_method: payment.payment_method, transaction_id: payment.transaction_id,
                    status: payment.status, days_added: payment.days_added,
                    invoice_number: payment.invoice_number, Client: null
                });
            }
        }
        res.json(result);
    }
    catch (error) {
        console.error('❌ ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
});
exports.getAllPayments = getAllPayments;
// ─── GET REVENUE SUMMARY (grouped by currency) ───────────────────────────────
const getRevenueSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payments = yield Payment_1.Payment.findAll();
        const completed = payments.filter(p => p.status === 'completed');
        // Overall totals (in XAF as default for backward compat)
        const totalRevenue = completed.reduce((sum, p) => sum + Number(p.amount), 0);
        // Breakdown by currency
        const byCurrency = {};
        const methodBreakdown = {};
        completed.forEach(p => {
            const cur = (p.currency || 'XAF').toUpperCase();
            if (!byCurrency[cur])
                byCurrency[cur] = { total: 0, count: 0, average: 0 };
            byCurrency[cur].total += Number(p.amount);
            byCurrency[cur].count += 1;
            const method = p.payment_method || 'manual';
            methodBreakdown[method] = (methodBreakdown[method] || 0) + Number(p.amount);
        });
        Object.keys(byCurrency).forEach(cur => {
            byCurrency[cur].average = byCurrency[cur].count > 0
                ? byCurrency[cur].total / byCurrency[cur].count : 0;
        });
        res.json({
            total_revenue: totalRevenue,
            payment_count: completed.length,
            average_payment: completed.length > 0 ? totalRevenue / completed.length : 0,
            method_breakdown: methodBreakdown,
            by_currency: byCurrency,
        });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: String(error) });
    }
});
exports.getRevenueSummary = getRevenueSummary;
// ─── CREATE MANUAL PAYMENT (admin) ───────────────────────────────────────────
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n=== CREATE MANUAL PAYMENT ===');
    try {
        const { client_id, amount, days, currency } = req.body;
        if (!client_id || !amount) {
            return res.status(400).json({ error: 'Client ID and amount required' });
        }
        const client = yield Client_1.Client.findByPk(client_id);
        if (!client)
            return res.status(404).json({ error: 'Client not found' });
        const payment = yield Payment_1.Payment.create({
            client_id, amount,
            currency: (currency || 'XAF').toUpperCase(),
            payment_method: 'manual',
            status: 'completed',
            days_added: days || 444,
            payment_date: new Date(),
            invoice_number: `BOK-${Date.now()}`
        });
        // Update client subscription
        const now = new Date();
        const wasExpired = client.status === 'EXPIRED';
        const baseDate = wasExpired ? now : (() => {
            const currentEnd = new Date(client.subscription_end_date);
            return currentEnd > now ? currentEnd : now;
        })();
        const newEnd = new Date(baseDate);
        newEnd.setDate(baseDate.getDate() + (days || 444));
        client.subscription_end_date = newEnd;
        client.status = 'ACTIVE';
        yield client.save();
        res.json({ success: true, payment });
    }
    catch (error) {
        console.error('❌ ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
});
exports.createPayment = createPayment;
// ─── INITIATE SWYCHR PAYMENT (called from Bokeland School System) ─────────────
const initiatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    try {
        const { machine_id, // Identifiant de la machine du client
        currency, // XAF, XOF, etc.
        phone, // Numéro de téléphone pour le paiement mobile
        payment_method, // ex: "MTN Mobile Money"
        amount, // Montant à payer
        days_added, // Jours d'abonnement
        country_code, // Optionnel
         } = req.body;
        if (!machine_id || !currency || !phone || !payment_method || !amount) {
            return res.status(400).json({ error: 'machine_id, currency, phone, payment_method, amount are required' });
        }
        // Find the client by machine_id
        const client = yield Client_1.Client.findOne({ where: { machine_id } });
        if (!client) {
            return res.status(404).json({ error: 'Client not found for this machine ID' });
        }
        // Map payment method to Swychr operator code
        const operatorMap = {
            'MTN Mobile Money': 'MTN',
            'Orange Money': 'ORANGE',
            'Orange Money Guinea': 'ORANGE',
            'MTN Guinea': 'MTN',
            'Wave': 'WAVE',
            'Airtel Money': 'AIRTEL',
        };
        const operator = operatorMap[payment_method] || 'MTN';
        // Create a unique reference for this payment
        const reference = `BOK-${client.id}-${Date.now()}`;
        // Determine country code and phone prefix dynamically
        let countryCode = String(country_code || '').toUpperCase().trim();
        let phonePrefix = '';
        const COUNTRY_PREFIX_MAP = {
            CM: '237', GA: '241', CG: '242', CF: '236', TD: '235', GQ: '240',
            CI: '225', SN: '221', ML: '223', BF: '226', BJ: '229', TG: '228', NE: '227', GW: '245',
            GN: '224', CD: '243', BI: '257', KM: '269', DJ: '253', SC: '248'
        };
        if (countryCode && COUNTRY_PREFIX_MAP[countryCode]) {
            phonePrefix = COUNTRY_PREFIX_MAP[countryCode];
        }
        else {
            // Fallback to dynamic detection based on currency & client metadata
            countryCode = 'CM';
            phonePrefix = '237';
            const clientCountry = String(client.country || '').toLowerCase();
            const upperCurrency = String(currency || 'XAF').toUpperCase();
            if (upperCurrency === 'XOF') {
                if (clientCountry.includes('senegal')) {
                    countryCode = 'SN';
                    phonePrefix = '221';
                }
                else if (clientCountry.includes('ivoire') || clientCountry.includes('coast')) {
                    countryCode = 'CI';
                    phonePrefix = '225';
                }
                else if (clientCountry.includes('mali')) {
                    countryCode = 'ML';
                    phonePrefix = '223';
                }
                else if (clientCountry.includes('burkina')) {
                    countryCode = 'BF';
                    phonePrefix = '226';
                }
                else if (clientCountry.includes('togo')) {
                    countryCode = 'TG';
                    phonePrefix = '228';
                }
                else if (clientCountry.includes('benin')) {
                    countryCode = 'BJ';
                    phonePrefix = '229';
                }
                else if (clientCountry.includes('niger')) {
                    countryCode = 'NE';
                    phonePrefix = '227';
                }
                else {
                    countryCode = 'CI'; // Default Ivory Coast for XOF
                    phonePrefix = '225';
                }
            }
            else if (upperCurrency === 'GNF' || clientCountry.includes('guinea') || clientCountry.includes('guinée')) {
                countryCode = 'GN';
                phonePrefix = '224';
            }
            else if (upperCurrency === 'XAF' || clientCountry.includes('cameroon') || clientCountry.includes('cameroun')) {
                countryCode = 'CM';
                phonePrefix = '237';
            }
        }
        // Clean phone number: remove spaces, +, leading double zeros (00)
        let cleanedPhone = String(phone || '000000000').trim().replace(/\s+/g, '');
        if (cleanedPhone.startsWith('+')) {
            cleanedPhone = cleanedPhone.slice(1);
        }
        else if (cleanedPhone.startsWith('00')) {
            cleanedPhone = cleanedPhone.slice(2);
        }
        // Format phone with prefix if not already present
        let finalPhone = cleanedPhone;
        if (!finalPhone.startsWith(phonePrefix)) {
            if (finalPhone.startsWith('0') && finalPhone.length > 9) {
                finalPhone = finalPhone.slice(1);
            }
            finalPhone = phonePrefix + finalPhone;
        }
        // Call Swychr API to create payment link
        let paymentLink = '';
        let swychrTransactionId = '';
        try {
            const swychrPayload = {
                country_code: countryCode,
                name: client.school_name || 'Bokeland School',
                email: client.email || SWYCHR_EMAIL,
                mobile: finalPhone,
                amount: parseFloat(amount),
                currency: String(currency).toUpperCase(),
                transaction_id: reference,
                description: `Abonnement Bokeland School System - ${client.school_name}`,
                pass_digital_charge: true,
                callback_url: `${SERVER_URL}/api/license/payments/webhook`,
            };
            console.log('[Swychr] Initiating payment:', swychrPayload);
            // Get a fresh or cached auth token before calling payin API
            const swychrToken = yield getSwychrToken();
            const swychrRes = yield axios_1.default.post(`${SWYCHR_BASE_URL}/api/payin/create_payment_links`, swychrPayload, {
                headers: {
                    'Authorization': `Bearer ${swychrToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 15000,
            });
            console.log('[Swychr] Response:', swychrRes.data);
            paymentLink = ((_a = swychrRes.data) === null || _a === void 0 ? void 0 : _a.payment_link) || ((_b = swychrRes.data) === null || _b === void 0 ? void 0 : _b.link) || ((_d = (_c = swychrRes.data) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.payment_link) || '';
            swychrTransactionId = ((_e = swychrRes.data) === null || _e === void 0 ? void 0 : _e.transaction_id) || ((_f = swychrRes.data) === null || _f === void 0 ? void 0 : _f.id) || ((_h = (_g = swychrRes.data) === null || _g === void 0 ? void 0 : _g.data) === null || _h === void 0 ? void 0 : _h.transaction_id) || ((_k = (_j = swychrRes.data) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.id) || '';
        }
        catch (swychrError) {
            console.error('[Swychr] API Error:', ((_l = swychrError === null || swychrError === void 0 ? void 0 : swychrError.response) === null || _l === void 0 ? void 0 : _l.data) || swychrError.message);
            // In offline/test mode, return a simulated response
            if (process.env.NODE_ENV === 'development') {
                return res.json({
                    success: true,
                    payment_link: `https://pay.swychrconnect.com/simulate/${reference}`,
                    transaction_id: `SIM-${reference}`,
                    reference,
                    status: 'pending',
                    simulated: true,
                });
            }
            return res.status(502).json({
                error: 'Payment gateway unavailable. Please try again later.',
                details: ((_o = (_m = swychrError === null || swychrError === void 0 ? void 0 : swychrError.response) === null || _m === void 0 ? void 0 : _m.data) === null || _o === void 0 ? void 0 : _o.message) || swychrError.message,
            });
        }
        // Create a pending payment record in our DB
        const pendingPayment = yield Payment_1.Payment.create({
            client_id: client.id,
            amount: parseFloat(amount),
            currency: String(currency).toUpperCase(),
            payment_method,
            status: 'pending',
            days_added: days_added || 444,
            payment_date: new Date(),
            transaction_id: swychrTransactionId,
            external_reference: reference,
            invoice_number: `BOK-${Date.now()}`,
        });
        res.json({
            success: true,
            payment_link: paymentLink,
            transaction_id: swychrTransactionId,
            reference,
            payment_id: pendingPayment.id,
            status: 'pending',
        });
    }
    catch (error) {
        console.error('[initiatePayment] Error:', error);
        res.status(500).json({ error: 'Failed to initiate payment', details: error.message });
    }
});
exports.initiatePayment = initiatePayment;
// ─── SWYCHR WEBHOOK (payment confirmation) ────────────────────────────────────
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('\n[Webhook] Received:', JSON.stringify(req.body, null, 2));
        const { reference, // Our reference (BOK-clientId-timestamp)
        transaction_id, status, // 'success' | 'failed' | 'pending'
        amount, currency, } = req.body;
        if (!reference) {
            return res.status(400).json({ error: 'No reference provided' });
        }
        // Find the pending payment by reference
        const payment = yield Payment_1.Payment.findOne({ where: { external_reference: reference } });
        if (!payment) {
            console.warn('[Webhook] Payment not found for reference:', reference);
            return res.status(404).json({ error: 'Payment not found' });
        }
        if (status === 'success' || status === 'completed') {
            // Activate the client's subscription
            const client = yield Client_1.Client.findByPk(payment.client_id);
            if (client) {
                const now = new Date();
                const wasExpired = client.status === 'EXPIRED';
                const baseDate = wasExpired ? now : (() => {
                    const currentEnd = new Date(client.subscription_end_date);
                    return currentEnd > now ? currentEnd : now;
                })();
                const newEnd = new Date(baseDate);
                newEnd.setDate(baseDate.getDate() + payment.days_added);
                client.subscription_end_date = newEnd;
                client.status = 'ACTIVE';
                yield client.save();
                console.log(`[Webhook] ✅ Client ${client.id} activated until ${newEnd}`);
            }
            // Mark payment as completed
            payment.status = 'completed';
            if (transaction_id)
                payment.transaction_id = transaction_id;
            payment.payment_date = new Date();
            yield payment.save();
            // Affiliate Commission Logic
            if (client && client.affiliate_id) {
                try {
                    const affiliate = yield Affiliate_1.Affiliate.findByPk(client.affiliate_id);
                    if (affiliate && affiliate.status !== 'BANNED') {
                        const schoolCurrency = client.currency || 'XAF';
                        const affiliateCurrency = affiliate.currency;
                        if (!affiliateCurrency) {
                            console.log(`[Affiliate] ⚠️ Commission skipped: Affiliate ${affiliate.id} has not claimed their account or selected a preferred currency yet.`);
                        }
                        else if (schoolCurrency !== affiliateCurrency) {
                            console.log(`[Affiliate] ⚠️ Commission skipped: Client currency (${schoolCurrency}) does not match Affiliate currency (${affiliateCurrency})`);
                        }
                        else {
                            const existingCommission = yield Commission_1.Commission.findOne({ where: { payment_id: payment.id } });
                            if (!existingCommission) {
                                const configRate = yield Config_1.Config.findByPk('DEFAULT_COMMISSION_RATE');
                                const defaultRate = configRate ? parseFloat(configRate.value) : 20;
                                const rate = affiliate.custom_commission_rate || defaultRate;
                                const commissionAmount = (Number(payment.amount) * rate) / 100;
                                yield Commission_1.Commission.create({
                                    affiliate_id: affiliate.id,
                                    client_id: client.id,
                                    payment_id: payment.id,
                                    amount: commissionAmount,
                                    status: 'PAID'
                                });
                                affiliate.balance = Number(affiliate.balance) + commissionAmount;
                                yield affiliate.save();
                                console.log(`[Affiliate] ✅ Added commission of ${commissionAmount} to affiliate ${affiliate.id}`);
                            }
                        }
                    }
                }
                catch (affErr) {
                    console.error('[Affiliate] Error processing commission:', affErr);
                }
            }
            return res.json({ success: true, message: 'Payment processed and license activated' });
        }
        else if (status === 'failed') {
            payment.status = 'failed';
            yield payment.save();
            console.warn('[Webhook] Payment failed for reference:', reference);
            return res.json({ success: false, message: 'Payment marked as failed' });
        }
        // Still pending
        res.json({ success: true, message: 'Webhook received, status pending' });
    }
    catch (error) {
        console.error('[Webhook] Error:', error);
        res.status(500).json({ error: 'Webhook processing failed', details: error.message });
    }
});
exports.handleWebhook = handleWebhook;
// ─── CHECK PAYMENT STATUS (polling from Bokeland School) ──────────────────────
const checkPaymentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { reference } = req.params;
        const payment = yield Payment_1.Payment.findOne({ where: { external_reference: reference } });
        if (!payment) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        // Also check Swychr API for latest status
        // API docs: POST /payment_link_status with { transaction_id } in body
        if (payment.status === 'pending' && SWYCHR_EMAIL) {
            try {
                const swychrToken = yield getSwychrToken();
                const swychrRes = yield axios_1.default.post(`${SWYCHR_BASE_URL}/api/payin/payment_link_status`, { transaction_id: payment.transaction_id || reference }, {
                    headers: {
                        'Authorization': `Bearer ${swychrToken}`,
                        'Content-Type': 'application/json',
                    },
                    timeout: 8000,
                });
                // API returns: data.data.attributes.status (0=pending, 1=success, 2=failed, 3=refunded)
                const remoteStatus = (_d = (_c = (_b = (_a = swychrRes.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.attributes) === null || _d === void 0 ? void 0 : _d.status;
                console.log('[checkPaymentStatus] Swychr remote status:', remoteStatus);
                if (remoteStatus === 1) {
                    // Process the payment if not yet done
                    const client = yield Client_1.Client.findByPk(payment.client_id);
                    if (client) {
                        const now = new Date();
                        const wasExpired = client.status === 'EXPIRED';
                        const base = wasExpired ? now : (new Date(client.subscription_end_date) > now ? new Date(client.subscription_end_date) : now);
                        base.setDate(base.getDate() + payment.days_added);
                        client.subscription_end_date = base;
                        client.status = 'ACTIVE';
                        yield client.save();
                    }
                    payment.status = 'completed';
                    yield payment.save();
                    // Affiliate Commission Logic
                    if (client && client.affiliate_id) {
                        try {
                            const affiliate = yield Affiliate_1.Affiliate.findByPk(client.affiliate_id);
                            if (affiliate && affiliate.status !== 'BANNED') {
                                const schoolCurrency = client.currency || 'XAF';
                                const affiliateCurrency = affiliate.currency;
                                if (!affiliateCurrency) {
                                    console.log(`[Affiliate] ⚠️ Commission skipped in polling: Affiliate ${affiliate.id} has not claimed their account or selected a preferred currency yet.`);
                                }
                                else if (schoolCurrency !== affiliateCurrency) {
                                    console.log(`[Affiliate] ⚠️ Commission skipped in polling: Client currency (${schoolCurrency}) does not match Affiliate currency (${affiliateCurrency})`);
                                }
                                else {
                                    const existingCommission = yield Commission_1.Commission.findOne({ where: { payment_id: payment.id } });
                                    if (!existingCommission) {
                                        const configRate = yield Config_1.Config.findByPk('DEFAULT_COMMISSION_RATE');
                                        const defaultRate = configRate ? parseFloat(configRate.value) : 20;
                                        const rate = affiliate.custom_commission_rate || defaultRate;
                                        const commissionAmount = (Number(payment.amount) * rate) / 100;
                                        yield Commission_1.Commission.create({
                                            affiliate_id: affiliate.id,
                                            client_id: client.id,
                                            payment_id: payment.id,
                                            amount: commissionAmount,
                                            status: 'PAID'
                                        });
                                        affiliate.balance = Number(affiliate.balance) + commissionAmount;
                                        yield affiliate.save();
                                        console.log(`[Affiliate] ✅ Added commission of ${commissionAmount} to affiliate ${affiliate.id}`);
                                    }
                                }
                            }
                        }
                        catch (affErr) {
                            console.error('[Affiliate] Error processing commission in polling:', affErr);
                        }
                    }
                }
            }
            catch (e) {
                console.warn('[checkPaymentStatus] Could not reach Swychr:', e.message);
            }
        }
        res.json({
            status: payment.status,
            payment_id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            days_added: payment.days_added,
        });
    }
    catch (error) {
        console.error('[checkPaymentStatus] Error:', error);
        res.status(500).json({ error: 'Failed to check payment status' });
    }
});
exports.checkPaymentStatus = checkPaymentStatus;
// ─── DOWNLOAD INVOICE PDF ─────────────────────────────────────────────────────
const downloadInvoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const [payment, configLogo, configSignature] = yield Promise.all([
            Payment_1.Payment.findByPk(id),
            Config_1.Config.findByPk('company_logo'),
            Config_1.Config.findByPk('company_signature')
        ]);
        if (!payment)
            return res.status(404).json({ error: 'Payment not found' });
        const client = yield Client_1.Client.findByPk(payment.client_id);
        if (!client)
            return res.status(404).json({ error: 'Client not found' });
        const doc = new pdfkit_1.default({ margin: 50 });
        const filename = `Recu_${payment.invoice_number || payment.id}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');
        doc.pipe(res);
        // ── Resolve uploads directory using __dirname (same base as Multer) ──────
        // Multer stores in: [routes dir]/../../public/uploads  →  public/uploads
        // __dirname here is: dist/controllers  →  ../../public/uploads
        const uploadsBase = path_1.default.resolve(__dirname, '../../public/uploads');
        const resolveUpload = (configValue) => {
            if (!configValue)
                return null;
            // Strip leading slash, keep only filename
            const fname = path_1.default.basename(configValue);
            const p = path_1.default.join(uploadsBase, fname);
            if (fs_1.default.existsSync(p))
                return p;
            // Fallback: try relative to cwd
            const p2 = path_1.default.resolve(process.cwd(), configValue.replace(/^\/+/, ''));
            if (fs_1.default.existsSync(p2))
                return p2;
            console.warn(`[Invoice] Image not found: tried ${p} and ${p2}`);
            return null;
        };
        const logoPath = resolveUpload((_a = configLogo === null || configLogo === void 0 ? void 0 : configLogo.value) !== null && _a !== void 0 ? _a : null);
        const signaturePath = resolveUpload((_b = configSignature === null || configSignature === void 0 ? void 0 : configSignature.value) !== null && _b !== void 0 ? _b : null);
        console.log(`[Invoice] logoPath=${logoPath} | signaturePath=${signaturePath}`);
        // ── Watermark ──────────────────────────────────────────────────────────
        if (logoPath) {
            try {
                doc.save();
                doc.translate(doc.page.width / 2, doc.page.height / 2);
                doc.rotate(-45);
                doc.opacity(0.08);
                doc.image(logoPath, -280, -140, { width: 560 });
                doc.restore();
            }
            catch (e) {
                console.warn('[Invoice] Watermark failed:', e);
            }
        }
        // ── Header ─────────────────────────────────────────────────────────────
        const headerTop = 45;
        if (logoPath) {
            try {
                doc.image(logoPath, 50, headerTop, { width: 120, height: 60, fit: [120, 60] });
            }
            catch (e) {
                doc.fontSize(18).font('Helvetica-Bold').text('BOKELAND SCHOOL SYSTEM', 50, headerTop + 10);
            }
        }
        else {
            doc.fontSize(18).font('Helvetica-Bold').text('BOKELAND SCHOOL SYSTEM', 50, headerTop + 10);
        }
        doc.fontSize(10).font('Helvetica').text('Solution de Gestion Scolaire', 200, headerTop + 5, { align: 'right' });
        doc.text('Support: support@bokeland.com', 200, headerTop + 20, { align: 'right' });
        doc.moveDown(3);
        // ── Title ──────────────────────────────────────────────────────────────
        doc.fontSize(20).font('Helvetica-Bold').text('REÇU DE PAIEMENT', 50, 150, { align: 'center', underline: true });
        doc.moveDown();
        // ── Client & Payment Details ───────────────────────────────────────────
        const startY = 200;
        doc.fontSize(12).font('Helvetica-Bold').text('CLIENT:', 50, startY);
        doc.fontSize(10).font('Helvetica').text(client.school_name, 50, startY + 15);
        doc.text(`Email: ${client.email}`, 50, startY + 30);
        if (client.phone)
            doc.text(`Tel: ${client.phone}`, 50, startY + 45);
        doc.font('Helvetica-Bold').text('DÉTAILS:', 300, startY);
        doc.font('Helvetica').text(`Référence: ${payment.invoice_number || payment.external_reference || 'N/A'}`, 300, startY + 15);
        doc.text(`Date: ${new Date(payment.payment_date).toLocaleDateString()}`, 300, startY + 30);
        doc.text(`Méthode: ${payment.payment_method.toUpperCase()}`, 300, startY + 45);
        doc.moveDown(4);
        // ── Table ──────────────────────────────────────────────────────────────
        const tableTop = 320;
        doc.font('Helvetica-Bold');
        doc.text('DESCRIPTION', 50, tableTop);
        doc.text('DURÉE', 300, tableTop, { width: 90, align: 'right' });
        doc.text('MONTANT', 400, tableTop, { width: 90, align: 'right' });
        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
        const rowTop = tableTop + 30;
        doc.font('Helvetica');
        doc.text('Abonnement Licence Logiciel Bokeland School System', 50, rowTop);
        doc.text(`${payment.days_added} Jours`, 300, rowTop, { width: 90, align: 'right' });
        const currencyLabel = payment.currency || 'XAF';
        doc.text(`${Number(payment.amount).toLocaleString()} ${currencyLabel}`, 400, rowTop, { width: 90, align: 'right' });
        doc.moveTo(50, rowTop + 20).lineTo(550, rowTop + 20).stroke();
        const totalTop = rowTop + 40;
        doc.font('Helvetica-Bold').fontSize(14);
        doc.text('TOTAL PAYÉ:', 300, totalTop);
        doc.text(`${Number(payment.amount).toLocaleString()} ${currencyLabel}`, 400, totalTop, { width: 90, align: 'right' });
        // ── Signature ──────────────────────────────────────────────────────────
        const signatureTop = 520;
        if (signaturePath) {
            try {
                doc.image(signaturePath, 320, signatureTop, { width: 180, height: 80, fit: [180, 80] });
            }
            catch (e) {
                console.warn('[Invoice] Signature image failed:', e);
            }
        }
        // ── Footer ─────────────────────────────────────────────────────────────
        doc.fontSize(10).font('Helvetica').text('Merci pour votre confiance. Ce reçu est généré électroniquement.', 50, 700, { align: 'center', width: 500 });
        doc.end();
    }
    catch (error) {
        console.error('Error generating PDF', error);
        res.status(500).json({ error: 'Failed to generate invoice' });
    }
});
exports.downloadInvoice = downloadInvoice;
