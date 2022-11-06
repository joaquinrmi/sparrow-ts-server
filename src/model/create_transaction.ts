import { Transaction } from "sequelize";
import db from "./db";

async function createTransaction(t?: Transaction): Promise<Transaction>
{
    if(t) return t;
    else return await db.transaction();
}

export default createTransaction;