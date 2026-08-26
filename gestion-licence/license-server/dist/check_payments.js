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
function checkPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payments = yield Payment_1.Payment.findAll({
                include: [Client_1.Client],
                order: [['createdAt', 'DESC']]
            });
            console.log(`Total payments in database: ${payments.length}`);
            if (payments.length > 0) {
                console.log('\nRecent payments:');
                payments.slice(0, 5).forEach(p => {
                    console.log(`- ID: ${p.id}, Client: ${p.client_id}, Amount: ${p.amount}, Date: ${p.payment_date}, Status: ${p.status}`);
                });
            }
            else {
                console.log('No payments found in database.');
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
checkPayments();
