import UserData from "../../model/user/user_data";

type SearchUsersParams = {
    nameOrHandle?: string;
    nextTo?: UserData["id"];
};

export default SearchUsersParams;