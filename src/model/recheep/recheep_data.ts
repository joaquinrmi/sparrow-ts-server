import CheepData from "../cheep/cheep_data";
import UserData from "../user/user_data";

interface RecheepData
{
    cheep_id: CheepData["id"];
    user_id: UserData["id"];
}

export default RecheepData;