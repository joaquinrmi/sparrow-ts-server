import UserData from "../../model/user/user_data";

type TokenData = {
    userId: UserData["id"];
    userHandle: UserData["handle"];
};

export default TokenData;