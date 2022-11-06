import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import Cheep from "../cheep/cheep";
import db from "../db/";
import User from "../user/user";
import RecheepData from "./recheep_data";

class Recheep extends Model<InferAttributes<Recheep>, InferCreationAttributes<Recheep>> implements RecheepData
{
    declare cheep_id: number;
    declare user_id: number;
}

export async function initializeRecheep(): Promise<void>
{
    Recheep.init(
        {
            cheep_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep.tableName,
                    key: "id"
                },
                primaryKey: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User.tableName,
                    key: "id"
                },
                primaryKey: true
            }
        },
        {
            sequelize: db,
            tableName: "recheeps",
            timestamps: false,
            indexes: [
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

    await Recheep.sync();
}

export default Recheep;