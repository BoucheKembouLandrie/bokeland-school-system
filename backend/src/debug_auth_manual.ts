const fs = require('fs');
console.log("STARTING SCRIPT");
fs.writeFileSync('debug_auth_out.txt', 'Starting...\n');

const main = async () => {
    try {
        const path = require('path');
        const dotenv = require('dotenv');
        dotenv.config({ path: path.join(__dirname, '../.env') });

        const { sequelize } = require('./models');
        const User = require('./models/User').default;
        const bcrypt = require('bcrypt');
        const jwt = require('jsonwebtoken');

        fs.appendFileSync('debug_auth_out.txt', 'Modules loaded.\n');

        console.log('🔍 Starting Auth Diagnostics...');

        // 1. Check User exists
        let user = await User.findOne({ where: { username: 'admin' } });
        if (!user) {
            fs.appendFileSync('debug_auth_out.txt', '❌ User "admin" NOT FOUND in database!\n');
            // Create it?
            console.log('✨ Creating "admin" user...');
            const hashedPassword = await bcrypt.hash('admin', 10);
            user = await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
                email: 'admin@test.com',
                is_default: true
            });
            fs.appendFileSync('debug_auth_out.txt', '✅ User "admin" created.\n');
        } else {
            fs.appendFileSync('debug_auth_out.txt', '✅ User "admin" found.\n');
        }

        // 2. Reset Password
        fs.appendFileSync('debug_auth_out.txt', '🔄 Resetting password to "Admin@123"...\n');
        const newHash = await bcrypt.hash('Admin@123', 10);
        await user.update({ password: newHash });
        fs.appendFileSync('debug_auth_out.txt', '✅ Password updated.\n');

        // 3. Test Compare
        const isMatch = await bcrypt.compare('Admin@123', user.password);
        fs.appendFileSync('debug_auth_out.txt', `🔐 Password Comparison ('Admin@123' vs hash): ${isMatch ? '✅ MATCH' : '❌ FAIL'}\n`);

        // 4. Test Token Generation (Auth Controller Logic)
        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        fs.appendFileSync('debug_auth_out.txt', `🔑 Using JWT Secret (first 2 chars): ${secret.substring(0, 2)}...\n`);

        const token = jwt.sign(
            { id: user.id, role: user.role },
            secret,
            { expiresIn: '1d' }
        );
        fs.appendFileSync('debug_auth_out.txt', '🎫 Token generated.\n');

        // 5. Test Token Verification (Auth Middleware Logic)
        try {
            const decoded = jwt.verify(token, secret);
            fs.appendFileSync('debug_auth_out.txt', '✅ Token Verified successfully!\n');
            fs.appendFileSync('debug_auth_out.txt', `   Payload: ${JSON.stringify(decoded)}\n`);
        } catch (err: any) {
            fs.appendFileSync('debug_auth_out.txt', `❌ Token Verification FAILED: ${err.message}\n`);
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Diagnostics failed:', error);
        fs.appendFileSync('debug_auth_out.txt', `❌ Diagnostics failed: ${error}\n`);
        process.exit(1);
    }
};

main();
