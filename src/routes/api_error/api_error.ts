class APIError
{
    public code: number;
    public title: string;
    public description: string;

    constructor(code: number, title: string = "No title available", description: string = "No description available")
    {
        this.code = code;
        this.title = title;
        this.description = description;
    }
}

export default APIError;