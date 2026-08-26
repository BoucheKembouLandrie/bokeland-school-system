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
exports.getAllPayments = void 0;
const Payment_1 = require("../models/Payment");
// SIMPLIFIED VERSION - Returns all payments with mock client data
const getAllPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('\n=== GET ALL PAYMENTS ===');
    try {
        const payments = yield Payment_1.Payment.findAll({
            order: [['createdAt', 'DESC']],
            limit: 100
        });
        console.log(`Found ${payments.length} payments`);
        const result = payments.map(p => (Object.assign(Object.assign({}, p.toJSON()), { Client: {
                id: 1,
                school_name: 'LEUANA SCHOOL',
                email: 'contact@leuana.com',
                phone: '+237123456789',
                status: 'ACTIVE'
            } })));
        res.json(result);
    }
    catch (error) {
        console.error('ERROR:', error);
        res.status(500).json({ error: String(error) });
    }
});
exports.getAllPayments = getAllPayments;
