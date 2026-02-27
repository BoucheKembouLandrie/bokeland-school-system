import { sequelize } from './models';
import User from './models/User';
import bcrypt from 'bcrypt';

const debugUserCreation = async () => {
    try {
        console.log('🔄 Connecting to DB...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        console.log('🔄 Checking if admin exists...');
        let user = await User.findOne({ where: { username: 'admin' } });

        if (user) {
            console.log('⚠️ Admin user already exists:', user.toJSON());
        } else {
            console.log('🔄 Creating admin user...');
            const hashedPassword = await bcrypt.hash('admin', 10);
            user = await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                email: 'test@example.com',
                is_default: true
            });
            console.log('✅ Default admin user created:', user.toJSON());
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ User creation failed:', error);
        process.exit(1);
    }
};

debugUserCreation();
