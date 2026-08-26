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
const Client_1 = require("./models/Client");
const Affiliate_1 = require("./models/Affiliate");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.sequelize.authenticate();
            console.log("Connected to DB");
            const clients = yield Client_1.Client.findAll({
                order: [['createdAt', 'DESC']],
                limit: 5
            });
            console.log("--- LATEST CLIENTS ---");
            for (const c of clients) {
                console.log(`ID: ${c.id}, School: ${c.school_name}, Email: ${c.email}, AffiliateID: ${c.affiliate_id}`);
            }
            const affiliates = yield Affiliate_1.Affiliate.findAll({
                order: [['createdAt', 'DESC']],
                limit: 5
            });
            console.log("--- LATEST AFFILIATES ---");
            for (const a of affiliates) {
                console.log(`ID: ${a.id}, Email: ${a.email}, Status: ${a.status}`);
            }
        }
        catch (e) {
            console.error("DB error:", e);
        }
        finally {
            yield database_1.sequelize.close();
        }
    });
}
run();
