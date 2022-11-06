import { Transaction } from "sequelize";
import UserData from "../user/user_data";
import ProfileData from "./profile_data";

interface ProfileModelManager
{
    getById(data: GetProfileByIdData): Promise<RelevantProfileData>;

    getByHandle(data: GetProfileByHandleData): Promise<RelevantProfileData>;

    create(data: CreateProfileData, t?: Transaction): Promise<ProfileData>;

    update(date: UpdateProfileData, t?: Transaction): Promise<RelevantProfileData>;
}

export type RelevantProfileData = {
    handle: UserData["handle"],
    name: ProfileData["name"];
    picture: ProfileData["picture"];
    banner: ProfileData["banner"];
    description: ProfileData["description"];
    joinDate: ProfileData["join_date"];
    birthdate: ProfileData["birthdate"];
    location: ProfileData["location"];
    website: ProfileData["website"];
    cheepCount: number;
    followingCount: number;
    followersCount: number;
    following: boolean;
};

export type GetProfileByIdData = {
    currentUserId: UserData["id"];
    userId: UserData["id"];
};

export type GetProfileByHandleData = {
    currentUserId: UserData["id"];
    handle: UserData["handle"];
};

export type CreateProfileData = {
    userId: UserData["id"];
    name: ProfileData["name"];
    picture: ProfileData["picture"];
    birthdate: ProfileData["birthdate"];
};

export type UpdateProfileData = {
    userId: UserData["id"];
    name?: ProfileData["name"];
    picture?: ProfileData["picture"];
    banner?: ProfileData["banner"];
    description?: ProfileData["description"];
    birthdate?: ProfileData["birthdate"];
    location?: ProfileData["location"];
    website?: ProfileData["website"];
};

export default ProfileModelManager;