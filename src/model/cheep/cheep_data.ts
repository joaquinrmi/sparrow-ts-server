interface CheepData
{
    id: number;
    author_id: number;
    date_created: Date;
    response_target: number;
    quote_target: number;
    content: string;
    gallery: Array<string>;
}

export default CheepData;