import UserData from "../../model/user/user_data";

type FollowersListParams = {
    userHandle: UserData["handle"];
    nextTo?: UserData["id"];
};

export default FollowersListParams;