import { Transaction } from "sequelize";
import createTransaction from "../create_transaction";
import ModelError, { DBError, InsufficientPermissionsError, RecheepAlreadyExistsError } from "../error";
import Follow from "../follow/follow";
import likeModelManager from "../like";
import Like from "../like/like";
import Profile from "../profile/profile";
import quoteModelManager from "../quote";
import recheepModelManager from "../recheep";
import Recheep from "../recheep/recheep";
import User from "../user/user";
import UserData from "../user/user_data";
import Cheep from "./cheep";
import CheepData from "./cheep_data";
import CheepModelManager, { CheepRelevantData, CreateCheepData, DeleteCheepData, DeleteRecheepData, GetAllCheepsData, GetCheepByIdData, GetLikedCheepsData, GetTimelineData, SearchCheepsData, SearchCheepsResult } from "./cheep_model_manager";

class PGCheepModelManager implements CheepModelManager
{
    private commentsQuery = `SELECT COUNT(cc.id) FROM cheeps AS cc WHERE cc.response_target = c.id`;
    private likesQuery = `SELECT COUNT(ll.cheep_id) FROM likes AS ll WHERE ll.cheep_id = c.id`;
    private recheepsQuery = `SELECT COUNT(rr.cheep_id) FROM recheeps AS rr WHERE rr.cheep_id = c.id`;
    private quotesQuery = `SELECT COUNT(qq.cheep_id) FROM quotes AS qq WHERE qq.cheep_id = c.id`;
    private userLikesItQuery = (userId: UserData["id"]) => `SELECT COUNT(ll.cheep_id) > 0 FROM likes AS ll WHERE ll.cheep_id = c.id AND ll.user_id = ${userId}`;
    private userRecheepedItQuery = (userId: UserData["id"]) => `SELECT COUNT(rr.cheep_id) > 0 FROM recheeps AS rr WHERE rr.cheep_id = c.id AND rr.user_id = ${userId}`;

    private cheepDataColumns: Array<string>;

    private deletedCheepData: CheepRelevantData;

    constructor()
    {
        const cheepColumns = [ "c.id", "c.author_id", "c.date_created", "c.content", "c.gallery", "c.quote_target", "c.response_target" ];
        const userColumns = [ "u.handle" ];
        const profileColumns = [ "p.name", "p.picture" ];

        this.cheepDataColumns = [
            ...cheepColumns,
            ...userColumns,
            ...profileColumns
        ];

        this.deletedCheepData = { id: -1 };
    }

