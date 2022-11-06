import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import db from "../db/db";
import UserData from "./user_data";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> implements UserData
{
    declare id: number;
    declare handle: string;
    declare email: string;
    declare password: string;
}

export async function initializeUser(): Promise<void>
{
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            handle: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false
            },
            email: {
                type: DataTypes.TEXT,
                unique: true,
                allowNull: false
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false
            },
        },
        {
            sequelize: db,
            tableName: "users",
            timestamps: false,
            indexes: [
                {
                    fields: [ "handle" ],
                    unique: true
                },
                {
                    fields: [ "email" ],
                    unique: true
                }
            ]
        }
    );

    await User.sync();
}

export default User;