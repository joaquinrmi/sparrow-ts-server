import { Transaction } from "sequelize";
import UserData from "../user/user_data";

interface FollowModelManager
{
    create(data: FollowRegistrationData, t?: Transaction): Promise<void>;

    delete(data: FollowRegistrationData, t?: Transaction): Promise<void>;
}

export type FollowRegistrationData = {
    userId: UserData["id"];
    targetUserId: UserData["id"];
};

export default FollowModelManager;