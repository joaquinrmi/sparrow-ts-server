import jwt from "jsonwebtoken";
import TokenData from "./token_data";

function checkToken(token: string): TokenData
{
    return jwt.verify(token, process.env.TOKEN_SECRET) as TokenData;
}

export default checkToken;