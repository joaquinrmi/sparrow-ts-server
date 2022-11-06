import { NextFunction, Request, Response } from "express";
import cheepModelManager from "../../model/cheep";
import ModelError, { ModelErrorType } from "../../model/error";
import likeModelManager from "../../model/like";
import userModelManager from "../../model/user";
import { CheepNotFoundResponse, InsufficientPermissionsResponse, InternalServerErrorResponse, InvalidCreateCheepFormResponse, InvalidDeleteCheepParamsResponse, InvalidDeleteRecheepParamsResponse, InvalidExploreParamsResponse, InvalidGetTimelineParamsResponse, InvalidLikedCheepsParamsResponse, InvalidLikeParamsResponse, InvalidSearchCheepsParamsResponse, RecheepAlreadyExistsResponse, UserDoesNotExistResponse } from "../error_response";
import CreateCheepForm from "../forms/create_cheep_form";
import DeleteCheepParams from "../forms/delete_cheep_params";
import DeleteRecheepParams from "../forms/delete_recheep_params";
import ExploreParams from "../forms/explore_params";
import GetCheepParams from "../forms/get_cheep_params";
import GetTimelineParams from "../forms/get_timeline_params";
import LikedCheepsParams from "../forms/liked_cheeps_params";
import LikeParams from "../forms/like_params";
import SearchCheepsParams from "../forms/search_cheeps_params";
import { CheepCreatedSuccessfullyResponse, CheepDeletedSuccessfullyResponse, CheepListResponse, DeleteRecheepResponse, GetCheepResponse, LikeCreatedSuccessfullyResponse, UndoLikeSuccessfullyResponse } from "../responses/cheep";
import { checkIdParam, checkNextToParam, checkParams, checkOptionalNumberParam, checkOptionalBooleanParam, parseOptionalNumberParam, parseOptionalBooleanParam } from "../utils/check_params";

