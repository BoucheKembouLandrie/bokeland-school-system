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
function diagnose() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Raw SQL query to see exactly what's in the database
            const [results] = yield database_1.sequelize.query(`
            SELECT 
                id, 
                client_id, 
                amount, 
                payment_method,
                datetime(payment_date) as payment_date_formatted,
                status,
                days_added
            FROM Payments 
            ORDER BY payment_date DESC
            LIMIT 10
        `);
            console.log('\n=== PAYMENTS IN DATABASE ===');
            console.log(`Total found: ${results.length}`);
            console.log('\nDetails:');
            results.forEach((row) => {
                console.log(`  ID: ${row.id}, Client: ${row.client_id}, Amount: ${row.amount}, Method: ${row.payment_method}`);
                console.log(`  Date: ${row.payment_date_formatted}, Status: ${row.status}, Days: ${row.days_added}`);
                console.log('');
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
diagnose();
