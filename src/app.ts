if(process.env.NODE_ENV !== "production")
{
    require("dotenv").config();
}

import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";
import initializeModel from "./model/initializeModel";
import apiRouter from "./routes/routers/api_router";

class App
{
    private port: string;
    private app: express.Application;

    constructor()
    {
        this.port = process.env.PORT;
        this.app = express();
    }

    public async start(): Promise<void>
    {
        try
        {
            await this.initialize();
            await this.startServer();

            console.log(`Server on port ${this.port}.`);
        }
        catch(err)
        {
            console.log(err);
            return;
        }
    }

    private async initialize(): Promise<void>
    {
        await initializeModel();

        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_API_KEY,
            api_secret: process.env.CLOUD_API_SECRET
        });

        if(process.env.NODE_ENV !== "production")
        {
            this.app.use(cors({
                origin: [
                   "http://localhost:3000"
                ],
                credentials: true
            }));
        }

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));

        this.app.use("/api", apiRouter.use());
    }

    private startServer(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            this.app.listen(this.port, resolve)
            .on(
                "error",
                (error) =>
                {
                    reject(error);
                }
            );
        });
    }
}

export default App;