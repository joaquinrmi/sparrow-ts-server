import useError from "../middlewares/use_error";
import useSubmit from "../middlewares/use_submit";
import Router from "../router";
import cheepRouter from "./cheep_router";
import profileRouter from "./profile_router";
import uploadRouter from "./upload_router";
import userRouter from "./user_router";

class APIRouter extends Router
{
    constructor()
    {
        super();

        this.router.use([ useSubmit, useError ]);

        this.router.use("/user", userRouter.use());
        this.router.use("/cheep", cheepRouter.use());
        this.router.use("/profile", profileRouter.use());
        this.router.use("/upload", uploadRouter.use());
    }
}

const apiRouter = new APIRouter();

export default apiRouter;