import { sequelize } from './models';

const resetDatabase = async () => {
    try {
        console.log('🔄 Starting local database reset...');
        await sequelize.sync({ force: true });
        console.log('✅ Local database reset complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database reset failed:', error);
        process.exit(1);
    }
};

resetDatabase();
