import userController from "../controllers/user_controller";
import useCredentials from "../middlewares/use_credentials";
import Router from "../router";

class UserRouter extends Router
{
    constructor()
    {
        super();

        this.router.route("/")
            .get([
                useCredentials,
                userController.checkSearchUsersParams,
                userController.search
            ])
            .post([
                userController.checkCreateUserForm,
                userController.signup
            ])
        ;

        this.router.route("/current")
            .get([
                useCredentials,
                userController.getCurrentUserData
            ])
        ;

        this.router.route("/auth")
            .post([
                userController.checkLoginForm,
                userController.login
            ])
        ;

        this.router.route("/follow/:userHandle")
            .post([
                useCredentials,
                userController.follow
            ])
        ;

        this.router.route("/unfollow/:userHandle")
            .delete([
                useCredentials,
                userController.unfollow
            ])
        ;

        this.router.route("/follower-list")
            .get([
                useCredentials,
                userController.checkFollowersListParams,
                userController.getFollowers
            ])
        ;

        this.router.route("/following-list")
            .get([
                useCredentials,
                userController.checkFollowersListParams,
                userController.getFollowing
            ])
        ;

        this.router.route("/recommended-list")
            .get([
                useCredentials,
                userController.checkRecommendedListParams,
                userController.getRecommended
            ])
        ;

        this.router.route("/users-liked-list")
            .get([
                useCredentials,
                userController.checkUsersLikedListParams,
                userController.getUsersLiked
            ])
        ;

        this.router.route("/users-recheeped-list")
            .get([
                useCredentials,
                userController.checkUsersLikedListParams,
                userController.getUsersRecheeped
            ])
        ;
    }
}

const userRouter = new UserRouter();

export default userRouter;