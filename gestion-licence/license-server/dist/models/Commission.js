"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commission = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Commission extends sequelize_1.Model {
}
exports.Commission = Commission;
Commission.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    affiliate_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    payment_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    amount: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'PENDING',
        validate: { isIn: [['PENDING', 'PAID', 'CANCELLED']] }
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'commissions',
});
