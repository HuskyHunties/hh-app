import * as express from "express";

class MoviesRouter {
    router: express.Router;
    constructor() {
        this.router = express.Router();
    }
}


export default new MoviesRouter().router; 
