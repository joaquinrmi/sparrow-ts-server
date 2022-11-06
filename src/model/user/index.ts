import path from "path";
import { Transaction } from "sequelize";
import { decrypt, encrypt } from "../../utils/encryption";
import { saveProfilePicture } from "../../utils/image_uploading";
import Cheep from "../cheep/cheep";
import createTransaction from "../create_transaction";
import db from "../db";
import { DBError, UnavailableEmailError, UnavailableHandleError } from "../error";
import Follow from "../follow/follow";
import FollowData from "../follow/follow_data";
import Like from "../like/like";
import profileModelManager from "../profile";
import Profile from "../profile/profile";
import ProfileData from "../profile/profile_data";
import Recheep from "../recheep/recheep";
import User from "./user";
import UserData from "./user_data";
import UserModelManager, { CreateUserData, SearchUserFollowersData, SearchUserResult, SearchUsersData, SearchUsersLiked, SearchUsersRecheeped, ShortUserInformation, UserLoginData, UserRecommendedListData } from "./user_model_manager";

class PGUserModelManager implements UserModelManager
{
    private reservedWords: Array<string>;

    constructor()
    {
        this.reservedWords = [ "home", "explore", "notifications", "messages", "bookmarks", "compose", "recommended", "search", "settings", "status", "signup", "login" ];
    }

    public async getId(handle: string): Promise<UserData["id"]>
    {
        try
        {
            var user = await User.findOne({
                where: db.where(db.fn("LOWER", db.col("handle")), handle.toLowerCase())
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(user)
        {
            return user.id;
        }
        else
        {
            return -1;
        }
    }

    public async getByCredentials(data: UserLoginData): Promise<ShortUserInformation>
    {
        const query = `SELECT u.id, u.handle, u.password, p.name, p.picture FROM ${User.tableName} AS u JOIN ${Profile.tableName} AS p ON p.user_id = u.id WHERE LOWER(u.handle) = :handleOrEmail OR u.email = :handleOrEmail;`;

        try
        {
            var user = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        handleOrEmail: data.handleOrEmail.toLowerCase()
                    }
                }
            ))[0] as any[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(user.length > 0 && decrypt(user[0].password) === data.password)
        {
            return {
                id: user[0].id,
                handle: user[0].handle,
                name: user[0].name,
                picture: user[0].picture
            };
        }
        else
        {
            return null;
        }
    }

    public async getShortInformation(userId: number): Promise<ShortUserInformation>
    {
        const query = `SELECT u.id, u.handle, p.name, p.picture FROM ${User.tableName} AS u JOIN ${Profile.tableName} AS p ON p.user_id = u.id WHERE u.id = :userId;`;

        try
        {
            var users = (await User.sequelize.query(query, { replacements: { userId } }))[0] as ShortInformationResult[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(users.length === 0)
        {
            return null;
        }
        else
        {
            return users[0];
        }
    }

    public async getRecommendedList(data: UserRecommendedListData): Promise<SearchUserResult>
    {
        const followingQuery = `SELECT COUNT(f.user_id) > 0 FROM ${Follow.tableName} AS f WHERE f.user_id = :userId AND f.target_id = u.id`;
        const followerQuery = `SELECT COUNT(f.user_id) > 0 FROM ${Follow.tableName} AS f WHERE f.user_id = u.id AND f.target_id = :userId`;

        const whereConditions = new Array<string>();
        whereConditions.push(`u.id != :userId`);
        whereConditions.push(`NOT (${followingQuery})`);
        if(data.nextTo !== undefined)
        {
            whereConditions.push(`u.id < :nextTo`);
        }

        const query = `
            SELECT u.id, u.handle, p.name, p.picture, p.description, FALSE AS following, (${followerQuery}) AS follower
            FROM ${User.tableName} AS u
            INNER JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY u.id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as any[];
        }
        catch(err)
        {
            throw new DBError(err);
        }
        
        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].id
            }
        }
    }

    public async getFollowers(data: SearchUserFollowersData): Promise<SearchUserResult>
    {
        var id = await this.getId(data.userHandle);

        if(id === -1)
        {
            return {
                users: [],
                next: 0
            };
        }

        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;
        const followerQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = u.id AND ff.target_id = :userId`;

        const whereConditions = new Array<string>();
        whereConditions.push(`f.target_id = :targetId`);
        if(data.nextTo !== undefined)
        {
            whereConditions.push(`f.id < :nextTo`);
        }

        const query = `
            SELECT f.id AS fid, u.id, u.handle, p.name, p.picture, p.description, (${followingQuery}) AS following, (${followerQuery}) AS follower
            FROM ${Follow.tableName} AS f
            JOIN ${User.tableName} AS u ON u.id = f.user_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY f.id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        targetId: id,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as FollowerResult[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].fid
            }
        }
    }

    public async getFollowing(data: SearchUserFollowersData): Promise<SearchUserResult>
    {
        var id = await this.getId(data.userHandle);

        if(id === -1)
        {
            return {
                users: [],
                next: 0
            };
        }

        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;
        const followerQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = u.id AND ff.target_id = :userId`;

        const whereConditions = new Array<string>();
        whereConditions.push(`f.user_id = :targetId`);
        if(data.nextTo !== undefined)
        {
            whereConditions.push(`f.id < :nextTo`);
        }

        const query = `
            SELECT f.id AS fid, u.id, u.handle, p.name, p.picture, p.description, (${followingQuery}) AS following, (${followerQuery}) AS follower
            FROM ${Follow.tableName} AS f
            JOIN ${User.tableName} AS u ON u.id = f.target_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY f.id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        targetId: id,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as FollowerResult[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].fid
            }
        }
    }

    public async getUsersLikeACheep(data: SearchUsersLiked): Promise<SearchUserResult>
    {
        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;
        const followerQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = u.id AND ff.target_id = :userId`;

        const whereConditions = new Array<string>();
        whereConditions.push(`l.cheep_id = :cheepId`);

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`u.id < :nextTo`);
        }

        const query = `
            SELECT u.id, u.handle, p.name, p.picture, p.description, (${followingQuery}) AS following, (${followerQuery}) AS follower
            FROM ${Like.tableName} AS l
            JOIN ${User.tableName} AS u ON u.id = l.user_id
            JOIN ${Cheep.tableName} AS c ON c.id = l.cheep_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY l.user_id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        cheepId: data.targetCheepId,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as UserCellResult[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].id
            }
        }
    }

    public async getUsersRecheepedACheep(data: SearchUsersRecheeped): Promise<SearchUserResult>
    {
        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;
        const followerQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = u.id AND ff.target_id = :userId`;

        const whereConditions = new Array<string>();
        whereConditions.push(`r.cheep_id = :cheepId`);

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`u.id < :nextTo`);
        }

