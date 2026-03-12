import { Sequelize } from 'sequelize';
import path from 'path';

// Utiliser une DB SQLite indépendante
export const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../community.sqlite'),
    logging: false,
});
