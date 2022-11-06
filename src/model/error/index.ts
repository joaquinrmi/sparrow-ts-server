import ModelError, { ModelErrorType } from "./model_error";

export class DBError extends ModelError
{
    public errorObject: any;

    constructor(error: any)
    {
        super(ModelErrorType.DBError);

        this.errorObject = error;
    }
}

export class UnavailableHandleError extends ModelError
{
    constructor()
    {
        super(ModelErrorType.UnavailableHandle);
    }
}

export class UnavailableEmailError extends ModelError
{
    constructor()
    {
        super(ModelErrorType.UnavailableEmail);
    }
}

export class RecheepAlreadyExistsError extends ModelError
{
    constructor()
    {
        super(ModelErrorType.RecheepAlreadyExists);
    }
}

export class InsufficientPermissionsError extends ModelError
{
    constructor()
    {
        super(ModelErrorType.InsufficientPermissions);
    }
}

export class ProfileDoesNotExistError extends ModelError
{
    constructor()
    {
        super(ModelErrorType.ProfileDoesNotExist);
    }
}

export default ModelError;
export * from "./model_error";