        const query = `
            SELECT u.id, u.handle, p.name, p.picture, p.description, (${followingQuery}) AS following, (${followerQuery}) AS follower
            FROM ${Recheep.tableName} AS r
            JOIN ${User.tableName} AS u ON u.id = r.user_id
            JOIN ${Cheep.tableName} AS c ON c.id = r.cheep_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY r.user_id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        cheepId: data.targetCheepId,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as UserCellResult[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].id
            }
        }
    }

    public async search(data: SearchUsersData): Promise<SearchUserResult>
    {
        const followingQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = :userId AND ff.target_id = u.id`;
        const followerQuery = `SELECT COUNT(ff.user_id) > 0 FROM ${Follow.tableName} AS ff WHERE ff.user_id = u.id AND ff.target_id = :userId`;

        const whereConditions = new Array<string>();

        if(data.nameOrHandle !== undefined)
        {
            const words = data.nameOrHandle.map((word) => `%${word.toLowerCase()}%`).join("|");

            whereConditions.push(`
                (LOWER(u.handle) SIMILAR TO '${words}' OR
                LOWER(p.name) SIMILAR TO '${words}')
            `);
        }

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`u.id < :nextTo`);
        }

        const query = `
            SELECT u.id, u.handle, p.name, p.picture, p.description, (${followingQuery}) AS following, (${followerQuery}) AS follower
            FROM ${User.tableName} AS u
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY u.id DESC
            LIMIT 20
        `;

        try
        {
            var elements = (await User.sequelize.query(
                query,
                {
                    replacements: {
                        userId: data.currentUserId,
                        nextTo: data.nextTo
                    }
                }
            ))[0] as any[];
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(elements.length === 0)
        {
            return {
                users: [],
                next: 0
            };
        }
        else
        {
            return {
                users: elements,
                next: elements[elements.length - 1].id
            }
        }
    }

    public async create(data: CreateUserData, t?: Transaction): Promise<ShortUserInformation>
    {
        if(this.reservedWords.indexOf(data.handle.toLowerCase()) !== -1)
        {
            throw new UnavailableHandleError();
        }

        try
        {
            var checkUser = await User.findOne({
                where: db.or(
                    db.where(db.fn("LOWER", db.col("handle")), data.handle.toLowerCase()),
                    db.where(db.col("email"), data.email.toLowerCase())
                )
            });
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(checkUser)
        {
            if(checkUser.handle.toLowerCase() === data.handle.toLowerCase())
            {
                throw new UnavailableHandleError();
            }
            else if(checkUser.email === data.email.toLowerCase())
            {
                throw new UnavailableEmailError();
            }
        }
        
        const tt = await createTransaction(t);

        try
        {
            var newUser = await User.create(
                {
                    handle: data.handle,
                    email: data.email.toLowerCase(),
                    password: encrypt(data.password),
                },
                {
                    transaction: tt
                }
            );

            const picturePath = path.join(__dirname, "..", "..", "..", "..", "img", "profile_default.png");
            const pictureURL = await saveProfilePicture(picturePath);

            await profileModelManager.create(
                {
                    userId: newUser.id,
                    name: data.name,
                    birthdate: data.birthdate,
                    picture: pictureURL
                },
                tt
            );

            if(!t) await tt.commit();
        }
        catch(err)
        {
            if(!t) await tt.rollback();

            throw new DBError(err);
        }

        return await this.getShortInformation(newUser.id);
    }
}

type ShortInformationResult = {
    id: UserData["id"];
    handle: UserData["handle"];
    name: ProfileData["name"];
    picture: ProfileData["picture"];
};

interface UserCellResult
{
    id: UserData["id"];
    handle: UserData["handle"];
    name: ProfileData["name"];
    picture: ProfileData["picture"];
    description: ProfileData["description"];
    following: boolean;
    follower: boolean;
};

interface FollowerResult extends UserCellResult
{
    fid: FollowData["id"];
}

const userModelManager = new PGUserModelManager();

export default userModelManager;