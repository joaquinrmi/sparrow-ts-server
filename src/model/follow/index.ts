import { Transaction } from "sequelize";
import { DBError } from "../error";
import Follow from "./follow";
import FollowModelManager, { FollowRegistrationData } from "./follow_model_manager";

class PGFollowModelManager implements FollowModelManager
{
    public async create(data: FollowRegistrationData, t?: Transaction): Promise<void>
    {
        const query = `INSERT INTO ${Follow.tableName} (user_id, target_id)
            VALUES (:userId, :targetUserId)
            ON CONFLICT (user_id, target_id) DO NOTHING`;

        try
        {
            await Follow.sequelize.query(query, { replacements: data, transaction: t });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public async delete(data: FollowRegistrationData, t?: Transaction): Promise<void>
    {
        try
        {
            await Follow.destroy({
                where: {
                    user_id: data.userId,
                    target_id: data.targetUserId
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

const followModelManager = new PGFollowModelManager();

export default followModelManager;