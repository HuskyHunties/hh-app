import * as express from "express";
import { PathControllerImpError, PathControllerImp } from "../controller/PathController";

const pathsRouter: express.Router = express.Router();
const controller = new PathControllerImp();

// gets the list of all the ids of all the clues on the specified path
pathsRouter.get("/:pathID", (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = controller.getClues(pathID);
    res.json(JSON.stringify({ clues: clueIDs }));
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3, 4, 5, 6] });
  }
});

// gets the list of all the ids of all the incomplete clues on the specified path
pathsRouter.get("/:pathID/incomplete", (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = controller.getIncompleteClues(pathID);
    res.json(JSON.stringify({ clues: clueIDs }));
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3] });
  }
});

// gets the list of all the ids of all the incomplete clues on the specified path
pathsRouter.get("/:pathID/complete", (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = controller.getCompleteClues(pathID);
    res.json({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [4, 5, 6] });
  }
});

// makes a new path based off the list of clues in the request body,
// sends back the ID of the new path created
pathsRouter.post("/", (req, res, next) => {
  try {
    const name: string = req.body.name;
    const pathID = controller.createPath(name);
    res.json({ pathID: pathID });
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 1 });
  }
});

// deletes the path specified by the given pathID param
pathsRouter.delete("/:pathID", (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const removedClues: number[] = controller.removePath(pathID);
    res.json({ clueIDs: removedClues });
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3, 4, 5, 6] });
  }
});

// adds or removes the specified clue to the specified path
// req.body.clueID is the id of the clue, and req.body.add is
// boolean
pathsRouter.put("/:pathID", (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueID = req.body.clueID;
    if (Boolean(req.body.add)) {
      controller.addClueToPath(pathID, clueID);
      res.send(`Added clue: ${clueID} to path: ${pathID}`);
    } else {
      controller.removeClueFromPath(pathID, clueID);
      res.send(`Removed clue: ${clueID} from path: ${pathID}`);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

export default pathsRouter;