class CheepController
{
    public async create(req: Request, res: Response): Promise<void>
    {
        try
        {
            var cheep = await cheepModelManager.create({
                authorId: req.credentials.id,
                dateCreated: new Date(),
                ...req.createCheepForm
            });
        }
        catch(err)
        {
            switch((err as ModelError).type)
            {
            case ModelErrorType.RecheepAlreadyExists:
                return res.error(new RecheepAlreadyExistsResponse());

            case ModelErrorType.DBError:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new CheepCreatedSuccessfullyResponse(cheep));
    }

    public async delete(req: Request, res: Response): Promise<void>
    {
        try
        {
            await cheepModelManager.delete({
                currentUserId: req.credentials.id,
                cheepId: req.deleteCheepParams.cheepId
            });
        }
        catch(err)
        {
            switch((err as ModelError).type)
            {
            case ModelErrorType.InsufficientPermissions:
                return res.error(new InsufficientPermissionsResponse());

            case ModelErrorType.DBError:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new CheepDeletedSuccessfullyResponse());
    }

    public async search(req: Request, res: Response): Promise<void>
    {
        try
        {
            var cheeps = await cheepModelManager.search({
                currentUserId: req.credentials.id,
                words: req.searchCheepsParams.words?.split(" "),
                responses: req.searchCheepsParams.responses,
                onlyGallery: req.searchCheepsParams.onlyGallery,
                responseOf: req.searchCheepsParams.responseOf,
                userHandle: req.searchCheepsParams.userHandle,
                quoteTarget: req.searchCheepsParams.quoteTarget,
                recheepTarget: req.searchCheepsParams.recheepTarget,
                nextTo: req.searchCheepsParams.nextTo,
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new CheepListResponse(cheeps));
    }

    public async getById(req: Request, res: Response): Promise<void>
    {
        try
        {
            var cheep = await cheepModelManager.getById({
                currentUserId: req.credentials.id,
                cheepId: req.getCheepParams.cheepId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        if(cheep === null)
        {
            res.error(new CheepNotFoundResponse());
        }
        else
        {
            res.submit(new GetCheepResponse(cheep));
        }
    }

    public async getLikedCheeps(req: Request, res: Response): Promise<void>
    {
        try
        {
            var userId = await userModelManager.getId(req.likedCheepsParams.userHandle);
            if(userId === -1)
            {
                return res.error(new UserDoesNotExistResponse());
            }

            var cheeps = await cheepModelManager.getLikedCheeps({
                currentUserId: req.credentials.id,
                targetUserId: userId,
                nextTo: req.likedCheepsParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new CheepListResponse(cheeps));
    }

    public async getTimeline(req: Request, res: Response): Promise<void>
    {
        try
        {
            var cheeps = await cheepModelManager.getTimeline({
                currentUserId: req.credentials.id,
                nextTo: req.getTimelineParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new CheepListResponse(cheeps));
    }

    public async explore(req: Request, res: Response): Promise<void>
    {
        try
        {
            var cheeps = await cheepModelManager.getAll({
                currentUserId: req.credentials.id,
                nextTo: req.exploreParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new CheepListResponse(cheeps));
    }

    public async like(req: Request, res: Response): Promise<void>
    {
        try
        {
            await likeModelManager.create({
                userId: req.credentials.id,
                cheepId: req.likeParams.cheepId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new LikeCreatedSuccessfullyResponse());
    }

    public async undoLike(req: Request, res: Response): Promise<void>
    {
        try
        {
            await likeModelManager.delete({
                userId: req.credentials.id,
                cheepId: req.undoLikeParams.cheepId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UndoLikeSuccessfullyResponse());
    }

    public async deleteRecheep(req: Request, res: Response): Promise<void>
    {
        try
        {
            await cheepModelManager.deleteRecheep({
                currentUserId: req.credentials.id,
                targetCheepId: req.deleteRecheepParams.cheepId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new DeleteRecheepResponse());
    }

    public checkCreateCheepForm(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<CreateCheepForm>(
            req.body,
            {
                content: (param) => param === undefined || typeof param === "string",
                responseTarget: (param) => param === undefined || typeof param === "number",
                quoteTarget: (param) => param === undefined || typeof param === "number",
                gallery: (param) => param === undefined || Array.isArray(param)
            },
            {
                content: (param) => param && param.length > 0 ? param : undefined,
                responseTarget: (param) => param,
                quoteTarget: (param) => param,
                gallery: (param) => param && param.length > 0 ? param : undefined
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidCreateCheepFormResponse(fieldErrors));
        }

        req.createCheepForm = params;

        next();
    }

    public checkGetCheepParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<GetCheepParams>(
            req.params,
            {
                cheepId: checkIdParam
            },
            {
                cheepId: (param) => Number(param)
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidDeleteCheepParamsResponse());
        }

        req.getCheepParams = params;

        next();
    }

    public checkLikedCheepsParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<LikedCheepsParams>(
            req.query,
            {
                userHandle: (param) => typeof param === "string",
                nextTo: checkNextToParam
            },
            {
                userHandle: (param) => param,
                nextTo: parseOptionalNumberParam
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidLikedCheepsParamsResponse(fieldErrors));
        }

        req.likedCheepsParams = params;

        next();
    }

    public checkGetTimelineParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<GetTimelineParams>(
            req.params,
            {
                nextTo: checkNextToParam
            },
            {
                nextTo: parseOptionalNumberParam
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidGetTimelineParamsResponse());
        }

        req.getTimelineParams = params;

        next();
    }

    public checkSearchCheepsParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<SearchCheepsParams>(
            req.query,
            {
                words: () => true,
                userHandle: () => true,
                responses: checkOptionalBooleanParam,
                onlyGallery: checkOptionalBooleanParam,
                responseOf: checkOptionalNumberParam,
                quoteTarget: checkOptionalNumberParam,
                recheepTarget: checkOptionalNumberParam,
                nextTo: checkNextToParam
            },
            {
                words: (param) => param,
                userHandle: (param) => param,
                responses: parseOptionalBooleanParam,
                onlyGallery: parseOptionalBooleanParam,
                responseOf: parseOptionalNumberParam,
                quoteTarget: parseOptionalNumberParam,
                recheepTarget: parseOptionalNumberParam,
                nextTo: parseOptionalNumberParam,
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidSearchCheepsParamsResponse(fieldErrors));
        }

        req.searchCheepsParams = params;

        next();
    }

    public checkLikeParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<LikeParams>(
            req.params,
            {
                cheepId: checkIdParam
            },
            {
                cheepId: (param) => Number(param)
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidLikeParamsResponse());
        }

        req.likeParams = params;

        next();
    }

    public checkUndoLikeParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<LikeParams>(
            req.params,
            {
                cheepId: checkIdParam
            },
            {
                cheepId: (param) => Number(param)
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidLikeParamsResponse());
        }

        req.undoLikeParams = params;

        next();
    }

    public checkExploreParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<ExploreParams>(
            req.params,
            {
                nextTo: checkNextToParam
            },
            {
                nextTo: parseOptionalNumberParam
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidExploreParamsResponse());
        }

        req.exploreParams = params;

        next();
    }

    public checkDeleteCheepParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<DeleteCheepParams>(
            req.params,
            {
                cheepId: checkIdParam
            },
            {
                cheepId: (param) => Number(param)
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidDeleteCheepParamsResponse());
        }

        req.deleteCheepParams = params;

        next();
    }

    public checkDeleteRecheepParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<DeleteRecheepParams>(
            req.params,
            {
                cheepId: checkIdParam
            },
            {
                cheepId: (param) => Number(param)
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidDeleteRecheepParamsResponse());
        }

        req.deleteRecheepParams = params;

        next();
    }
}

const cheepController = new CheepController();

export default cheepController;