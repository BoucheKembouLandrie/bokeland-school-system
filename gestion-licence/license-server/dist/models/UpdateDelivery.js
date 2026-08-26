"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDelivery = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class UpdateDelivery extends sequelize_1.Model {
}
exports.UpdateDelivery = UpdateDelivery;
UpdateDelivery.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    update_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    client_id: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        defaultValue: 'PENDING',
        validate: { isIn: [['PENDING', 'DELIVERED', 'INSTALLED']] }
    },
    delivered_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    acknowledged_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'update_deliveries',
});
