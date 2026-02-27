
import { sequelize } from './models';
import User from './models/User';
import bcrypt from 'bcrypt';

const run = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { role: 'admin' } });
        if (user) {
            console.log("Current Username:", user.username);

            const hashedPassword = await bcrypt.hash('Admin@123', 10);

            await user.update({
                username: 'admin',
                password: hashedPassword
            });
            console.log("Fixed Admin User: username='admin', password='Admin@123'");
        } else {
            console.log("Admin user not found.");
        }
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
};

run();
