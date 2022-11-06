import APIResponse from "../api_response";
import StatusCode from "../status_code";

export class UploadImageResponse extends APIResponse
{
    constructor(imageUrl: string)
    {
        super(StatusCode.OK, { imageUrl });
    }
}