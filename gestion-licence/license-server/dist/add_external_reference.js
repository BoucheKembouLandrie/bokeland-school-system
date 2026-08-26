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
function addMissingColumns() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Adding missing columns to Payments table...');
            // Add external_reference column if it doesn't exist
            yield database_1.sequelize.query(`
            ALTER TABLE Payments ADD COLUMN external_reference TEXT;
        `).catch(() => console.log('external_reference column already exists'));
            console.log('✅ Migration complete!');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Migration failed:', error);
            process.exit(1);
        }
    });
}
addMissingColumns();
