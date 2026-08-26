require('dotenv').config();
const { Affiliate } = require('./dist/models/Affiliate');
const { Client } = require('./dist/models/Client');
const { Commission } = require('./dist/models/Commission');

// Re-initialize relationships just as in server.js
Affiliate.hasMany(Commission, { foreignKey: 'affiliate_id', as: 'commissions' });
Commission.belongsTo(Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });

Affiliate.hasMany(Client, { foreignKey: 'affiliate_id', as: 'clients' });
Client.belongsTo(Affiliate, { foreignKey: 'affiliate_id', as: 'affiliate' });

Client.hasMany(Commission, { foreignKey: 'client_id', as: 'commissions' });
Commission.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

async function run() {
    try {
        const affiliates = await Affiliate.findAll({
            include: [
                { model: Client, as: 'clients', attributes: ['school_name', 'status'] },
                { model: Commission, as: 'commissions', attributes: ['amount'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        console.log("SUCCESS:", JSON.stringify(affiliates, null, 2));
    } catch (err) {
        console.error("ERROR FETCHING AFFILIATES:", err);
    }
    process.exit(0);
}
run();
