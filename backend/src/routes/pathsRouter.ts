import * as express from "express";
import { PathControllerImp } from "../controller/PathController";
import { Path } from "controller/PathController";

const pathsRouter: express.Router = express.Router();
const controller = new PathControllerImp();

// gets the list of all the ids of all the clues on the specified path
pathsRouter.get('/:pathID', (req, res, next) => {
    try{
        const pathID = Number(req.params.pathID);
        const clueIDs: number[] = controller.getClues(pathID);
        res.send(JSON.stringify({clues: clueIDs}))
    }catch(error){
        console.log(error);
        res.status(400).send();
    }
})




export default pathsRouter;