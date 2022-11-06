import { Transaction } from "sequelize";
import CheepData from "../cheep/cheep_data";
import UserData from "../user/user_data";

interface RecheepModelManager
{
    exists(data: ExistsData): Promise<boolean>;

    create(data: RecheepRegistrationData, t?: Transaction): Promise<void>;

    delete(data: RecheepRegistrationData, t?: Transaction): Promise<void>;
}

export type RecheepRegistrationData = {
    userId: UserData["id"];
    cheepId: CheepData["id"];
};

export type ExistsData = {
    userId: UserData["id"];
    cheepId: CheepData["id"];
};

export default RecheepModelManager;