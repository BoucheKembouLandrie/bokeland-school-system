"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadcastImage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class BroadcastImage extends sequelize_1.Model {
}
exports.BroadcastImage = BroadcastImage;
BroadcastImage.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    filename: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    imageUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'broadcast_images',
});
