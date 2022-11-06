import jwt from "jsonwebtoken";
import { ShortUserInformation } from "../../model/user/user_model_manager";
import TokenData from "./token_data";

function generateToken(userData: ShortUserInformation): string
{
    const tokenData: TokenData = {
        userId: userData.id,
        userHandle: userData.handle
    };

    const token = jwt.sign(
        tokenData,
        process.env.TOKEN_SECRET
    );

    return token;
}

export default generateToken;