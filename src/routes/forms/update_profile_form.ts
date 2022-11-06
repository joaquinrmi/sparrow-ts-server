import ProfileData from "../../model/profile/profile_data";

type UpdateProfileForm = {
    name?: ProfileData["name"];
    picture?: ProfileData["picture"];
    banner?: ProfileData["banner"];
    description?: ProfileData["description"];
    birthdate?: number;
    location?: ProfileData["location"];
    website?: ProfileData["website"];
};

export default UpdateProfileForm;