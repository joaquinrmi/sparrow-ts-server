import APIError from "./api_error";

export enum APIErrorType
{
    InternalServerError = 1000,
    InvalidForm = 1200,
    InvalidHandle = 1301,
    InvalidEmail = 1302,
    InvalidPassword = 1303,
    InvalidFullName = 1304,
    InvalidBirthdate = 1305,
    InvalidContent = 1306,
    InvalidResponseTarget = 1307,
    InvalidQuoteTarget = 1308,
    InvalidGallery = 1309,
    UnavailableHandle = 1400,
    UnavailableEmail = 1401,
    InvalidCredentials = 1500,
    InvalidParams = 1600,
    InvalidUserIdParam = 1601,
    InvalidNextToParam = 1602,
    InvalidCheepIdParam = 1603,
    InvalidNameOrHandleParam = 1604,
    InvalidUserHandleParam = 1605,
    InvalidWordsParam = 1606,
    InvalidResponsesParam = 1607,
    InvalidOnlyGalleryParam = 1608,
    InvalidResponseOfParam = 1609,
    InvalidQuoteTargetParam = 1610,
    InvalidRecheepTargetParam = 1611,
    InvalidBirthdateParam = 1612,
    UserDoesNotExist = 1700,
    ProfileDoesNotExist = 1701,
    InsufficientPermissions = 1800,
    RecheepAlreadyExists = 1900,
    CheepDoesNotExist = 2000
}

export class InternalServerAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InternalServerError, "Internal Server Error");
    }
}

export class InvalidFormAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidForm, "Invalid Form", "The form body is empty.");
    }
}

export class InvalidHandleAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidHandle, "Invalid Handle", "The handle can have up to 24 characters, only contains letters, numbers and the characters '_', '-' and '.' and must starts with a letter.");
    }
}

export class InvalidEmailAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidEmail, "Invalid Email", "This field must be a valid email.");
    }
}

export class InvalidPasswordAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidPassword, "Invalid Password", "The password must have almost eight characters.");
    }
}

export class InvalidFullNameAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidBirthdate, "Invalid Full Name", "The full name is required.");
    }
}

export class InvalidBirthdateAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidBirthdate, "Invalid Birthdate");
    }
}

export class UnavailableHandleAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.UnavailableHandle, "Unavailable Handle", "The handle is not available.");
    }
}

export class UnavailableEmailAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.UnavailableEmail, "Unavailable Email", "The email is not available.");
    }
}

export class InvalidCredentialsAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidCredentials, "Invalid Credentials");
    }
}

export class InvalidParamsAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidParams, "Invalid Params");
    }
}

export class InvalidUserIdParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidUserIdParam, "Invalid Parameter: userId", "The userId param must be a number.");
    }
}

export class InvalidNextToParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidNextToParam, "Invalid Parameter: nextTo", "The nextTo param must be a number.");
    }
}

export class InvalidCheepIdParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidCheepIdParam, "Invalid Parameter: cheepId", "The cheepId param must by a number.");
    }
}

export class InvalidNameOrHandleParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidNameOrHandleParam, "Invalid Parameter: nameOrHandle", "The nameOrHandle param must by a non-empty string.");
    }
}

export class InvalidUserHandleParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidUserHandleParam, "Invalid Parameter: userHandle", "The userHandle must be a string.");
    }
}

export class InvalidWordsParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidWordsParam, "Invalid Parameter: words", "The words param must be 'true' of 'false'.");
    }
}

export class InvalidResponsesParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidResponsesParam, "Invalid Parameter: responses", "The responses param must be 'true' of 'false'.")
    }
}

export class InvalidOnlyGalleryParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidOnlyGalleryParam, "Invalid Parameter: onlyGallery", "The onlyGallery param must be 'true' of 'false'.")
    }
}

export class InvalidResponseOfParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidResponseOfParam, "Invalid Parameter: responseOf", "The responseOf param must be a number.")
    }
}

export class InvalidQuoteTargetParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidQuoteTargetParam, "Invalid Parameter: quoteTarget", "The quoteTarget param must be a number.")
    }
}

export class InvalidRecheepTargetParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidRecheepTargetParam, "Invalid Parameter: recheepTarget", "The recheepTarget param must be a number.")
    }
}

export class InvalidBirthdateParamAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidBirthdateParam, "Invalid Parameter: birthdate", "The birthdate must be a number.");
    }
}

export class InvalidContentAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidContent, "Invalid Form Param: content", "The content must by a string.");
    }
}

export class InvalidResponseTargetAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidResponseTarget, "Invalid Form Param: responseTarget", "The responseTarget must be a number.");
    }
}

export class InvalidQuoteTargetAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidQuoteTarget, "Invalid Form Param: quoteTarget", "The quoteTarget must be a number.");
    }
}

export class InvalidGalleryAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InvalidGallery, "Invalid Form Param: gallery", "The gallery must be an array of strings.");
    }
}

export class UserDoesNotExistAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.UserDoesNotExist, "User Does Not Exist");
    }
}

export class ProfileDoesNotExistAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.ProfileDoesNotExist, "Profile Does Not Exist");
    }
}

export class InsufficientPermissionsAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.InsufficientPermissions, "Insufficient Permissions", "You are not allowed to do this");
    }
}

export class RecheepAlreadyExistsAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.RecheepAlreadyExists, "Already Recheeped", "You have already recheeped this cheep.");
    }
}

export class CheepDoesNotExistAPIError extends APIError
{
    constructor()
    {
        super(APIErrorType.CheepDoesNotExist, "Cheep Does Not Exist", "The requested cheep does not exist");
    }
}

export default APIError;
export * from "./api_error";