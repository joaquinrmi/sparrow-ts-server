import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import sharp from "sharp";

export async function saveGalleryImage(img: Buffer): Promise<string>
{
    return await uploadImage("sparrow/cheep", img);
}

export async function saveProfilePicture(img: Buffer | string): Promise<string>
{
    const buffer = await sharp(img)
        .jpeg()
        .resize(500, 500, { position: "center", fit: "cover" })
        .toBuffer()
    ;

    return await uploadImage("sparrow/profile", buffer);
}

export async  function saveBannerPicture(img: Buffer | string): Promise<string>
{
    const buffer = await sharp(img)
        .jpeg()
        .resize(1500, 500, { position: "center", fit: "cover" })
        .toBuffer()
    ;

    return await uploadImage("sparrow/banner", buffer);
}

function uploadImage(folder: string, buffer: Buffer): Promise<string>
{
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            {
                format: "jpg",
                folder: folder
            },
            (err, result) => {
                if(err)
                {
                    reject(err);
                }
                else
                {
                    resolve(result.url.replace("http://", "https://"));
                }
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
}