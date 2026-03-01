import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import licenseRoutes from './routes/licenseRoutes';
import adminRoutes from './routes/adminRoutes';
import { sequelize } from './config/database';
import { Client } from './models/Client';
import { Payment } from './models/Payment';
import { Config } from './models/Config';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Running on 3001 to avoid conflict with main backend (3000)

import path from 'path';

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, '../public'))); // Serve uploaded files
app.use(express.static(path.join(__dirname, '../public'))); // Serve root files like PDFs
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'))); // Direct access if needed

app.use('/api/license', licenseRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Leuana School License Server is Running');
});

// Set up model relationships
Client.hasMany(Payment, { foreignKey: 'client_id', as: 'payments' });
Payment.belongsTo(Client, { foreignKey: 'client_id', as: 'Client' });

// Sync Database and Start Server
sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`License Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Unable to connect to the database:', err);
});
