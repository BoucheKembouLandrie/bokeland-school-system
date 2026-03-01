import { Client } from './src/models/Client';
import { Payment } from './src/models/Payment';
import sequelize from './src/config/database';

async function testExtensionLogic() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected\n');

        // Find a test client
        const client = await Client.findOne({
            order: [['id', 'DESC']]
        });

        if (!client) {
            console.log('❌ No client found');
            return;
        }

        console.log('📋 BEFORE EXTENSION:');
        console.log(`   Client: ${client.school_name}`);
        console.log(`   Status: ${client.status}`);
        console.log(`   Expiration: ${client.subscription_end_date}`);

        const currentEnd = new Date(client.subscription_end_date);
        const now = new Date();
        const isExpired = currentEnd < now;
        const daysRemaining = Math.ceil((currentEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        console.log(`   Is Expired: ${isExpired}`);
        console.log(`   Days Remaining: ${daysRemaining}\n`);

        // Simulate extension with 333 days
        const daysToAdd = 333;
        console.log(`🔄 SIMULATING EXTENSION WITH ${daysToAdd} DAYS:\n`);

        // This is the EXACT logic from paymentController.ts
        const baseDate = isExpired ? now : currentEnd;
        const newEnd = new Date(baseDate);
        newEnd.setDate(newEnd.getDate() + daysToAdd);

        console.log(`   Base Date (${isExpired ? 'TODAY' : 'CURRENT END'}): ${baseDate.toISOString()}`);
        console.log(`   New Expiration: ${newEnd.toISOString()}`);

        const newDaysRemaining = Math.ceil((newEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`   New Days Remaining: ${newDaysRemaining}`);

        if (isExpired) {
            console.log(`\n✅ EXPECTED: ${daysToAdd} days (starting from today)`);
            console.log(`   ACTUAL: ${newDaysRemaining} days`);
            console.log(`   MATCH: ${Math.abs(newDaysRemaining - daysToAdd) <= 1 ? 'YES ✅' : 'NO ❌'}`);
        } else {
            console.log(`\n✅ EXPECTED: ~${daysRemaining + daysToAdd} days (adding to existing)`);
            console.log(`   ACTUAL: ${newDaysRemaining} days`);
            console.log(`   MATCH: ${Math.abs(newDaysRemaining - (daysRemaining + daysToAdd)) <= 1 ? 'YES ✅' : 'NO ❌'}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testExtensionLogic();
