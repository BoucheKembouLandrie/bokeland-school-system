import { sequelize } from './config/database';

async function diagnose() {
    try {
        // Raw SQL query to see exactly what's in the database
        const [results] = await sequelize.query(`
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
        results.forEach((row: any) => {
            console.log(`  ID: ${row.id}, Client: ${row.client_id}, Amount: ${row.amount}, Method: ${row.payment_method}`);
            console.log(`  Date: ${row.payment_date_formatted}, Status: ${row.status}, Days: ${row.days_added}`);
            console.log('');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

diagnose();
