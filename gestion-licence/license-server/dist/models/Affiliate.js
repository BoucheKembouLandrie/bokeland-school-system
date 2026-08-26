"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Affiliate = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Affiliate extends sequelize_1.Model {
}
exports.Affiliate = Affiliate;
Affiliate.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    password_hash: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'GHOST',
        validate: { isIn: [['GHOST', 'ACTIVE', 'BANNED']] }
    },
    custom_commission_rate: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
    },
    otp_code: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    otp_expires_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        defaultValue: null,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'affiliates',
});
