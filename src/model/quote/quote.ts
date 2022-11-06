import { Model, InferAttributes, InferCreationAttributes, DataTypes } from "sequelize";
import Cheep from "../cheep/cheep";
import db from "../db/";
import QuoteData from "./quote_data";

class Quote extends Model<InferAttributes<Quote>, InferCreationAttributes<Quote>> implements QuoteData
{
    declare cheep_id: number;
    declare target_cheep_id: number;
}

export async function initializeQuote(): Promise<void>
{
    Quote.init(
        {
            cheep_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep.tableName,
                    key: "id"
                },
                primaryKey: true
            },
            target_cheep_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: Cheep.tableName,
                    key: "id"
                },
                primaryKey: true
            }
        },
        {
            sequelize: db,
            tableName: "quotes",
            timestamps: false,
            indexes: [
                {
                    fields: [ "cheep_id" ],
                    unique: true
                },
                {
                    fields: [ "target_cheep_id" ],
                    unique: true
                }
            ]
        }
    );

    await Quote.sync();
}

export default Quote;