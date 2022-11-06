import UserData from "../../model/user/user_data";

type Credentials = {
    id: UserData["id"];
    handle: UserData["handle"];
};

export default Credentials;