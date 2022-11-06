import express from "express";

class Router
{
    protected router: express.Router;

    constructor()
    {
        this.router = express.Router();
    }

    public use(): express.Router
    {
        return this.router;
    }
}

export default Router;