import APIResponse from "../../routes/api_response";
import Credentials from "../../routes/auth/credentials";
import ErrorResponse from "../../routes/error_response";
import CreateUserForm from "../../routes/forms/create_user_form";
import LoginForm from "../../routes/forms/login_form";
import FollowersListParams from "../../routes/forms/followers_list_params";
import RecommendedListParams from "../../routes/forms/recommended_list_params";
import UsersLikedListParams from "../../routes/forms/users_liked_list_params";
import SearchUsersParams from "../../routes/forms/search_users_params";
import CreateCheepForm from "../../routes/forms/create_cheep_form";
import GetCheepParams from "../../routes/forms/get_cheep_params";
import LikedCheepsParams from "../../routes/forms/liked_cheeps_params";
import GetTimelineParams from "../../routes/forms/get_timeline_params";
import SearchCheepsParams from "../../routes/forms/search_cheeps_params";
import LikeParams from "../../routes/forms/like_params";
import ExploreParams from "../../routes/forms/explore_params";
import DeleteCheepParams from "../../routes/forms/delete_cheep_params";
import GetProfileParams from "../../routes/forms/get_profile_params";
import UpdateProfileForm from "../../routes/forms/update_profile_form";
import DeleteRecheepParams from "../../routes/forms/delete_recheep_params";

declare global
{
    namespace Express
    {
        interface Request
        {
            credentials: Credentials;
            createUserForm: CreateUserForm;
            loginForm: LoginForm;
            followersListParams: FollowersListParams;
            recommendedListParams: RecommendedListParams;
            usersLikedListParams: UsersLikedListParams;
            searchUsersParams: SearchUsersParams;
            createCheepForm: CreateCheepForm;
            getCheepParams: GetCheepParams;
            likedCheepsParams: LikedCheepsParams;
            getTimelineParams: GetTimelineParams;
            searchCheepsParams: SearchCheepsParams;
            likeParams: LikeParams;
            undoLikeParams: LikeParams;
            exploreParams: ExploreParams;
            deleteCheepParams: DeleteCheepParams;
            getProfileParams: GetProfileParams;
            updateProfileForm: UpdateProfileForm;
            deleteRecheepParams: DeleteRecheepParams;
        }

        interface Response
        {
            submit(response: APIResponse): void;
            error(error: ErrorResponse): void;
        }
    }
}