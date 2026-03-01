
import { sequelize } from './models';
import User from './models/User';
import bcrypt from 'bcrypt';

const run = async () => {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { role: 'admin' } });
        if (user) {
            const hashedPassword = await bcrypt.hash('Admin@123', 10);
            await user.update({ password: hashedPassword });
            console.log("Password reset for admin.");
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
