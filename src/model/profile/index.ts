import { Transaction } from "sequelize";
import createTransaction from "../create_transaction";
import { DBError, ProfileDoesNotExistError } from "../error";
import User from "../user/user";
import Profile from "./profile";
import ProfileData from "./profile_data";
import ProfileModelManager, { CreateProfileData, GetProfileByHandleData, GetProfileByIdData, RelevantProfileData, UpdateProfileData } from "./profile_model_manager";

class PGProfileModelManager implements ProfileModelManager
{
    private profileColumns: string;

    constructor()
    {
        const cheepCountQuery = `SELECT COUNT(cc.id) FROM cheeps AS cc WHERE cc.author_id = u.id`;

        const followingCountQuery = `SELECT COUNT(ff.user_id) FROM follows AS ff WHERE ff.user_id = u.id`;

        const followerCountQuery = `SELECT COUNT(ff.user_id) FROM follows AS ff WHERE ff.target_id = u.id`;

        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM follows AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;

        this.profileColumns = `u.handle, p.name, p.picture, p.banner, p.description, p.join_date AS "joinDate", p.birthdate, p.location, p.website, (${cheepCountQuery}) AS "cheepCount", (${followingCountQuery}) AS "followingCount", (${followerCountQuery}) AS "followerCount", (${followingQuery}) AS "following"`;
    }

    public async getById(data: GetProfileByIdData): Promise<RelevantProfileData>
    {
        const query = `SELECT ${this.profileColumns}
            FROM ${User.tableName} AS u
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE u.id = :targetId`;

        const values = {
            userId: data.currentUserId,
            targetId: data.userId
        };

        try
        {
            var result = (await Profile.sequelize.query(query, { replacements: values }))[0] as Array<RelevantProfileData>;
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(result.length === 0)
        {
            throw new ProfileDoesNotExistError();
        }
        else
        {
            return result[0];
        }
    }

    public async getByHandle(data: GetProfileByHandleData): Promise<RelevantProfileData>
    {
        const query = `SELECT ${this.profileColumns}
            FROM ${User.tableName} AS u
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE u.handle = :userHandle`;

        const values = {
            userId: data.currentUserId,
            userHandle: data.handle
        };

        try
        {
            var result = (await Profile.sequelize.query(query, { replacements: values }))[0] as Array<RelevantProfileData>;
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(result.length === 0)
        {
            throw new ProfileDoesNotExistError();
        }
        else
        {
            return result[0];
        }
    }

    public async create(data: CreateProfileData, t?: Transaction): Promise<ProfileData>
    {
        const tt = await createTransaction(t);

        try
        {
            var profileData = await Profile.create(
                {
                    user_id: data.userId,
                    name: data.name,
                    picture: data.picture,
                    birthdate: data.birthdate,
                    join_date: new Date()
                },
                {
                    transaction: tt
                }
            );

            if(!t) await tt.commit();
        }
        catch(err)
        {
            if(!t) tt.rollback();

            throw new DBError(err);
        }

        return profileData;
    }

    public async update(data: UpdateProfileData, t?: Transaction): Promise<RelevantProfileData>
    {
        const values: {[Prop: string]: any} = {};
        if(data.name) values.name = data.name;
        if(data.picture) values.picture = data.picture;
        if(data.banner) values.banner = data.banner;
        if(data.description) values.description = data.description;
        if(data.birthdate) values.birthdate = data.birthdate;
        if(data.location) values.location = data.location;
        if(data.website) values.website = data.website;

        const tt = await createTransaction(t);

        try
        {
            await Profile.update(
                values,
                {
                    where: { user_id: data.userId }
                }
            );

            if(!t) await tt.commit();
        }
        catch(err)
        {
            if(!t) tt.rollback();
            
            throw new DBError(err);
        }

        return await this.getById({
            currentUserId: data.userId,
            userId: data.userId
        });
    }
}

const profileModelManager = new PGProfileModelManager();

export default profileModelManager;