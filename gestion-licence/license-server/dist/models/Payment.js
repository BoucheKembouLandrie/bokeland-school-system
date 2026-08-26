"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Payment extends sequelize_1.Model {
}
exports.Payment = Payment;
Payment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'clients',
            key: 'id'
        }
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    currency: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
        defaultValue: 'XAF',
    },
    payment_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    payment_method: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'manual',
    },
    transaction_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    external_reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    invoice_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'completed',
    },
    days_added: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 444,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'Payments',
    timestamps: true,
});
