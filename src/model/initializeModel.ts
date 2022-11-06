import { initializeCheep } from "./cheep/cheep";
import { initializeFollow } from "./follow/follow";
import { initializeLike } from "./like/like";
import { initializeProfile } from "./profile/profile";
import { initializeQuote } from "./quote/quote";
import { initializeRecheep } from "./recheep/recheep";
import { initializeUser } from "./user/user";

async function initializeModel(): Promise<void>
{
    await initializeUser();
    await initializeFollow();
    await initializeProfile();
    await initializeCheep();
    await initializeLike();
    await initializeRecheep();
    await initializeQuote();
}

export default initializeModel;