import * as express from "express";
import { ClueControllerImp } from "../controller/ClueController";
import { Path } from "controller/PathController";

const cluesRouter: express.Router = express.Router();
const controller = new ClueControllerImp();

// gets all the clues in the form of their IDs
cluesRouter.get('/', (req, res, next) => {
    try{

    }catch(error){
        console.log(error)
    }
})






export default cluesRouter;