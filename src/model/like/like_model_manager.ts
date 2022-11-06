import { Transaction } from "sequelize";
import CheepData from "../cheep/cheep_data";
import UserData from "../user/user_data";

interface LikeModelManager
{
    create(data: LikeRegistrationData, t?: Transaction): Promise<void>;

    delete(data: LikeRegistrationData, t?: Transaction): Promise<void>;

    deleteByCheepId(data: DeleteByCheepIdData, t?: Transaction): Promise<void>;
}

export type LikeRegistrationData = {
    cheepId: CheepData["id"];
    userId: UserData["id"];
};

export type DeleteByCheepIdData = {
    cheepId: CheepData["id"];
};

export default LikeModelManager;