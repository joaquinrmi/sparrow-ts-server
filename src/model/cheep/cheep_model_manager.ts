import { Transaction } from "sequelize";
import LikeData from "../like/like_data";
import UserData from "../user/user_data";
import { ShortUserInformation } from "../user/user_model_manager";
import CheepData from "./cheep_data";

/**
 * Describes an object that manages processes about cheeps.
 */
interface CheepModelManager
{
    /**
     * Searches the database for cheeps.
     * @param data Search parameters.
     * @throws {DBError} When an unexpected error occurs.
     */
    search(data: SearchCheepsData): Promise<SearchCheepsResult>;

    /**
     * Finds a cheep by its id.
     * @param data Search parameters.
     * @throws {DBError} When an unexpected error occurs.
     */
    getById(data: GetCheepByIdData): Promise<CheepRelevantData>;

    /**
     * Finds a list of cheeps of the user's timeline.
     * @param data Search parameters.
     * @throws {DBError} When an unexpected error occurs.
     */
    getTimeline(data: GetTimelineData): Promise<SearchCheepsResult>;

    /**
     * Finds all other user's cheeps.
     * @param data Search parameters.
     * @throws {DBError} When an unexpected error occurs.
     */
    getAll(data: GetAllCheepsData): Promise<SearchCheepsResult>;

    /**
     * Finds all cheeps liked by a specified user.
     * @param data Search parameters.
     * @throws {DBError} When an unexpected error occurs.
     */
    getLikedCheeps(data: GetLikedCheepsData): Promise<SearchCheepsResult>;

    /**
     * Creates a new cheep.
     * @param data The required data for a new cheep.
     * @param t The optional Transaction object.
     * @throws {DBError} When an unexpected error occurs.
     * @throws {RecheepAlreadyExistsError} When the user already recheeped the cheep.
     */
    create(data: CreateCheepData, t?: Transaction): Promise<CheepRelevantData>;

    /**
     * Deletes a cheep.
     * @param data The data to find the cheep.
     * @param t The optional Transaction object.
     * @throws {InsufficientPermissionsError} When the user is not the owner of the cheep.
     * @throws {DBError} When an unexpected error occurs.
     */
    delete(data: DeleteCheepData, t?: Transaction): Promise<void>;

    /**
     * Deletes a recheep.
     * @param data The data to find the recheep.
     * @param t The optional Transaction object.
     * @throws {DBError} When an unexpected error occurs.
     */
    deleteRecheep(data: DeleteRecheepData, t?: Transaction): Promise<void>;
}

/**
 * All data of a cheep.
 */
export type CheepRelevantData = {
    id: CheepData["id"];
    author?: ShortUserInformation;
    dateCreated?: number;
    content?: CheepData["content"];
    gallery?: CheepData["gallery"];
    quoteId?: CheepData["id"];
    responseId?: CheepData["id"];
    quoteTarget?: CheepRelevantData;
    responseOf?: CheepRelevantData;
    comments?: number;
    likes?: number;
    recheeps?: number;
    quotes?: number;
    userLikesIt?: boolean;
    userRecheepedIt?: boolean;
};

/**
 * Parameters to search for cheeps.
 */
export type SearchCheepsData = {
    currentUserId: UserData["id"];
    words: Array<string>;
    responses: boolean;
    onlyGallery: boolean;
    responseOf?: number;
    userHandle?: string;
    quoteTarget?: number;
    recheepTarget?: number;
    nextTo?: CheepData["id"];
};

/**
 * The data from a search result.
 */
export type SearchCheepsResult = {
    cheeps: Array<CheepRelevantData>;
    next: CheepData["id"];
};

/**
 * Parametes to find a cheep by its id.
 */
export type GetCheepByIdData = {
    currentUserId: UserData["id"];
    cheepId: CheepData["id"];
    quoteDepth?: number;
    responseDepth?: number;
};

/**
 * Parameters to find cheeps of the timeline.
 */
export type GetTimelineData = {
    currentUserId: UserData["id"];
    nextTo?: CheepData["id"];
};

/**
 * Parametes to find all cheeps.
 */
export type GetAllCheepsData = {
    currentUserId: UserData["id"];
    nextTo?: CheepData["id"];
};

/**
 * Parametes to find the cheeps liked by a user.
 */
export type GetLikedCheepsData = {
    currentUserId: UserData["id"];
    targetUserId: UserData["id"];
    nextTo?: LikeData["id"];
};

/**
 * Required data to create a new cheep.
 */
export type CreateCheepData = {
    authorId: UserData["id"];
    dateCreated: CheepData["date_created"];
    responseTarget?: CheepData["id"];
    quoteTarget?: CheepData["id"];
    content?: CheepData["content"];
    gallery?: CheepData["gallery"];
};

/**
 * Required data to delete a cheep.
 */
export type DeleteCheepData = {
    currentUserId: UserData["id"];
    cheepId: CheepData["id"];
};

/**
 * Required data to delete a cheep.
 */
export type DeleteRecheepData = {
    currentUserId: UserData["id"];
    targetCheepId: CheepData["id"];
};

export default CheepModelManager;