/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../database/DatabaseWrapper";

const pathsRouter: express.Router = express.Router();

/**
 * sends a list of all the pathIDS
 */

pathsRouter.get("/", (req, res) => {
  dbWrapper
    .getAllPaths()
    .then((allPathIDs) => res.send({ allPaths: allPathIDs })).catch(error => res.status(400).send(error));
});
/**
 * sends the list of all the ids of all the clues on the specified path
 */
pathsRouter.get("/:pathID", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getCluesofPath(pathID)
    .then((clueIDs) => res.send({ clues: clueIDs })).catch(error => res.status(400).send(error));
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified path
 */
pathsRouter.get("/:pathID/incomplete", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getAllUnfinishedCluesOfPath(pathID)
    .then((clueIDs) => res.send({ clues: clueIDs })).catch(error => res.status(400).send(error));
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified path
 */
pathsRouter.get("/:pathID/complete", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getAllFinishedCluesOfPath(pathID)
    .then((clueIDs) => res.send({ clues: clueIDs })).catch(error => res.status(400).send(error));
});

/**
 * makes a new path based off the list of clues in the request body,
 * sends back the information of the path created.
 * { pathID: pathID, name: name }
 */
pathsRouter.post("/", (req, res) => {
  const name: string = req.body.name;
  dbWrapper.addPath(name).then((infoObject) => res.send(infoObject)).catch(error => res.status(400).send(error));
});

/**
 * deletes the path specified by the given pathID param, sends back information on deleted path
 * { name: name, clueIDs: clueIDs }
 */
pathsRouter.delete("/:pathID", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper.removePath(pathID).then((infoObject) => res.send(infoObject)).catch(error => res.status(400).send(error));
});

/**
 * adds or removes the specified clue to the specified path, sends back information on modified path
 * { pathID: pathID, clueID: clueID }
 */
pathsRouter.put("/:pathID", (req, res) => {
  const pathID = Number(req.params.pathID);
  const clueID = Number(req.body.clueID);
  if (Boolean(req.body.addClue)) {
    dbWrapper
      .addClueToPath(pathID, clueID)
      .then((infoObject) => res.send(infoObject)).catch(error => res.status(400).send(error));
  } else {
    dbWrapper
      .removeClueFromPath(pathID, clueID)
      .then((infoObject) => res.send(infoObject)).catch(error => res.status(400).send(error));
  }
});

export default pathsRouter;
