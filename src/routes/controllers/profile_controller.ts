import { NextFunction, Request, Response } from "express";
import ModelError, { ModelErrorType } from "../../model/error";
import profileModelManager from "../../model/profile";
import { InternalServerErrorResponse, InvalidGetProfileParamsResponse, InvalidUpdateProfileFormResponse, ProfileDoesNotExistResponse } from "../error_response";
import GetProfileParams from "../forms/get_profile_params";
import UpdateProfileForm from "../forms/update_profile_form";
import { ProfileDataResponse, ProfileUpdatedSuccessfullyResponse } from "../responses/profile";
import { checkOptionalNumberParam, checkParams, parseOptionalNumberParam } from "../utils/check_params";

class ProfileController
{
    public async getProfile(req: Request, res: Response): Promise<void>
    {
        try
        {
            var profileData = await profileModelManager.getByHandle({
                currentUserId: req.credentials.id,
                handle: req.getProfileParams.userHandle
            });
        }
        catch(err)
        {
            switch((err as ModelError).type)
            {
            case ModelErrorType.ProfileDoesNotExist:
                return res.error(new ProfileDoesNotExistResponse());

            case ModelErrorType.DBError:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new ProfileDataResponse(profileData));
    }

    public async updateProfile(req: Request, res: Response): Promise<void>
    {
        try
        {
            var profileData = await profileModelManager.update({
                ...req.updateProfileForm,
                userId: req.credentials.id,
                birthdate: req.updateProfileForm.birthdate !== undefined ? new Date(req.updateProfileForm.birthdate) : undefined
            });
        }
        catch(err)
        {
            switch((err as ModelError).type)
            {
            case ModelErrorType.DBError:
                console.log(err);
                return res.error(new InternalServerErrorResponse());
            }
        }

        res.submit(new ProfileUpdatedSuccessfullyResponse(profileData));
    }

    public checkGetProfileParams(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<GetProfileParams>(
            req.params,
            {
                userHandle: (param) => typeof param === "string" && param.length > 0
            },
            {
                userHandle: (param) => param
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidGetProfileParamsResponse());
        }

        req.getProfileParams = params;

        next();
    }

    public checkUpdateProfileForm(req: Request, res: Response, next: NextFunction): void
    {
        const [ fieldErrors, params ] = checkParams<UpdateProfileForm>(
            req.body,
            {
                name: () => true,
                picture: () => true,
                banner: () => true,
                description: () => true,
                birthdate: checkOptionalNumberParam,
                location: () => true,
                website: () => true,
            },
            {
                name: (param) => param,
                picture: (param) => param,
                banner: (param) => param,
                description: (param) => param,
                birthdate: parseOptionalNumberParam,
                location: (param) => param,
                website: (param) => param,
            }
        );

        if(fieldErrors)
        {
            return res.error(new InvalidUpdateProfileFormResponse());
        }

        req.updateProfileForm = params;

        next();
    }
}

const profileController = new ProfileController();

export default profileController;