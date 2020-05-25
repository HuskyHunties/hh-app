/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../database/DatabaseWrapper";

const cluesRouter: express.Router = express.Router();

/**
 * sends all of the clue IDs in the database
 */
cluesRouter.get("/", (req, res) => {
  dbWrapper
    .getAllClueIDs()
    .then((allClues) => res.json({ clueIDs: allClues }))
    .catch((error) => res.status(400).send(error));
});

/**
 * deletes the specified clue from the database, sends information of that clue
 * {
            crawlID: crawlID,
            name: name,
            place: place,
            image: image,
            finished: finished,
    }
 */
cluesRouter.get("/:clueID", (req, res) => {
  const clueID = Number(req.params.clueID);

  dbWrapper
    .getInfoOfClue(clueID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends all the ids of incomplete clues
 */
cluesRouter.get("/incomplete", (req, res) => {
  dbWrapper
    .getAllUnfinishedClueIDs()
    .then((allIncompleteClues) => res.json({ clueIDs: allIncompleteClues }))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends all the ids of complete clues
 */
cluesRouter.get("/complete", (req, res) => {
  dbWrapper
    .getAllFinishedClueIDs()
    .then((allCompleteClues) => res.json({ clueIDs: allCompleteClues }))
    .catch((error) => res.status(400).send(error));
});

/**
 * adds a clue described by the request body to the table, sends information of that clue
 * {
          clueID: clueID,
          crawlID: crawlID,
          name: name,
          place: place,
          finished: 0,
        }
 */
cluesRouter.post("/", (req, res) => {
  const name: string = req.body.name;
  const place: string = req.body.place;
  const crawlID = Number(req.body.crawlID);

  dbWrapper
    .addClue(name, place, crawlID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * deletes the specified clue from the database, sends information of deleted clue
 * {
          crawlID: crawlID,
          name: name,
          place: place,
          image: image,
          finished: finished,
        }
 */
cluesRouter.delete("/:clueID", (req, res) => {
  const clueID = Number(req.params.clueID);
  dbWrapper
    .deleteClue(clueID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * modifies the image and finished fields of the specified clue, returns information of modified clue
 */
cluesRouter.put("/:clueID", (req, res) => {
  const clueID = Number(req.params.clueID);
  const imageString: string = req.body.image;

  dbWrapper
    .addPictureToClue(clueID, imageString)
    .then((image) => {
      dbWrapper.finishClue(clueID);
      res.send({ image: image, finished: 1 });
    })
    .catch((error) => res.status(400).send(error));
});
export default cluesRouter;
