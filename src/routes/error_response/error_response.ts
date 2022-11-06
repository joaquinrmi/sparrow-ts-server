import APIResponse from "../api_response";
import APIError from "../api_error/api_error";
import StatusCode from "../status_code";

class ErrorResponse extends APIResponse
{
    constructor(code: StatusCode, errors: Array<APIError>, title = "An Error Has Occurred")
    {
        super(code, { title, errors });
    }
}

export default ErrorResponse;