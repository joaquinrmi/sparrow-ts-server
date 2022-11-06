import { Transaction } from "sequelize";
import CheepData from "../cheep/cheep_data";

interface QuoteModelManager
{
    create(data: CreateQuoteData, t?: Transaction): Promise<void>;

    delete(data: DeleteQuoteData, t?: Transaction): Promise<void>;
}

export type CreateQuoteData = {
    cheepId: CheepData["id"];
    targetCheepId: CheepData["id"];
};

export type DeleteQuoteData = CreateQuoteData;

export default QuoteModelManager;