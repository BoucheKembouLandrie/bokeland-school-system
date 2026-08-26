import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || 'bokeland_community_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    logging: false,
});
