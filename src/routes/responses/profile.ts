import { RelevantProfileData } from "../../model/profile/profile_model_manager";
import APIResponse from "../api_response";
import StatusCode from "../status_code";

export class ProfileDataResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor(profileData: RelevantProfileData)
    {
        super(
            StatusCode.OK,
            {
                profile: {
                    ...profileData,
                    birthdate: profileData.birthdate.getTime(),
                    joinDate: profileData.joinDate.getTime()
                }
            }
        );
    }
}

export class ProfileUpdatedSuccessfullyResponse extends APIResponse
{
    /**
     * Status code: OK.
     */
    constructor(profileData: RelevantProfileData)
    {
        super(
            StatusCode.OK,
            {
                profile: {
                    ...profileData,
                    birthdate: profileData.birthdate.getTime(),
                    joinDate: profileData.joinDate.getTime()
                }
            }
        );
    }
}