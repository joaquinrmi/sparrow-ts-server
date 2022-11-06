import { Transaction } from "sequelize";
import { DBError, RecheepAlreadyExistsError } from "../error";
import Recheep from "./recheep";
import RecheepModelManager, { ExistsData, RecheepRegistrationData } from "./recheep_model_manager";

class PGRecheepModelManager implements RecheepModelManager
{
    public async exists(data: ExistsData): Promise<boolean> {
        try
        {
            return (await Recheep.findOne({
                where: {
                    user_id: data.userId,
                    cheep_id: data.cheepId
                }
            })) !== null;
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public async create(data: RecheepRegistrationData, t?: Transaction): Promise<void>
    {
        try
        {
            if(await Recheep.findOne({ where: {
                user_id: data.userId,
                cheep_id: data.cheepId
            }}))
            {
                throw new RecheepAlreadyExistsError();
            }

            await Recheep.create(
                {
                    user_id: data.userId,
                    cheep_id: data.cheepId
                },
                {
                    transaction: t
                }
            );
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public async delete(data: RecheepRegistrationData, t?: Transaction): Promise<void>
    {
        try
        {
            await Recheep.destroy({
                where: {
                    user_id: data.userId,
                    cheep_id: data.cheepId
                },
                transaction: t
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }
}

const recheepModelManager = new PGRecheepModelManager();

export default recheepModelManager;