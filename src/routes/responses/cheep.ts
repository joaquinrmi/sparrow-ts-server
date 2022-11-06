import { CheepRelevantData, SearchCheepsResult } from "../../model/cheep/cheep_model_manager";
import APIResponse from "../api_response";
import StatusCode from "../status_code";

export class CheepCreatedSuccessfullyResponse extends APIResponse
{
    /**
     * Status code: Created.
     * @param cheep The new cheep data.
     */
    constructor(cheep: CheepRelevantData)
    {
        super(StatusCode.Created, { cheep });
    }
}

export class GetCheepResponse extends APIResponse
{
    /**
     * Status code: OK.
     * @param cheep The cheep data.
     */
    constructor(cheep: CheepRelevantData)
    {
        super(StatusCode.OK, { cheep });
    }
}

export class CheepListResponse extends APIResponse
{
    /**
     * Statis code: OK.
     * @param searchCheepsResult The list of cheeps.
     */
    constructor(searchCheepsResult: SearchCheepsResult)
    {
        super(StatusCode.OK, searchCheepsResult);
    }
}

export class LikeCreatedSuccessfullyResponse extends APIResponse
{
    /**
     * Status code: Created.
     */
    constructor()
    {
        super(StatusCode.Created);
    }
}

export class UndoLikeSuccessfullyResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor()
    {
        super(StatusCode.OK);
    }
}

export class CheepDeletedSuccessfullyResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor()
    {
        super(StatusCode.OK);
    }
}

export class DeleteRecheepResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor()
    {
        super(StatusCode.OK);
    }
}