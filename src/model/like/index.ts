import { Transaction } from "sequelize";
import { DBError } from "../error";
import Like from "./like";
import LikeModelManager, { DeleteByCheepIdData, LikeRegistrationData } from "./like_model_manager";

class PGLikeModelManager implements LikeModelManager
{
    public async create(data: LikeRegistrationData, t?: Transaction): Promise<void>
    {
        const query = `INSERT INTO ${Like.tableName} (cheep_id, user_id)
            VALUES (:cheepId, :userId)
            ON CONFLICT (cheep_id, user_id) DO NOTHING`;

        try
        {
            await Like.sequelize.query(query, { replacements: data, transaction: t });
        }
        catch(err)
        {
            throw new DBError(err);
        }
    }

    public async delete(data: LikeRegistrationData, t?: Transaction): Promise<void>
    {
        try
        {
            await Like.destroy({
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

    public async deleteByCheepId(data: DeleteByCheepIdData, t?: Transaction): Promise<void> {
        try
        {
            await Like.destroy({
                where: {
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

const likeModelManager = new PGLikeModelManager();

export default likeModelManager;