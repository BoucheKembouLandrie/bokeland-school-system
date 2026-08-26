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
function countPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const count = yield Payment_1.Payment.count();
            console.log(`Total payments in database: ${count}`);
            if (count > 0) {
                const recent = yield Payment_1.Payment.findAll({
                    limit: 10,
                    order: [['createdAt', 'DESC']],
                    attributes: ['id', 'client_id', 'amount', 'payment_method', 'payment_date', 'status', 'days_added']
                });
                console.log('\nRecent payments:');
                recent.forEach(p => {
                    console.log(`  ID: ${p.id}, Client: ${p.client_id}, Amount: ${p.amount}, Method: ${p.payment_method}, Date: ${p.payment_date}, Status: ${p.status}`);
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
countPayments();
