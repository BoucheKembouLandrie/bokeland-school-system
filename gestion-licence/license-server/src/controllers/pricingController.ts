import { Request, Response } from 'express';
import { Pricing } from '../models/Pricing';

// Supported currencies with their metadata
const CURRENCY_META: Record<string, { name: string; country: string; paymentMethods: string[] }> = {
    XAF: { name: 'Franc CFA (CEMAC)', country: 'CM,GA,CG,CF,TD,GQ', paymentMethods: ['MTN Mobile Money', 'Orange Money'] },
    XOF: { name: 'Franc CFA (UEMOA)', country: 'SN,CI,ML,BF,BJ,TG,NE,GW', paymentMethods: ['Orange Money', 'Wave', 'MTN Mobile Money'] },
    GNF: { name: 'Franc Guinéen', country: 'GN', paymentMethods: ['Orange Money Guinea', 'MTN Guinea'] },
    CDF: { name: 'Franc Congolais', country: 'CD', paymentMethods: ['Airtel Money', 'Orange Money'] },
    BIF: { name: 'Franc Burundais', country: 'BI', paymentMethods: ['Lumicash', 'Ecocash'] },
    KMF: { name: 'Franc Comorien', country: 'KM', paymentMethods: ['Huri Money'] },
    DJF: { name: 'Franc Djibouti', country: 'DJ', paymentMethods: ['D-Money'] },
    SCR: { name: 'Roupie Seychelloise', country: 'SC', paymentMethods: ['Card', 'Bank Transfer'] },
    USD: { name: 'Dollar Américain', country: 'US,CA,EU,INT', paymentMethods: ['Carte Bancaire', 'PayPal'] },
};

// GET all pricing entries (admin)
export const getAllPricing = async (req: Request, res: Response) => {
    try {
        const pricings = await Pricing.findAll({ order: [['currency', 'ASC']] });
        res.json(pricings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
};

// GET public pricing by currency (called from Bokeland School System)
export const getPricingByCurrency = async (req: Request, res: Response) => {
    try {
        const { currency } = req.query;
        if (!currency) {
            return res.status(400).json({ error: 'currency parameter is required' });
        }
        const currencyStr = String(currency).toUpperCase();
        const pricing = await Pricing.findOne({
            where: { currency: currencyStr, is_active: true }
        });
        if (!pricing) {
            // Fallback: return default XAF price
            const defaultPricing = await Pricing.findOne({ where: { currency: 'XAF', is_active: true } });
            if (defaultPricing) {
                return res.json({
                    ...defaultPricing.toJSON(),
                    paymentMethods: CURRENCY_META['XAF']?.paymentMethods || [],
                    currencyName: CURRENCY_META['XAF']?.name || 'XAF',
                });
            }
            return res.status(404).json({ error: 'No pricing found for this currency' });
        }
        res.json({
            ...pricing.toJSON(),
            paymentMethods: CURRENCY_META[currencyStr]?.paymentMethods || [],
            currencyName: CURRENCY_META[currencyStr]?.name || currencyStr,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch pricing' });
    }
};

// GET available currencies list (for the payment dialog)
export const getAvailableCurrencies = async (req: Request, res: Response) => {
    try {
        const pricings = await Pricing.findAll({ where: { is_active: true }, order: [['currency', 'ASC']] });
        const result = pricings.map(p => ({
            currency: p.currency,
            amount: p.amount,
            days_added: p.days_added,
            label: p.label,
            currencyName: CURRENCY_META[p.currency]?.name || p.currency,
            paymentMethods: CURRENCY_META[p.currency]?.paymentMethods || [],
        }));
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
};

// POST create pricing (admin)
export const createPricing = async (req: Request, res: Response) => {
    try {
        const { currency, amount, days_added, label } = req.body;
        if (!currency || !amount) {
            return res.status(400).json({ error: 'currency and amount are required' });
        }
        const existing = await Pricing.findOne({ where: { currency: String(currency).toUpperCase() } });
        if (existing) {
            return res.status(409).json({ error: 'A pricing for this currency already exists. Use PUT to update it.' });
        }
        const pricing = await Pricing.create({
            currency: String(currency).toUpperCase(),
            amount: parseFloat(amount),
            days_added: parseInt(days_added) || 444,
            label: label || 'Abonnement annuel',
            is_active: true,
        });
        res.status(201).json(pricing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create pricing' });
    }
};

// PUT update pricing (admin)
export const updatePricing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, days_added, label, is_active } = req.body;
        const pricing = await Pricing.findByPk(id);
        if (!pricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }
        if (amount !== undefined) pricing.amount = parseFloat(amount);
        if (days_added !== undefined) pricing.days_added = parseInt(days_added);
        if (label !== undefined) pricing.label = label;
        if (is_active !== undefined) pricing.is_active = Boolean(is_active);
        await pricing.save();
        res.json(pricing);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update pricing' });
    }
};

// DELETE pricing (admin)
export const deletePricing = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const pricing = await Pricing.findByPk(id);
        if (!pricing) {
            return res.status(404).json({ error: 'Pricing not found' });
        }
        await pricing.destroy();
        res.json({ message: 'Pricing deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete pricing' });
    }
};

// GET revenue summary grouped by currency (admin)
export const getRevenueByCurrency = async (req: Request, res: Response) => {
    try {
        const { Payment } = await import('../models/Payment');
        const payments = await Payment.findAll({ where: { status: 'completed' } });

        const byCurrency: Record<string, { total: number; count: number; average: number }> = {};
        payments.forEach(p => {
            const cur = ((p as any).currency || 'XAF').toUpperCase();
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to compute revenue by currency' });
    }
};
