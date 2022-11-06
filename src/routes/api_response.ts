import { Response } from "express";
import StatusCode from "./status_code";

class APIResponse
{
    code: StatusCode;
    content: any;

    constructor(code: StatusCode, content?: any)
    {
        this.code = code;
        this.content = content;
    }

    emit(res: Response): void
    {
        if(this.content && Object.keys(this.content).length === 0)
        {
            res.status(this.code).send();
        }
        else
        {
            res.status(this.code).json(this.content);
        }
    }
}

export default APIResponse;