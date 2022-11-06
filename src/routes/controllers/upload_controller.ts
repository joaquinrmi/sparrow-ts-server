import { Request, Response } from "express";
import { saveBannerPicture, saveGalleryImage, saveProfilePicture } from "../../utils/image_uploading";
import { InternalServerErrorResponse } from "../error_response";
import { UploadImageResponse } from "../responses/upload";

class UploadController
{
    public async uploadGalleryImage(req: Request, res: Response): Promise<void>
    {
        try
        {
            var url = await saveGalleryImage(req.file.buffer);
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UploadImageResponse(url));
    }

    public async uploadProfilePicture(req: Request, res: Response): Promise<void>
    {
        try
        {
            var url = await saveProfilePicture(req.file.buffer);
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UploadImageResponse(url));
    }

    public async uploadBanner(req: Request, res: Response): Promise<void>
    {
        try
        {
            var url = await saveBannerPicture(req.file.buffer);
        }
        catch(err)
        {
            console.log(err);
            return res.error(new InternalServerErrorResponse());
        }

        res.submit(new UploadImageResponse(url));
    }
}

const uploadController = new UploadController();

export default uploadController;