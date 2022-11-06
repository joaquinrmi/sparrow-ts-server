import { NextFunction, Request, Response } from "express";

const useError = (req: Request, res: Response, next: NextFunction) =>
{
    res.error = (errorResponse) =>
    {
        errorResponse.emit(res);
    };

    next();
};

export default useError;