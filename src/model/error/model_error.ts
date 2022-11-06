/** Represents an error thrown by a model function. */
class ModelError
{
    public type: ModelErrorType;
    public __model_error: boolean;

    /**
     * Verifies if an object is an instance of ModelError.
     * @param error Object to check.
     * @returns True or False.
     */
    public static checkInstance(error: any): boolean
    {
        return error.__model_error;
    }

    constructor(type: ModelErrorType)
    {
        this.type = type;
        this.__model_error = true;
    }
}

export enum ModelErrorType
{
    DBError,
    UnavailableHandle,
    UnavailableEmail,
    RecheepAlreadyExists,
    InsufficientPermissions,
    ProfileDoesNotExist
}

export default ModelError;