import { sequelize } from './config/database';
import { Payment } from './models/Payment';
import { Client } from './models/Client';

// Set up associations like in server.ts
Client.hasMany(Payment, { foreignKey: 'client_id', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

async function testFetch() {
    try {
        console.log('Testing payment fetch with filters...\n');

        // Test 1: All payments
        const allPayments = await Payment.findAll({
            order: [['createdAt', 'DESC']]
        });
        console.log(`Total payments (no filter): ${allPayments.length}`);

        // Test 2: With date filter (like the frontend sends)
        const startDate = new Date('2025-12-20');
        const endDate = new Date('2026-01-20');
        endDate.setDate(endDate.getDate() + 1); // Add 1 day

        const filteredPayments = await Payment.findAll({
            where: {
                payment_date: {
                    $between: [startDate, endDate]
                }
            },
            order: [['createdAt', 'DESC']]
        });
        console.log(`Payments with date filter (2025-12-20 to 2026-01-21): ${filteredPayments.length}`);

        // Test 3: Manual payments only
        const manualPayments = await Payment.findAll({
            where: {
                payment_method: 'manual'
            },
            order: [['createdAt', 'DESC']]
        });
        console.log(`Manual payments: ${manualPayments.length}`);

        if (manualPayments.length > 0) {
            console.log('\nManual payment details:');
            manualPayments.forEach(p => {
                console.log(`  - ID: ${p.id}, Date: ${p.payment_date}, Amount: ${p.amount}`);
            });
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

testFetch();
