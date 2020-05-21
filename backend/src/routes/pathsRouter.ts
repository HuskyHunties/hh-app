/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../controller/Database";

const pathsRouter: express.Router = express.Router();

/**
 * sends the list of all the ids of all the clues on the specified path
 */
pathsRouter.get("/:pathID", async (req, res) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getCluesofPath(pathID);
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified path
 */
pathsRouter.get("/:pathID/incomplete", async (req, res) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getAllUnfinishedCluesOfPath(
      pathID
    );
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified path
 */
pathsRouter.get("/:pathID/complete", async (req, res) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueIDs: number[] = await dbWrapper.getAllFinishedCluesOfPath(pathID);
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * makes a new path based off the list of clues in the request body,
 * sends back the information of the path created.
 * { pathID: pathID, name: name }
 */
pathsRouter.post("/", async (req, res) => {
  try {
    const name: string = req.body.name;
    const infoObject: object = await dbWrapper.createPath(name);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * deletes the path specified by the given pathID param, sends back information on deleted path
 * { name: name, clueIDs: clueIDs }
 */
pathsRouter.delete("/:pathID", async (req, res) => {
  try {
    const pathID = Number(req.params.pathID);
    const infoObject: object = await dbWrapper.removePath(pathID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * adds or removes the specified clue to the specified path, sends back information on modified path
 * { pathID: pathID, clueID: clueID }
 */
pathsRouter.put("/:pathID", async (req, res) => {
  try {
    const pathID = Number(req.params.pathID);
    const clueID = Number(req.body.clueID);
    if (Boolean(req.body.addClue)) {
      const infoObject: object = await dbWrapper.addClueToPath(pathID, clueID);
      res.send(infoObject);
    } else {
      const infoObject: object = await dbWrapper.removeClueFromPath(
        pathID,
        clueID
      );
      res.send(infoObject);
    }
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

export default pathsRouter;
