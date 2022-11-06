import { SearchUserResult, ShortUserInformation } from "../../model/user/user_model_manager";
import APIResponse from "../api_response";
import generateToken from "../auth/generate_token";
import StatusCode from "../status_code";

export class UserInformationResponse extends APIResponse
{
    /**
     * Status code: OK.
     * @param userData The information of the user.
     */
    constructor(userData: ShortUserInformation)
    {
        super(StatusCode.OK, { user: userData });
    }
}

export class UserCreatedResponse extends APIResponse
{
    /**
     * Status code: Created.
     * @param user The new user's information.
     */
    constructor(user: ShortUserInformation)
    {
        super(StatusCode.Created, { user });
    }
}

export class SuccessfulLoginResponse extends APIResponse
{
    /**
     * Status code: OK.
     * @param userData The information of the current user.
     */
    constructor(userData: ShortUserInformation)
    {
        const token = generateToken(userData);

        super(StatusCode.OK, { user: userData, token: token });
    }
}

export class FollowResponse extends APIResponse
{
    /**
     * Status code: Created.
     */
    constructor()
    {
        super(StatusCode.Created);
    }
}

export class UnfollowResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor()
    {
        super(StatusCode.OK);
    }
}

export class UsersListResponse extends APIResponse
{
    /**
     * Status code: OK.
     * @param searchResult The result of searching users.
     */
    constructor(searchResult: SearchUserResult)
    {
        super(StatusCode.OK, searchResult);
    }
}