import CheepData from "../cheep/cheep_data";
import UserData from "../user/user_data";

interface LikeData
{
    id: number;
    cheep_id: CheepData["id"];
    user_id: UserData["id"];
}

export default LikeData;