import CheepData from "../../model/cheep/cheep_data";
import UserData from "../../model/user/user_data";

type LikedCheepsParams = {
    userHandle: UserData["handle"];
    nextTo?: CheepData["id"];
};

export default LikedCheepsParams;