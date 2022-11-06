import profileController from "../controllers/profile_controller";
import useCredentials from "../middlewares/use_credentials";
import Router from "../router";

class ProfileRouter extends Router
{
    constructor()
    {
        super();

        this.router.route("/")
            .patch([
                useCredentials,
                profileController.checkUpdateProfileForm,
                profileController.updateProfile
            ])
        ;

        this.router.route("/:userHandle")
            .get([
                useCredentials,
                profileController.checkGetProfileParams,
                profileController.getProfile
            ])
        ;
    }
}

const profileRouter = new ProfileRouter();

export default profileRouter;