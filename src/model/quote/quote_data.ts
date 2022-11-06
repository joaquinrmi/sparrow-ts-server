import CheepData from "../cheep/cheep_data";

interface QuoteData
{
    cheep_id: CheepData["id"];
    target_cheep_id: CheepData["id"];
}

export default QuoteData;