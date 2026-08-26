import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Affiliate } from './models/Affiliate';

async function run() {
    try {
        await sequelize.authenticate();
        console.log("Connected to DB");
        
        const clients = await Client.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        
        console.log("--- LATEST CLIENTS ---");
        for (const c of clients) {
            console.log(`ID: ${c.id}, School: ${c.school_name}, Email: ${c.email}, AffiliateID: ${c.affiliate_id}`);
        }
        
        const affiliates = await Affiliate.findAll({
            order: [['createdAt', 'DESC']],
            limit: 5
        });
        
        console.log("--- LATEST AFFILIATES ---");
        for (const a of affiliates) {
            console.log(`ID: ${a.id}, Email: ${a.email}, Status: ${a.status}`);
        }
    } catch (e) {
        console.error("DB error:", e);
    } finally {
        await sequelize.close();
    }
}

run();
