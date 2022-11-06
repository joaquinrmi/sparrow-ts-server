import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import db from "../db/db";
import User from "../user/user";
import ProfileData from "./profile_data";

class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> implements ProfileData
{
    declare id: number;
    declare user_id: number;
    declare name: string;
    declare picture: string;
    declare banner: string;
    declare description: string;
    declare join_date: Date;
    declare birthdate: Date;
    declare location: string;
    declare website: string;
}

export async function initializeProfile(): Promise<void>
{
    Profile.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User.tableName,
                    key: "id"
                },
                unique: true,
                allowNull: false
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            picture: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            banner: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            join_date: {
                type: DataTypes.DATE,
                allowNull: false
            },
            birthdate: {
                type: DataTypes.DATE,
                allowNull: true
            },
            location: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            website: {
                type: DataTypes.TEXT,
                allowNull: true
            },
        },
        {
            sequelize: db,
            tableName: "profiles",
            timestamps: false,
            indexes: [
                {
                    fields: [ "user_id" ],
                    unique: true
                }
            ]
        }
    );

    await Profile.sync();
}

export default Profile;