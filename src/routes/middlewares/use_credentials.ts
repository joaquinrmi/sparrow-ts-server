import { NextFunction, Request, Response } from "express";
import checkToken from "../auth/check_token";
import { InvalidCredentialsResponse } from "../error_response";

function useCredentials(req: Request, res: Response, next: NextFunction): void
{
    const authorization = req.get("authorization");
    if(authorization && authorization.toLowerCase().startsWith("bearer "))
    {
        try
        {
            var token = authorization.substring(7);
            var tokenData = checkToken(token);
        }
        catch(err)
        {
            return res.error(new InvalidCredentialsResponse());
        }
    }
    else
    {
        return res.error(new InvalidCredentialsResponse());
    }

    req.credentials = {
        id: tokenData.userId,
        handle: tokenData.userHandle
    };

    next();
}

export default useCredentials;