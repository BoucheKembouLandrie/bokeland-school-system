"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueByCurrency = exports.deletePricing = exports.updatePricing = exports.createPricing = exports.getAvailableCurrencies = exports.getPricingByCurrency = exports.getAllPricing = void 0;
const Pricing_1 = require("../models/Pricing");
// Supported currencies with their metadata
const CURRENCY_META = {
    XAF: { name: 'Franc CFA (CEMAC)', country: 'CM,GA,CG,CF,TD,GQ', paymentMethods: ['MTN Mobile Money', 'Orange Money'] },
    XOF: { name: 'Franc CFA (UEMOA)', country: 'SN,CI,ML,BF,BJ,TG,NE,GW', paymentMethods: ['Orange Money', 'Wave', 'MTN Mobile Money'] },
    GNF: { name: 'Franc Guinéen', country: 'GN', paymentMethods: ['Orange Money Guinea', 'MTN Guinea'] },
    CDF: { name: 'Franc Congolais', country: 'CD', paymentMethods: ['Airtel Money', 'Orange Money'] },
    BIF: { name: 'Franc Burundais', country: 'BI', paymentMethods: ['Lumicash', 'Ecocash'] },
    KMF: { name: 'Franc Comorien', country: 'KM', paymentMethods: ['Huri Money'] },
    DJF: { name: 'Franc Djibouti', country: 'DJ', paymentMethods: ['D-Money'] },
    SCR: { name: 'Roupie Seychelloise', country: 'SC', paymentMethods: ['Card', 'Bank Transfer'] },
};
// GET all pricing entries (admin)
const getAllPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pricings = yield Pricing_1.Pricing.findAll({ order: [['currency', 'ASC']] });
        res.json(pricings);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
});
exports.getAllPricing = getAllPricing;
// GET public pricing by currency (called from Bokeland School System)
const getPricingByCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { currency } = req.query;
        if (!currency) {
            return res.status(400).json({ error: 'currency parameter is required' });
        }
        const currencyStr = String(currency).toUpperCase();
        const pricing = yield Pricing_1.Pricing.findOne({
            where: { currency: currencyStr, is_active: true }
        });
        if (!pricing) {
            // Fallback: return default XAF price
            const defaultPricing = yield Pricing_1.Pricing.findOne({ where: { currency: 'XAF', is_active: true } });
            if (defaultPricing) {
                return res.json(Object.assign(Object.assign({}, defaultPricing.toJSON()), { paymentMethods: ((_a = CURRENCY_META['XAF']) === null || _a === void 0 ? void 0 : _a.paymentMethods) || [], currencyName: ((_b = CURRENCY_META['XAF']) === null || _b === void 0 ? void 0 : _b.name) || 'XAF' }));
            }
            return res.status(404).json({ error: 'No pricing found for this currency' });
        }
        res.json(Object.assign(Object.assign({}, pricing.toJSON()), { paymentMethods: ((_c = CURRENCY_META[currencyStr]) === null || _c === void 0 ? void 0 : _c.paymentMethods) || [], currencyName: ((_d = CURRENCY_META[currencyStr]) === null || _d === void 0 ? void 0 : _d.name) || currencyStr }));
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
});
exports.getPricingByCurrency = getPricingByCurrency;
// GET available currencies list (for the payment dialog)
const getAvailableCurrencies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pricings = yield Pricing_1.Pricing.findAll({ where: { is_active: true }, order: [['currency', 'ASC']] });
        const result = pricings.map(p => {
            var _a, _b;
            return ({
                currency: p.currency,
                amount: p.amount,
                days_added: p.days_added,
                label: p.label,
                currencyName: ((_a = CURRENCY_META[p.currency]) === null || _a === void 0 ? void 0 : _a.name) || p.currency,
                paymentMethods: ((_b = CURRENCY_META[p.currency]) === null || _b === void 0 ? void 0 : _b.paymentMethods) || [],
            });
        });
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
});
exports.getAvailableCurrencies = getAvailableCurrencies;
// POST create pricing (admin)
const createPricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { currency, amount, days_added, label } = req.body;
        if (!currency || !amount) {
            return res.status(400).json({ error: 'currency and amount are required' });
        }
        const existing = yield Pricing_1.Pricing.findOne({ where: { currency: String(currency).toUpperCase() } });
        if (existing) {
            return res.status(409).json({ error: 'A pricing for this currency already exists. Use PUT to update it.' });
        }
        const pricing = yield Pricing_1.Pricing.create({
            currency: String(currency).toUpperCase(),
            amount: parseFloat(amount),
            days_added: parseInt(days_added) || 444,
            label: label || 'Abonnement annuel',
            is_active: true,
        });
        res.status(201).json(pricing);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create pricing' });
    }
});
exports.createPricing = createPricing;
// PUT update pricing (admin)
const updatePricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { amount, days_added, label, is_active } = req.body;
        const pricing = yield Pricing_1.Pricing.findByPk(id);
        if (!pricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }
        if (amount !== undefined)
            pricing.amount = parseFloat(amount);
        if (days_added !== undefined)
            pricing.days_added = parseInt(days_added);
        if (label !== undefined)
            pricing.label = label;
        if (is_active !== undefined)
            pricing.is_active = Boolean(is_active);
        yield pricing.save();
        res.json(pricing);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update pricing' });
    }
});
exports.updatePricing = updatePricing;
// DELETE pricing (admin)
const deletePricing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const pricing = yield Pricing_1.Pricing.findByPk(id);
        if (!pricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }
        yield pricing.destroy();
        res.json({ message: 'Pricing deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete pricing' });
    }
});
exports.deletePricing = deletePricing;
// GET revenue summary grouped by currency (admin)
const getRevenueByCurrency = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Payment } = yield Promise.resolve().then(() => __importStar(require('../models/Payment')));
        const payments = yield Payment.findAll({ where: { status: 'completed' } });
        const byCurrency = {};
        payments.forEach(p => {
            const cur = (p.currency || 'XAF').toUpperCase();
            if (!byCurrency[cur]) {
                byCurrency[cur] = { total: 0, count: 0, average: 0 };
            }
            byCurrency[cur].total += Number(p.amount);
            byCurrency[cur].count += 1;
        });
        Object.keys(byCurrency).forEach(cur => {
            byCurrency[cur].average = byCurrency[cur].count > 0
                ? byCurrency[cur].total / byCurrency[cur].count : 0;
        });
        res.json(byCurrency);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to compute revenue by currency' });
    }
});
exports.getRevenueByCurrency = getRevenueByCurrency;
