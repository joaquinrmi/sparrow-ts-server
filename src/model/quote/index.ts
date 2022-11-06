import { Transaction } from "sequelize";
import QuoteModelManager, { CreateQuoteData } from "./quote_model_manager";

class PGQuoteModelManager implements QuoteModelManager
{
    public async create(data: CreateQuoteData, t?: Transaction): Promise<void>
    {
        throw new Error("Method not implemented.");
    }

    public async delete(data: CreateQuoteData, t?: Transaction): Promise<void>
    {
        throw new Error("Method not implemented.");
    }
}

const quoteModelManager = new PGQuoteModelManager();

export default quoteModelManager;