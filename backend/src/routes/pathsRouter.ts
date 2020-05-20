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
        res.json(JSON.stringify({clues: clueIDs}))
    }catch(error){
        console.log(error);
        res.status(400).send();
    }
})

// makes a new path based off the list of clues in the request body,
// sends back the ID of the new path created
pathsRouter.post('/', (req, res, next) => {
    try{
        const clues: number[] = req.body.clueIDs;
        const pathID = controller.newPath(clues);
        res.json(JSON.stringify({pathID: pathID}))
    }catch(error){
        console.log(error);
        res.status(400).send();
    }
})

// deletes the path specified by the given pathID param
pathsRouter.delete('/:pathID', (req, res, next) => {
    try{
        const pathID = Number(req.params.pathID);
        const removedClues = controller.removePath(pathID);
        res.json({removedClues: removedClues});

    }catch(error){
        console.log(error);
        res.status(400).send();
    }
})

// adds the specified clue to the specified path
pathsRouter.put('/:pathID', (req, res, next) => {
    try{
        const pathID = Number(req.params.pathID);
        const clueID = req.body.clueID;
        controller.addClueToPath(pathID, clueID);
        res.send(`Added clue: ${clueID} to path: ${pathID}`) 
    }catch(error){
        console.log(error);
        res.status(400).send();
    }
})



export default pathsRouter;