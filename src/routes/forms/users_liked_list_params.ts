import CheepData from "../../model/cheep/cheep_data";
import UserData from "../../model/user/user_data";

type UsersLikedListParams = {
    cheepId: CheepData["id"];
    nextTo?: UserData["id"];
};

export default UsersLikedListParams;