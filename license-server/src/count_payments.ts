import { sequelize } from './config/database';
import { Payment } from './models/Payment';

async function countPayments() {
    try {
        const count = await Payment.count();
        console.log(`Total payments in database: ${count}`);

        if (count > 0) {
            const recent = await Payment.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'client_id', 'amount', 'payment_method', 'payment_date', 'status', 'days_added']
            });

            console.log('\nRecent payments:');
            recent.forEach(p => {
                console.log(`  ID: ${p.id}, Client: ${p.client_id}, Amount: ${p.amount}, Method: ${p.payment_method}, Date: ${p.payment_date}, Status: ${p.status}`);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

countPayments();
