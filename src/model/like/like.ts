import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import Cheep from "../cheep/cheep";
import db from "../db";
import User from "../user/user";
import LikeData from "./like_data";

class Like extends Model<InferAttributes<Like>, InferCreationAttributes<Like>> implements LikeData
{
    declare id: number;
    declare cheep_id: number;
    declare user_id: number;
}

export async function initializeLike(): Promise<void>
{
    Like.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            cheep_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep.tableName,
                    key: "id"
                }
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User.tableName,
                    key: "id"
                }
            }
        },
        {
            sequelize: db,
            tableName: "likes",
            timestamps: false,
            indexes: [
                {
                    fields: [ "cheep_id", "user_id" ],
                    unique: true
                },
                {
                    fields: [ "cheep_id" ],
                    unique: false
                },
                {
                    fields: [ "user_id" ],
                    unique: false
                }
            ]
        }
    );

    await Like.sync();
}

export default Like;