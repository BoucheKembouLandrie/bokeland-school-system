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
const database_1 = require("./config/database");
const Payment_1 = require("./models/Payment");
const Client_1 = require("./models/Client");
// Set up associations like in server.ts
Client_1.Client.hasMany(Payment_1.Payment, { foreignKey: 'client_id', as: 'payments' });
Payment_1.Payment.belongsTo(Client_1.Client, { foreignKey: 'client_id', as: 'Client' });
function testFetch() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Testing payment fetch with filters...\n');
            // Test 1: All payments
            const allPayments = yield Payment_1.Payment.findAll({
                order: [['createdAt', 'DESC']]
            });
            console.log(`Total payments (no filter): ${allPayments.length}`);
            // Test 2: With date filter (like the frontend sends)
            const startDate = new Date('2025-12-20');
            const endDate = new Date('2026-01-20');
            endDate.setDate(endDate.getDate() + 1); // Add 1 day
            const filteredPayments = yield Payment_1.Payment.findAll({
                where: {
                    payment_date: {
                        $between: [startDate, endDate]
                    }
                },
                order: [['createdAt', 'DESC']]
            });
            console.log(`Payments with date filter (2025-12-20 to 2026-01-21): ${filteredPayments.length}`);
            // Test 3: Manual payments only
            const manualPayments = yield Payment_1.Payment.findAll({
                where: {
                    payment_method: 'manual'
                },
                order: [['createdAt', 'DESC']]
            });
            console.log(`Manual payments: ${manualPayments.length}`);
            if (manualPayments.length > 0) {
                console.log('\nManual payment details:');
                manualPayments.forEach(p => {
                    console.log(`  - ID: ${p.id}, Date: ${p.payment_date}, Amount: ${p.amount}`);
                });
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
testFetch();
