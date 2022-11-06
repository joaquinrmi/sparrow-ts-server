import { Transaction } from "sequelize";
import CheepData from "../cheep/cheep_data";
import ProfileData from "../profile/profile_data";
import UserData from "./user_data";

interface UserModelManager
{
    getId(handle: UserData["handle"]): Promise<UserData["id"]>;

    getByCredentials(data: UserLoginData): Promise<ShortUserInformation>;

    getShortInformation(userId: UserData["id"]): Promise<ShortUserInformation>;

    getRecommendedList(data: UserRecommendedListData): Promise<SearchUserResult>;

    getFollowers(data: SearchUserFollowersData): Promise<SearchUserResult>;

    getFollowing(data: SearchUserFollowersData): Promise<SearchUserResult>;

    getUsersLikeACheep(data: SearchUsersLiked): Promise<SearchUserResult>;

    getUsersRecheepedACheep(data: SearchUsersRecheeped): Promise<SearchUserResult>;

    search(data: SearchUsersData): Promise<SearchUserResult>;

    create(data: CreateUserData, t?: Transaction): Promise<ShortUserInformation>;
}

export type ShortUserInformation = {
    id: UserData["id"];
    handle: UserData["handle"];
    name: ProfileData["name"];
    picture: ProfileData["picture"];
};

export type UserCellData = {
    handle: UserData["handle"];
    name: ProfileData["name"];
    picture: ProfileData["picture"];
    description: ProfileData["description"];
    following: boolean;
    follower: boolean;
};

export type SessionToken = string;

export type SearchUserResult = {
    users: Array<UserCellData>;
    next: UserData["id"];
};

export type UserRecommendedListData = {
    currentUserId: UserData["id"];
    nextTo?: UserData["id"];
};

export type SearchUserFollowersData = {
    currentUserId: UserData["id"];
    userHandle: UserData["handle"];
    nextTo?: UserData["id"];
};

export type SearchUsersData = {
    currentUserId: UserData["id"];
    nameOrHandle?: Array<string>;
    nextTo?: UserData["id"];
};

export type SearchUsersLiked = {
    currentUserId: UserData["id"];
    targetCheepId: CheepData["id"];
    nextTo?: UserData["id"];
};

export type SearchUsersRecheeped = {
    currentUserId: UserData["id"];
    targetCheepId: CheepData["id"];
    nextTo?: UserData["id"];
};

export type CreateUserData = {
    handle: UserData["handle"];
    email: UserData["email"];
    password: UserData["password"];
    name: ProfileData["name"];
    birthdate: ProfileData["birthdate"];
};

export type UserLoginData = {
    handleOrEmail: string;
    password: string;
};

export default UserModelManager;