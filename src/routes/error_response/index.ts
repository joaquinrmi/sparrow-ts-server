import APIError, { CheepDoesNotExistAPIError, InsufficientPermissionsAPIError, InternalServerAPIError, InvalidBirthdateAPIError, InvalidCheepIdParamAPIError, InvalidContentAPIError, InvalidCredentialsAPIError, InvalidEmailAPIError, InvalidFormAPIError, InvalidFullNameAPIError, InvalidGalleryAPIError, InvalidHandleAPIError, InvalidNameOrHandleParamAPIError, InvalidNextToParamAPIError, InvalidOnlyGalleryParamAPIError, InvalidPasswordAPIError, InvalidQuoteTargetAPIError, InvalidRecheepTargetParamAPIError, InvalidResponseOfParamAPIError, InvalidResponsesParamAPIError, InvalidResponseTargetAPIError, InvalidUserHandleParamAPIError, InvalidUserIdParamAPIError, InvalidWordsParamAPIError, ProfileDoesNotExistAPIError, RecheepAlreadyExistsAPIError, UnavailableEmailAPIError, UnavailableHandleAPIError, UserDoesNotExistAPIError } from "../api_error";
import ErrorResponse from "./error_response";
import StatusCode from "../status_code";
import CreateUserForm from "../forms/create_user_form";
import FollowersListParams from "../forms/followers_list_params";
import UsersLikedListParams from "../forms/users_liked_list_params";
import SearchUsersParams from "../forms/search_users_params";
import CreateCheepForm from "../forms/create_cheep_form";
import LikedCheepsParams from "../forms/liked_cheeps_params";
import SearchCheepsParams from "../forms/search_cheeps_params";
import DeleteRecheepParams from "../forms/delete_recheep_params";

class InvalidFormOrParamsResponse<FormType> extends ErrorResponse
{
    constructor(errorFactory: Errors<FormType>, fields: Fields<FormType>)
    {
        const errors = new Array<APIError>();
        for(const key in fields)
        {
            if(fields[key])
            {
                errors.push(errorFactory[key]());
            }
        }

        super(StatusCode.BadRequest, errors);
    }
}

export class InternalServerErrorResponse extends ErrorResponse
{
    /**
     * Status code: Internal Server Error.
     */
    constructor()
    {
        super(StatusCode.InternalServerError, [ new InternalServerAPIError() ]);
    }
}

export class InvalidFormErrorResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidFormAPIError() ]);
    }
}

export class InvalidSignupFormResponse extends InvalidFormOrParamsResponse<CreateUserForm>
{
    private static errors: InvalidSignupFormErrors = {
        handle: () => new InvalidHandleAPIError(),
        email: () => new InvalidEmailAPIError(),
        password: () => new InvalidPasswordAPIError(),
        fullName: () => new InvalidFullNameAPIError(),
        birthdate: () => new InvalidBirthdateAPIError(),
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidSignupFormFields)
    {
        super(InvalidSignupFormResponse.errors, fields);
    }
}

export class UnavailableHandleResponse extends ErrorResponse
{
    /**
     * Status code: Conflict.
     */
    constructor()
    {
        super(StatusCode.Conflict, [ new UnavailableHandleAPIError() ]);
    }
}

export class UnavailableEmailResponse extends ErrorResponse
{
    /**
     * Status code: Conflict.
     */
    constructor()
    {
        super(StatusCode.Conflict, [ new UnavailableEmailAPIError() ]);
    }
}

export class InvalidCredentialsResponse extends ErrorResponse
{
    /**
     * Status code: Unauthorized.
     */
    constructor()
    {
        super(StatusCode.Unauthorized, [ new InvalidCredentialsAPIError() ]);
    }
}

export class InvalidFollowersListParamsResponse extends InvalidFormOrParamsResponse<FollowersListParams>
{
    private static errors: InvalidFollowersListParamsErrors = {
        userHandle: () => new InvalidUserHandleParamAPIError(),
        nextTo: () => new InvalidNextToParamAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidFollowersListParamsFields)
    {
        super(InvalidFollowersListParamsResponse.errors, fields);
    }
}

export class InvalidRecommendedListParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidNextToParamAPIError() ]);
    }
}

export class InvalidUsersLikedListParamsResponse extends InvalidFormOrParamsResponse<UsersLikedListParams>
{
    private static errors: InvalidUsersLikedParamsErrors = {
        cheepId: () => new InvalidCheepIdParamAPIError(),
        nextTo: () => new InvalidNextToParamAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidUsersLikedParamsFields)
    {
        super(InvalidUsersLikedListParamsResponse.errors, fields);
    }
}

export class InvalidSearchUsersParamsResponse extends InvalidFormOrParamsResponse<SearchUsersParams>
{
    private static errors: InvalidSearchUsersParamsErrors = {
        nameOrHandle: () => new InvalidNameOrHandleParamAPIError(),
        nextTo: () => new InvalidNextToParamAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidSearchUsersParamsFields)
    {
        super(InvalidSearchUsersParamsResponse.errors, fields);
    }
}

