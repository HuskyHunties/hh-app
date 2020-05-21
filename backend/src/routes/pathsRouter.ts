import * as express from "express";
import { dbWrapper } from "../controller/Database";

const pathsRouter: express.Router = express.Router();

// gets the list of all the ids of all the clues on the specified path
pathsRouter.get("/:pathID", async (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getCluesofPath(pathID);
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3, 4, 5, 6] });
  }
});

// gets the list of all the ids of all the incomplete clues on the specified path
pathsRouter.get("/:pathID/incomplete", async (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getAllIncompleteCluesOfPath(
      pathID
    );
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3] });
  }
});

// gets the list of all the ids of all the incomplete clues on the specified path
pathsRouter.get("/:pathID/complete", async (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getAllCompletedCluesOfPath(
      pathID
    );
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [4, 5, 6] });
  }
});

// makes a new path based off the list of clues in the request body,
// sends back the ID of the new path created
pathsRouter.post("/", async (req, res, next) => {
  try {
    const name: string = req.body.name;
    const infoObject: Record<string, any> = await dbWrapper.createPath(name);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send({ pathID: 1 });
  }
});

// deletes the path specified by the given pathID param
pathsRouter.delete("/:pathID", async (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const infoObject: Record<string, any> = await dbWrapper.removePath(pathID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send({ clueIDs: [1, 2, 3, 4, 5, 6] });
  }
});

// adds or removes the specified clue to the specified path
// req.body.clueID is the id of the clue, and req.body.add is
// boolean
pathsRouter.put("/:pathID", async (req, res, next) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueID = Number(req.body.clueID);
    if (Boolean(req.body.addClue)) {
      const infoObject: Record<string, any> = await dbWrapper.addClueToPath(
        pathID,
        clueID
      );
      res.send(infoObject);
    } else {
      const infoObject: Record<
        string,
        any
      > = await dbWrapper.removeClueFromPath(pathID, clueID);
      res.send(infoObject);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

export default pathsRouter;
