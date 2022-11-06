import { NextFunction, Request, Response } from "express"

const useSubmit = (req: Request, res: Response, next: NextFunction) =>
{
    res.submit = (apiResponse) =>
    {
        apiResponse.emit(res);
    };

    next();
};

export default useSubmit;