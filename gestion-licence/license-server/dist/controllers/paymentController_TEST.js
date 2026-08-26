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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRevenueSummary = exports.getAllPayments = void 0;
const Payment_1 = require("../models/Payment");
const sequelize_1 = require("sequelize");
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n🔍 GET ALL PAYMENTS - START');
    console.log('Query params:', req.query);
    try {
        // TEMPORARY: Return hardcoded test data to verify the endpoint works
        const testPayments = [
            {
                id: 1,
                client_id: 1,
                amount: 88800,
                payment_date: new Date(),
                payment_method: 'manual',
                transaction_id: null,
                status: 'completed',
                days_added: 444,
                invoice_number: 'TEST-001',
                Client: {
                    id: 1,
                    school_name: 'Test School',
                    email: 'test@example.com',
                    phone: '123456789',
                    status: 'ACTIVE'
                }
            }
        ];
        console.log('✅ Returning test data:', testPayments.length, 'payments');
        res.json(testPayments);
    }
    catch (error) {
        console.error('❌ Error in getAllPayments:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});
exports.getAllPayments = getAllPayments;
const getRevenueSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { start_date, end_date } = req.query;
        const whereClause = {
            status: 'completed'
        };
        if (start_date && end_date) {
            whereClause.payment_date = {
                [sequelize_1.Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }
        const payments = yield Payment_1.Payment.findAll({
            where: whereClause,
            attributes: ['payment_method', 'amount']
        });
        const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);
        const paymentCount = payments.length;
        const averagePayment = paymentCount > 0 ? totalRevenue / paymentCount : 0;
        const methodBreakdown = {};
        payments.forEach(p => {
            methodBreakdown[p.payment_method] = (methodBreakdown[p.payment_method] || 0) + parseFloat(p.amount.toString());
        });
        res.json({
            total_revenue: totalRevenue,
            payment_count: paymentCount,
            average_payment: averagePayment,
            method_breakdown: methodBreakdown
        });
    }
    catch (error) {
        console.error('Error calculating revenue', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getRevenueSummary = getRevenueSummary;
// ... rest of the file remains the same
