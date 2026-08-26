"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pricing = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Pricing extends sequelize_1.Model {
}
exports.Pricing = Pricing;
Pricing.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        unique: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },
    days_added: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 444,
    },
    label: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'Abonnement annuel',
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'pricings',
});
