import CheepData from "../../model/cheep/cheep_data";
import UserData from "../../model/user/user_data";

type SearchCheepsParams = {
    words?: string;
    userHandle?: UserData["handle"];
    responses?: boolean;
    onlyGallery?: boolean;
    responseOf?: CheepData["id"];
    quoteTarget?: CheepData["id"];
    recheepTarget?: CheepData["id"];
    nextTo?: CheepData["id"];
};

export default SearchCheepsParams;