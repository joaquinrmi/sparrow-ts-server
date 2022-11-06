import { NextFunction, Request, Response } from "express";
import ModelError, { ModelErrorType } from "../../model/error";
import followModelManager from "../../model/follow";
import userModelManager from "../../model/user";
import { InternalServerErrorResponse, InvalidCredentialsResponse, InvalidSignupFormResponse, InvalidFollowersListParamsResponse, UnavailableHandleResponse, InvalidRecommendedListParamsResponse, InvalidUsersLikedListParamsResponse, InvalidSearchUsersParamsResponse, UnavailableEmailResponse } from "../error_response";
import CreateUserForm from "../forms/create_user_form";
import FollowersListParams from "../forms/followers_list_params";
import RecommendedListParams from "../forms/recommended_list_params";
import SearchUsersParams from "../forms/search_users_params";
import UsersLikedListParams from "../forms/users_liked_list_params";
import { FollowResponse, SuccessfulLoginResponse, UnfollowResponse, UserCreatedResponse, UserInformationResponse, UsersListResponse } from "../responses/user";
import { checkIdParam, checkNextToParam, checkParams, parseOptionalNumberParam } from "../utils/check_params";

class UserController
{
    private static HANDLE_REGEX = /[a-zA-Z_.\-]+[a-zA-Z0-9_.\-]*/;
    private static EMAIL_REGEX = /^[a-zA-Z0-9_.\-]*@[a-zA-Z0-9_\-]+\.com$/;

