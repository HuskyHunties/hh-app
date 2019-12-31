import * as express from "express";

class RecipesRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
    }
}


export default new RecipesRouter().router; 