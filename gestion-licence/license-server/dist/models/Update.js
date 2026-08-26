"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Update = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Update extends sequelize_1.Model {
}
exports.Update = Update;
Update.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    version: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    changelog: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    manifest: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    release_date: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
    tableName: 'updates',
});