    public async search(data: SearchCheepsData): Promise<SearchCheepsResult>
    {
        const whereConditions = new Array<string>();
        const values: {[Prop: string]: any} = {};

        if(data.words?.length > 0)
        {
            const words = data.words.map((word) => `%${word.toLowerCase()}%`).join("|");
            whereConditions.push(`LOWER(c.content) SIMILAR TO '${words}'`);
        }

        if(!data.responses)
        {
            whereConditions.push(`c.response_target IS NULL`);
        }

        if(data.onlyGallery)
        {
            whereConditions.push(`c.gallery IS NOT NULL`);
        }

        if(data.responseOf !== undefined)
        {
            whereConditions.push(`c.response_target = :responseTarget`);
            values.responseTarget = data.responseOf;
        }

        if(data.userHandle !== undefined)
        {
            whereConditions.push(`u.handle = :userHandle`);
            values.userHandle = data.userHandle;
        }

        if(data.quoteTarget !== undefined)
        {
            whereConditions.push(`(c.quote_target = :quoteTarget AND (c.content IS NOT NULL OR c.gallery IS NOT NULL))`);
            values.quoteTarget = data.quoteTarget;
        }

        let recheepJoin = "";
        if(data.recheepTarget !== undefined)
        {
            whereConditions.push(`r.cheep_id = :recheepTarget`);
            values.recheepTarget = data.recheepTarget;

            recheepJoin = `INNER JOIN ${Recheep.tableName} AS r ON r.user_id = u.id`;
        }

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`c.id < :nextTo`);
            values.nextTo = data.nextTo;
        }

        const query = `SELECT ${this.getCheepSelectProps(data.currentUserId)} 
            FROM ${Cheep.tableName} AS c
            JOIN ${User.tableName} AS u ON u.id = c.author_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            ${recheepJoin}
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY c.id DESC LIMIT 20`;

        return await this.queryCheepList(query, values, data.currentUserId);
    }

    public async getById(data: GetCheepByIdData): Promise<CheepRelevantData>
    {
        const query = `SELECT ${this.getCheepSelectProps(data.currentUserId)}
            FROM ${Cheep.tableName} AS c
            JOIN ${User.tableName} AS u ON u.id = c.author_id
            JOIN ${Profile.tableName} AS p ON p.user_id = c.author_id
            WHERE c.id = ${data.cheepId};`;

        try
        {
            var cheeps = (await Cheep.sequelize.query(query))[0] as Array<SearchCheepResult>;
            if(cheeps.length === 0)
            {
                return null;
            }

            var cheepData = await this.constructRelevantData(data.currentUserId, cheeps[0], data.quoteDepth, data.responseDepth);
        }
        catch(err)
        {
            if(ModelError.checkInstance(err))
            {
                throw err;
            }
            
            throw new DBError(err);
        }

        return cheepData;
    }

    public async getTimeline(data: GetTimelineData): Promise<SearchCheepsResult>
    {
        const whereConditions = new Array<string>();
        whereConditions.push(`f.user_id = ${data.currentUserId}`);

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`c.id < ${data.nextTo}`);
        }

        const query = `SELECT ${this.getCheepSelectProps(data.currentUserId)}
            FROM ${Follow.tableName} AS f
            JOIN ${User.tableName} AS u ON u.id = f.target_id
            JOIN ${Cheep.tableName} AS c ON c.author_id = u.id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY c.id DESC
            LIMIT 20`;

        return await this.queryCheepList(query, {}, data.currentUserId);
    }

    public async getAll(data: GetAllCheepsData): Promise<SearchCheepsResult>
    {
        const whereConditions = new Array<string>();
        const values: {[Prop: string]: any} = {};

        whereConditions.push(`c.author_id != :userId`);
        values.userId = data.currentUserId;

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`c.id < :nextTo`);
            values.nextTo = data.nextTo;
        }

        const query = `SELECT ${this.getCheepSelectProps(data.currentUserId)}
            FROM ${Cheep.tableName} AS c
            JOIN ${User.tableName} AS u ON u.id = c.author_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY c.id DESC LIMIT 20`;

        return await this.queryCheepList(query, values, data.currentUserId);
    }

    public async getLikedCheeps(data: GetLikedCheepsData): Promise<SearchCheepsResult>
    {
        const whereConditions = new Array<string>();
        const values: {[Prop: string]: any} = {};

        whereConditions.push(`l.user_id = :userId`);
        values.userId = data.targetUserId;

        if(data.nextTo !== undefined)
        {
            whereConditions.push(`l.id < :nextTo`);
            values.nextTo = data.nextTo;
        }

        const query = `SELECT ${this.getCheepSelectProps(data.currentUserId)} 
            FROM ${Like.tableName} AS l
            JOIN ${Cheep.tableName} AS c ON c.id = l.cheep_id
            JOIN ${User.tableName} AS u ON u.id = c.author_id
            JOIN ${Profile.tableName} AS p ON p.user_id = u.id
            WHERE ${whereConditions.join(" AND ")}
            ORDER BY l.cheep_id DESC LIMIT 20`;

        return await this.queryCheepList(query, values, data.currentUserId);
    }

    public async delete(data: DeleteCheepData, t?: Transaction): Promise<void>
    {
        const tt = await createTransaction(t);

        try
        {
            var cheep = await Cheep.findByPk(data.cheepId);
            if(!cheep) return;
            if(cheep.author_id !== data.currentUserId)
            {
                throw new InsufficientPermissionsError();
            }

            if(typeof cheep.quote_target === "number")
            {
                if(!cheep.content && !cheep.gallery)
                {
                    await recheepModelManager.delete(
                        {
                            userId: cheep.author_id,
                            cheepId: cheep.quote_target,
                        },
                        tt
                    );
                }
                else
                {
                    await quoteModelManager.delete(
                        {
                            cheepId: cheep.id,
                            targetCheepId: cheep.quote_target
                        },
                        tt
                    );
                }
            }

            await likeModelManager.deleteByCheepId(
                { cheepId: cheep.id }, tt
            );
            
            await Cheep.destroy({
                where: { id: data.cheepId },
                transaction: tt
            });

            if(!t) await tt.commit();
        }
        catch(err)
        {
            if(!t) tt.rollback();

            if(ModelError.checkInstance(err))
            {
                throw err;
            }
            else
            {
                throw new DBError(err);
            }
        }
    }

    public async deleteRecheep(data: DeleteRecheepData, t?: Transaction): Promise<void>
    {
        const tt = await createTransaction(t);

        try
        {
            await Recheep.destroy({
                where: {
                    user_id: data.currentUserId,
                    cheep_id: data.targetCheepId
                },
                transaction: tt
            });

            await Cheep.destroy({
                where: {
                    author_id: data.currentUserId,
                    quote_target: data.targetCheepId
                },
                transaction: tt
            });

            if(!t) await tt.commit();
        }
        catch(err)
        {
            if(!t) tt.rollback();

            throw new DBError(err);
        }
    }

    public async create(data: CreateCheepData, t?: Transaction): Promise<CheepRelevantData>
    {
        const newData: {[Prop in keyof CheepData]?: CheepData[Prop]} = {
            author_id: data.authorId,
            date_created: data.dateCreated
        };

        if(data.content !== undefined)
        {
            newData.content = data.content;
        }

        if(data.gallery !== undefined)
        {
            newData.gallery = data.gallery;
        }

        if(data.responseTarget !== undefined)
        {
            newData.response_target = data.responseTarget;
        }

        if(data.quoteTarget !== undefined)
        {
            newData.quote_target = data.quoteTarget;
        }

        const tt = await createTransaction(t);

        try
        {
            if(data.quoteTarget !== undefined && !(data.content && data.gallery))
            {
                const recheepExists = await recheepModelManager.exists({
                    userId: data.authorId,
                    cheepId: data.quoteTarget
                });

                if(recheepExists)
                {
                    throw new RecheepAlreadyExistsError();
                }
            }

            var cheep = await Cheep.create(newData);
            
            if(data.quoteTarget !== undefined)
            {
                if(data.content === undefined)
                {
                    await recheepModelManager.create(
                        {
                            userId: data.authorId,
                            cheepId: data.quoteTarget
                        },
                        tt
                    );
                }
                else
                {
                    /*await quoteModelManager.create(
                        {
                            cheepId: cheep.id,
                            targetCheepId: data.quoteTarget
                        },
                        tt
                    );*/
                }
            }

            if(!t) tt.commit();
        }
        catch(err)
        {
            if(!t) tt.rollback();

            if(ModelError.checkInstance(err))
            {
                throw err;
            }
            else
            {
                throw new DBError(err);
            }
        }

        var cheepData = await this.getById({
            currentUserId: data.authorId,
            cheepId: cheep.id
        });

        return cheepData;
    }

    private getCheepSelectProps(currentUserId: UserData["id"]): string
    {
        return `${this.cheepDataColumns.join(",")}, (${this.commentsQuery}) AS comments, (${this.likesQuery}) AS likes, (${this.recheepsQuery}) AS recheeps, (${this.quotesQuery}) AS quotes, (${this.userLikesItQuery(currentUserId)}) AS user_likes_it, (${this.userRecheepedItQuery(currentUserId)}) AS user_recheeped_it`;
    }

    /**
     * Request a list of cheeps.
     * @param query The query string.
     * @param values The values to replace.
     * @param currentUserId The id of the user that makes the request.
     * @throws {DBError} When an unexpected error occurs.
     */
    private async queryCheepList(query: string, values: any, currentUserId: UserData["id"]): Promise<SearchCheepsResult>
    {
        try
        {
            var cheeps = (await Cheep.sequelize.query(
                query,
                {
                    replacements: values
                }
            ))[0] as Array<SearchCheepResult>

            var cheepList = new Array<CheepRelevantData>();
            for(let i = 0; i < cheeps.length; ++i)
            {
                cheepList.push(await this.constructRelevantData(
                    currentUserId, cheeps[i], 1, 1
                ));
            }
        }
        catch(err)
        {
            throw new DBError(err);
        }

        if(cheepList.length === 0)
        {
            return {
                cheeps: [],
                next: 0
            };
        }
        else
        {
            const last = cheeps[cheeps.length - 1];

            return {
                cheeps: cheepList,
                next: last.lid !== undefined ? last.lid : last.id
            };
        }
    }

    private async constructRelevantData(currentUserId: UserData["id"], cheep: SearchCheepResult, quoteDepth?: number, responseDepth?: number): Promise<CheepRelevantData>
    {
        let quoteTarget: CheepRelevantData | undefined;
        let responseOf: CheepRelevantData | undefined;

        if(quoteDepth === undefined)
        {
            quoteDepth = Number.MAX_SAFE_INTEGER;
        }

        if(responseDepth === undefined)
        {
            responseDepth = Number.MAX_SAFE_INTEGER;
        }

        if(cheep.quote_target !== null && quoteDepth > 0)
        {
            quoteTarget = await this.getById(
                {
                    currentUserId: currentUserId,
                    cheepId: cheep.quote_target,
                    quoteDepth: quoteDepth ? quoteDepth - 1 : 0
                }
            ) || this.deletedCheepData;
        }

        if(cheep.response_target !== null && responseDepth > 0)
        {
            responseOf = await this.getById(
                {
                    currentUserId: currentUserId,
                    cheepId: cheep.response_target,
                    responseDepth: responseDepth ? responseDepth - 1 : 0
                }
            ) || this.deletedCheepData;
        }

        var cheepData: CheepRelevantData = {
            id: cheep.id,
            author: {
                id: cheep.author_id,
                handle: cheep.handle,
                name: cheep.name,
                picture: cheep.picture
            },
            dateCreated: cheep.date_created.getTime(),
            content: cheep.content,
            gallery: cheep.gallery,
            quoteId: cheep.quote_target,
            responseId: cheep.response_target,
            quoteTarget: quoteTarget,
            responseOf: responseOf,
            comments: cheep.comments,
            likes: cheep.likes,
            recheeps: cheep.recheeps,
            quotes: cheep.quotes,
            userLikesIt: cheep.user_likes_it,
            userRecheepedIt: cheep.user_recheeped_it
        };

        return cheepData;
    }
}

type SearchCheepResult = {
    lid: number;
    id: number;
    author_id: number;
    handle: string;
    name: string;
    picture: string;
    date_created: Date;
    content?: string;
    gallery?: Array<string>;
    quote_target?: number;
    response_target?: number;
    comments: number;
    likes: number;
    recheeps: number;
    quotes: number;
    user_likes_it: boolean;
    user_recheeped_it: boolean;
};

const cheepModelManager = new PGCheepModelManager();

export default cheepModelManager;