export class InvalidCreateCheepFormResponse extends InvalidFormOrParamsResponse<CreateCheepForm>
{
    private static errors: InvalidCreateCheepFormErrors = {
        responseTarget: () => new InvalidResponseTargetAPIError(),
        quoteTarget: () => new InvalidQuoteTargetAPIError(),
        content: () => new InvalidContentAPIError(),
        gallery: () => new InvalidGalleryAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidCreateCheepFormFields)
    {
        super(InvalidCreateCheepFormResponse.errors, fields);
    }
}

export class InvalidGetCheepParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidCheepIdParamAPIError() ]);
    }
}

export class CheepNotFoundResponse extends ErrorResponse
{
    constructor()
    {
        super(StatusCode.NotFound, [ new CheepDoesNotExistAPIError() ]);
    }
}

export class InvalidLikedCheepsParamsResponse extends InvalidFormOrParamsResponse<LikedCheepsParams>
{
    private static errors: InvalidLikedCheepsParamsErrors = {
        userHandle: () => new InvalidUserHandleParamAPIError(),
        nextTo: () => new InvalidNextToParamAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidLikedCheepsParamsFields)
    {
        super(InvalidLikedCheepsParamsResponse.errors, fields);
    }
}

export class InvalidGetTimelineParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidNextToParamAPIError() ]);
    }
}

export class UserDoesNotExistResponse extends ErrorResponse
{
    /**
     * Status code: Not Found.
     */
    constructor()
    {
        super(StatusCode.NotFound, [ new UserDoesNotExistAPIError() ]);
    }
}

export class InvalidExploreParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidNextToParamAPIError() ]);
    }
}

export class InvalidSearchCheepsParamsResponse extends InvalidFormOrParamsResponse<SearchCheepsParams>
{
    private static errors: InvalidSearchCheepsParamsErrors = {
        words: () => new InvalidWordsParamAPIError(),
        userHandle: () => new InvalidUserHandleParamAPIError(),
        responses: () => new InvalidResponsesParamAPIError(),
        onlyGallery: () => new InvalidOnlyGalleryParamAPIError(),
        responseOf: () => new InvalidResponseOfParamAPIError(),
        quoteTarget: () => new InvalidQuoteTargetAPIError(),
        recheepTarget: () => new InvalidRecheepTargetParamAPIError(),
        nextTo: () => new InvalidNextToParamAPIError()
    };

    /**
     * Status code: Bad Request.
     */
    constructor(fields: InvalidSearchCheepsParamsFields)
    {
        super(InvalidSearchCheepsParamsResponse.errors, fields);
    }
}

export class InvalidDeleteRecheepParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidCheepIdParamAPIError() ]);
    }
}

export class InvalidLikeParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidCheepIdParamAPIError() ]);
    }
}

export class InvalidDeleteCheepParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidCheepIdParamAPIError() ]);
    }
}

export class InsufficientPermissionsResponse extends ErrorResponse
{
    /**
     * Status code: Unauthorized.
     */
    constructor()
    {
        super(StatusCode.Unauthorized, [ new InsufficientPermissionsAPIError() ]);
    }
}

export class InvalidGetProfileParamsResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidUserHandleParamAPIError() ]);
    }
}

export class ProfileDoesNotExistResponse extends ErrorResponse
{
    /**
     * Status code: Not Found.
     */
    constructor()
    {
        super(StatusCode.NotFound, [ new ProfileDoesNotExistAPIError() ]);
    }
}

export class InvalidUpdateProfileFormResponse extends ErrorResponse
{
    /**
     * Status code: Bad Request.
     */
    constructor()
    {
        super(StatusCode.BadRequest, [ new InvalidBirthdateAPIError() ]);
    }
}

export class RecheepAlreadyExistsResponse extends ErrorResponse
{
    /**
     * Status code: Conflict.
     */
    constructor()
    {
        super(StatusCode.Conflict, [ new RecheepAlreadyExistsAPIError() ]);
    }
}

/**
 * This type links the elements of a 'FormType' with a factory function of 'APIError'.
 */
type Errors<FormType> = {
    [Props in keyof FormType]-?: () => APIError;
};

/**
 * This type is used to specify which property of 'FormType' is invalid.
 */
export type Fields<FormType> = {
    [Props in keyof FormType]?: boolean;
};

export type InvalidSignupFormErrors = Errors<CreateUserForm>;
export type InvalidSignupFormFields = Fields<CreateUserForm>;

export type InvalidFollowersListParamsErrors = Errors<FollowersListParams>;
export type InvalidFollowersListParamsFields = Fields<FollowersListParams>;

export type InvalidUsersLikedParamsErrors = Errors<UsersLikedListParams>;
export type InvalidUsersLikedParamsFields = Fields<UsersLikedListParams>;

export type InvalidSearchUsersParamsErrors = Errors<SearchUsersParams>;
export type InvalidSearchUsersParamsFields = Fields<SearchUsersParams>;

export type InvalidCreateCheepFormErrors = Errors<CreateCheepForm>;
export type InvalidCreateCheepFormFields = Fields<CreateCheepForm>;

export type InvalidLikedCheepsParamsErrors = Errors<LikedCheepsParams>;
export type InvalidLikedCheepsParamsFields = Fields<LikedCheepsParams>;

export type InvalidSearchCheepsParamsErrors = Errors<SearchCheepsParams>;
export type InvalidSearchCheepsParamsFields = Fields<SearchCheepsParams>;

export default ErrorResponse;
export * from "./error_response";