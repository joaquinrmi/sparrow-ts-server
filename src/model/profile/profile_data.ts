interface ProfileData
{
    id: number;
    user_id: number;
    name: string;
    picture: string;
    banner: string;
    description: string;
    join_date: Date;
    birthdate: Date;
    location: string;
    website: string;
}

export default ProfileData;