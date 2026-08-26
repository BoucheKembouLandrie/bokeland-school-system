import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface CommunityMessageAttributes {
    id: number;
    sender_key: string;       // client_key de la licence ou 'admin'
    sender_name: string;      // school_name ou "Admin Bokeland"
    is_admin: boolean;
    content: string;
    type: 'text' | 'image' | 'audio' | 'link' | 'document';
    file_url: string | null;
    reply_to_id: number | null;
    reply_preview: string | null; 
    deleted: boolean;
    created_at: Date;
    sender_logo: string | null;
    reactions: Record<string, string[]>;
}

interface CommunityMessageCreationAttributes extends Optional<CommunityMessageAttributes, 'id' | 'file_url' | 'reply_to_id' | 'reply_preview' | 'deleted' | 'created_at' | 'sender_logo' | 'reactions'> { }

export class CommunityMessage extends Model<CommunityMessageAttributes, CommunityMessageCreationAttributes>
    implements CommunityMessageAttributes {
    declare id: number;
    declare sender_key: string;
    declare sender_name: string;
    declare is_admin: boolean;
    declare content: string;
    declare type: 'text' | 'image' | 'audio' | 'link' | 'document';
    declare file_url: string | null;
    declare reply_to_id: number | null;
    declare reply_preview: string | null;
    declare deleted: boolean;
    declare created_at: Date;
    declare sender_logo: string | null;
    declare reactions: Record<string, string[]>;
}

CommunityMessage.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        sender_key: { type: DataTypes.STRING, allowNull: false },
        sender_name: { type: DataTypes.STRING, allowNull: false },
        is_admin: { type: DataTypes.BOOLEAN, defaultValue: false },
        content: { type: DataTypes.TEXT, allowNull: false },
        type: { type: DataTypes.ENUM('text', 'image', 'audio', 'link', 'document'), defaultValue: 'text' },
        file_url: { type: DataTypes.STRING, allowNull: true },
        reply_to_id: { type: DataTypes.INTEGER, allowNull: true },
        reply_preview: { type: DataTypes.STRING, allowNull: true },
        deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        sender_logo: { type: DataTypes.STRING, allowNull: true },
        reactions: { type: DataTypes.JSON, defaultValue: {} },
    },
    {
        sequelize,
        tableName: 'community_messages',
        timestamps: false,
    }
);