    public async getCurrentUserData(req: Request, res: Response): Promise<void>
    {
        try
        {
            var user = await userModelManager.getShortInformation(req.credentials.id);
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        if(user)
        {
            res.submit(new UserInformationResponse(user));
        }
        else
        {
            res.error(new InvalidCredentialsResponse());
        }
    }

    public async signup(req: Request, res: Response): Promise<void>
    {
        try
        {
            var user = await userModelManager.create({
                handle: req.createUserForm.handle,
                email: req.createUserForm.email,
                password: req.createUserForm.password,
                name: req.createUserForm.fullName,
                birthdate: new Date(req.createUserForm.birthdate)
            });
        }
        catch(err)
        {
            switch((err as ModelError).type)
            {
            case ModelErrorType.UnavailableHandle:
                return res.error(new UnavailableHandleResponse());

            case ModelErrorType.UnavailableEmail:
                return res.error(new UnavailableEmailResponse());

            case ModelErrorType.DBError:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new UserCreatedResponse(user));
    }

    public async login(req: Request, res: Response): Promise<void>
    {
        try
        {
            var userData = await userModelManager.getByCredentials(req.loginForm);
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        if(userData)
        {
            res.submit(new SuccessfulLoginResponse(userData));
        }
        else
        {
            res.error(new InvalidCredentialsResponse());
        }
    }

    public async follow(req: Request, res: Response): Promise<void>
    {
        const targetUserHandle = req.params["userHandle"];
        try
        {
            const targetUserId = await userModelManager.getId(targetUserHandle);
            await followModelManager.create({
                userId: req.credentials.id,
                targetUserId: targetUserId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new FollowResponse());
    }

    public async unfollow(req: Request, res: Response): Promise<void>
    {
        const targetUserHandle = req.params["userHandle"];
        try
        {
            const targetUserId = await userModelManager.getId(targetUserHandle);
            await followModelManager.delete({
                userId: req.credentials.id,
                targetUserId: targetUserId
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UnfollowResponse());
    }

    public async getFollowers(req: Request, res: Response): Promise<void>
    {
        try
        {
            var followers = await userModelManager.getFollowers({
                currentUserId: req.credentials.id,
                userHandle: req.followersListParams.userHandle,
                nextTo: req.followersListParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(followers));
    }

    public async getFollowing(req: Request, res: Response): Promise<void>
    {
        try
        {
            var following = await userModelManager.getFollowing({
                currentUserId: req.credentials.id,
                userHandle: req.followersListParams.userHandle,
                nextTo: req.followersListParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(following));
    }

    public async getRecommended(req: Request, res: Response): Promise<void>
    {
        try
        {
            var recommended = await userModelManager.getRecommendedList({
                currentUserId: req.credentials.id,
                nextTo: req.recommendedListParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(recommended));
    }

    public async getUsersLiked(req: Request, res: Response): Promise<void>
    {
        try
        {
            var users = await userModelManager.getUsersLikeACheep({
                currentUserId: req.credentials.id,
                targetCheepId: req.usersLikedListParams.cheepId,
                nextTo: req.usersLikedListParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(users));
    }

    public async getUsersRecheeped(req: Request, res: Response): Promise<void>
    {
        try
        {
            var users = await userModelManager.getUsersRecheepedACheep({
                currentUserId: req.credentials.id,
                targetCheepId: req.usersLikedListParams.cheepId,
                nextTo: req.usersLikedListParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(users));
    }

    public async search(req: Request, res: Response): Promise<void>
    {
        try
        {
            var users = await userModelManager.search({
                currentUserId: req.credentials.id,
                nameOrHandle: req.searchUsersParams.nameOrHandle ? req.searchUsersParams.nameOrHandle.split(" ") : undefined,
                nextTo: req.searchUsersParams.nextTo
            });
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UsersListResponse(users));
    }

    public async checkCreateUserForm(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const [ errorFields, params ] = checkParams<CreateUserForm>(
            req.body,
            {
                handle: (param) => typeof param === "string" && param.length < 25 && UserController.HANDLE_REGEX.test(param),
                email: (param) => typeof param === "string" && UserController.EMAIL_REGEX.test(param),
                password: (param) => typeof param === "string" && param.length > 7,
                fullName: (param) => typeof param === "string" && param.length > 0,
                birthdate: (param) => typeof param === "number"
            },
            {
                handle: (param) => param,
                email: (param) => param,
                password: (param) => param,
                fullName: (param) => param,
                birthdate: (param) => param
            }
        )

        if(errorFields)
        {
            return res.error(new InvalidSignupFormResponse(errorFields));
        }

        req.createUserForm = params;

        next();
    }

    public async checkLoginForm(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        req.loginForm = req.body;

        if(typeof req.loginForm.handleOrEmail !== "string" || typeof req.loginForm.password !== "string")
        {
            return res.error(new InvalidCredentialsResponse());
        }

        next();
    }

    public async checkFollowersListParams(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const [ errorFields, params ] = checkParams<FollowersListParams>(
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

        if(errorFields)
        {
            return res.error(new InvalidFollowersListParamsResponse(errorFields));
        }

        req.followersListParams = params;

        next();
    }

    public async checkRecommendedListParams(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const [ errorFields, params ] = checkParams<RecommendedListParams>(
            req.query,
            {
                nextTo: checkNextToParam
            },
            {
                nextTo: parseOptionalNumberParam
            }
        );

        if(errorFields)
        {
            return res.error(new InvalidRecommendedListParamsResponse());
        }

        req.recommendedListParams = params;

        next();
    }

    public async checkUsersLikedListParams(req: Request, res: Response, next: NextFunction): Promise<void>
    {
        const [ errorFields, params ] = checkParams<UsersLikedListParams>(
            req.query,
            {
                cheepId: checkIdParam,
                nextTo: checkNextToParam
            },
            {
                cheepId: (param) => Number(param),
                nextTo: parseOptionalNumberParam
            }
        );

        if(errorFields)
        {
            return res.error(new InvalidUsersLikedListParamsResponse(errorFields));
        }
        
        req.usersLikedListParams = params;

        next();
    }

    public checkSearchUsersParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ errorFields, params ] = checkParams<SearchUsersParams>(
            req.query,
            {
                nameOrHandle: (param) => param === undefined || (typeof param === "string" && param.length > 0),
                nextTo: checkNextToParam
            },
            {
                nameOrHandle: (param) => param,
                nextTo: parseOptionalNumberParam
            }
        );

        if(errorFields)
        {
            return res.error(new InvalidSearchUsersParamsResponse(errorFields));
        }
        
        req.searchUsersParams = params;

        next();
    }
}

const userController = new UserController();

export default userController;