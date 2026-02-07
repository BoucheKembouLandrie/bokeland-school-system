import { sequelize } from './config/database';
import { Payment } from './models/Payment';
import { Client } from './models/Client';

async function checkPayments() {
    try {
        const payments = await Payment.findAll({
            include: [Client],
            order: [['createdAt', 'DESC']]
        });

        console.log(`Total payments in database: ${payments.length}`);

        if (payments.length > 0) {
            console.log('\nRecent payments:');
            payments.slice(0, 5).forEach(p => {
                console.log(`- ID: ${p.id}, Client: ${p.client_id}, Amount: ${p.amount}, Date: ${p.payment_date}, Status: ${p.status}`);
            });
        } else {
            console.log('No payments found in database.');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkPayments();
