import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const dialect = (process.env.DB_DIALECT as any) || 'postgres';

export const sequelize = new Sequelize({
    dialect: dialect,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5433,
    database: process.env.DB_NAME || 'bokeland_licence_db',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || '',
    storage: process.env.DB_STORAGE || './license.sqlite',
    logging: false,
});
