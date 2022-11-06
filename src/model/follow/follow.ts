import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import db from "../db";
import User from "../user/user";
import FollowData from "./Follow_data";

class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> implements FollowData
{
    declare id: number;
    declare user_id: number;
    declare target_id: number;
}

export async function initializeFollow(): Promise<void>
{
    Follow.init(
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
                }
            },
            target_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User.tableName,
                    key: "id"
                }
            }
        },
        {
            sequelize: db,
            tableName: "follows",
            timestamps: false,
            indexes: [
                {
                    fields: [ "user_id", "target_id" ],
                    unique: true
                },
                {
                    fields: [ "user_id" ],
                    unique: false
                },
                {
                    fields: [ "target_id" ],
                    unique: false
                }
            ]
        }
    );

    await Follow.sync();
}

export default Follow;