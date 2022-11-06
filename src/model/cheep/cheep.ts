import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import db from "../db/db";
import User from "../user/user";
import CheepData from "./cheep_data";

class Cheep extends Model<InferAttributes<Cheep>, InferCreationAttributes<Cheep>> implements CheepData
{
    declare id: number;
    declare author_id: number;
    declare date_created: Date;
    declare response_target: number;
    declare quote_target: number;
    declare content: string;
    declare gallery: string[];
}

export async function initializeCheep(): Promise<void>
{
    Cheep.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            author_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: User.tableName,
                    key: "id"
                },
                allowNull: false
            },
            date_created: {
                type: DataTypes.DATE,
                allowNull: false
            },
            response_target: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep,
                    key: "id"
                },
                allowNull: true
            },
            quote_target: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep,
                    key: "id"
                },
                allowNull: true
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            gallery: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: true
            }
        },
        {
            sequelize: db,
            tableName: "cheeps",
            timestamps: false,
            indexes: [
                {
                    fields: [ "author_id" ],
                    unique: false
                },
                {
                    fields: [ "response_target" ],
                    unique: false
                },
                {
                    fields: [ "quote_target" ],
                    unique: false
                },
            ]
        }
    );

    await Cheep.sync();
}

export default Cheep;