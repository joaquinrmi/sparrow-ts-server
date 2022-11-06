import UserData from "../../model/user/user_data";

type RecommendedListParams = {
    nextTo?: UserData["id"];
};

export default RecommendedListParams;