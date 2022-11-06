import UserData from "../user/user_data";

interface FollowData
{
    id: number;
    user_id: UserData["id"];
    target_id: UserData["id"];
}

export default FollowData;