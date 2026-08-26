"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityMessage = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class CommunityMessage extends sequelize_1.Model {
}
exports.CommunityMessage = CommunityMessage;
CommunityMessage.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sender_key: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    sender_name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    is_admin: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    content: { type: sequelize_1.DataTypes.TEXT, allowNull: false },
    type: { type: sequelize_1.DataTypes.ENUM('text', 'image', 'audio', 'link', 'document'), defaultValue: 'text' },
    file_url: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reply_to_id: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    reply_preview: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    deleted: { type: sequelize_1.DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    sender_logo: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    reactions: { type: sequelize_1.DataTypes.JSON, defaultValue: {} },
}, {
    sequelize: database_1.sequelize,
    tableName: 'community_messages',
    timestamps: false,
});
