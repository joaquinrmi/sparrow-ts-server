import Router from "../router";
import multer from "multer";
import useCredentials from "../middlewares/use_credentials";
import uploadController from "../controllers/upload_controller";

const storage = multer.memoryStorage();
const upload = multer({ storage });

class UploadRouter extends Router
{
    constructor()
    {
        super();

        this.router.use(useCredentials);
        this.router.use(upload.single("image"));

        this.router.post("/gallery", uploadController.uploadGalleryImage);
        this.router.post("/profile", uploadController.uploadProfilePicture);
        this.router.post("/banner", uploadController.uploadBanner);
    }
}

const uploadRouter = new UploadRouter();

export default uploadRouter;