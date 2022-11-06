import cheepController from "../controllers/cheep_controller";
import useCredentials from "../middlewares/use_credentials";
import Router from "../router";

class CheepRouter extends Router
{
    constructor()
    {
        super();

        this.router.route("/")
            .get([
                useCredentials,
                cheepController.checkSearchCheepsParams,
                cheepController.search
            ])
            .post([
                useCredentials,
                cheepController.checkCreateCheepForm,
                cheepController.create
            ])
        ;

        this.router.route("/liked-list")
            .get([
                useCredentials,
                cheepController.checkLikedCheepsParams,
                cheepController.getLikedCheeps
            ])
        ;

        this.router.route("/timeline")
            .get([
                useCredentials,
                cheepController.checkGetTimelineParams,
                cheepController.getTimeline
            ])
        ;

        this.router.route("/explore")
            .get([
                useCredentials,
                cheepController.checkExploreParams,
                cheepController.explore
            ])
        ;

        this.router.route("/like/:cheepId")
            .post([
                useCredentials,
                cheepController.checkLikeParams,
                cheepController.like
            ])
            .delete([
                useCredentials,
                cheepController.checkUndoLikeParams,
                cheepController.undoLike
            ])
        ;

        this.router.route("/recheep/:cheepId")
            .delete([
                useCredentials,
                cheepController.checkDeleteRecheepParams,
                cheepController.deleteRecheep
            ])
        ;

        this.router.route("/:cheepId")
            .get([
                useCredentials,
                cheepController.checkGetCheepParams,
                cheepController.getById
            ])
            .delete([
                useCredentials,
                cheepController.checkDeleteCheepParams,
                cheepController.delete
            ])
        ;
    }
}

const cheepRouter = new CheepRouter();

export default cheepRouter;