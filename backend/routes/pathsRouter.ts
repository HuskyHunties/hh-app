/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../public/DatabaseWrapper";

const pathsRouter: express.Router = express.Router();

/**
 * sends a list of all the pathIDS
 */

pathsRouter.get("/", (req, res) => {
  dbWrapper
    .getAllPaths()
    .then((allPathIDs) => res.send({ allPaths: allPathIDs }))
    .catch((error) => res.status(400).send(error));
});
/**
 * sends the name and the list of all the ids of all the clues on the specified path
 * { name: name, clueIDs: clueIDs }
 */
pathsRouter.get("/:pathID", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getCluesofPath(pathID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends the name and the list of all the ids of all the incomplete clues on the specified path
 * { name: name, clueIDs: clueIDs }
 */
pathsRouter.get("/:pathID/incomplete", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getAllUnfinishedCluesOfPath(pathID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends the name and the list of all the ids of all the incomplete clues on the specified path
 * { name: name, clueIDs: clueIDs }
 */
pathsRouter.get("/:pathID/complete", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .getAllFinishedCluesOfPath(pathID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * makes a new path based off the list of clues in the request body,
 * sends back the information of the path created.
 */
pathsRouter.post("/", (req, res) => {
  const name: string = req.body.name;
  dbWrapper
    .addPath(name)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * deletes the path specified by the given pathID param, sends back information on deleted path
 */
pathsRouter.delete("/:pathID", (req, res) => {
  const pathID = Number(req.params.pathID);
  dbWrapper
    .removePath(pathID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

pathsRouter.put('/:pathID/order', (req, res) => {
  const pathID = Number(req.params.pathID);
  const clueIDs = (req.body.clueIDs as number[]);
  console.log(clueIDs)
  dbWrapper.orderCluesInPath(pathID, clueIDs)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error))
})
/**
 * adds specified clue to the specified path
 */
pathsRouter.put("/:pathID/clue/override", (req, res) => {
  const pathID = Number(req.params.pathID);
  const clueID = Number(req.body.clueID);
  dbWrapper
    .addClueToPath(pathID, clueID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));

});

/**
 * adds specified clue to the specified path if it is not already assigned to a path
 */
pathsRouter.put("/:pathID/clue", async (req, res) => {
  const pathID = Number(req.params.pathID);
  const clueID = Number(req.body.clueID);

  const alreadyAssigned = await dbWrapper.isClueAssigned(clueID);

  if (alreadyAssigned === false) {
    dbWrapper
      .addClueToPath(pathID, clueID)
      .then((infoObject) => res.send(infoObject))
      .catch((error) => res.status(400).send(error));
  } else {
    res.status(401).send({ pathID: alreadyAssigned });
  }
});

/* removes the specified clue from the specified path
*/
pathsRouter.delete("/:pathID/clue/:clueID", (req, res) => {
  const pathID = Number(req.params.pathID);
  const clueID = Number(req.params.clueID);
  console.log(pathID + " - " + clueID)
  dbWrapper
    .removeClueFromPath(pathID, clueID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
})
export default pathsRouter;
