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
function migrate() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting migration...');
            // Check if column exists (optional for SQLite, but good practice. For now just try adding it)
            try {
                yield database_1.sequelize.query('ALTER TABLE Payments ADD COLUMN invoice_number TEXT;');
                console.log('Added invoice_number column.');
            }
            catch (error) {
                if (error.message.includes('duplicate column name')) {
                    console.log('Column invoice_number already exists.');
                }
                else {
                    throw error;
                }
            }
            console.log('Migration completed successfully.');
        }
        catch (error) {
            console.error('Migration failed:', error);
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
migrate();
