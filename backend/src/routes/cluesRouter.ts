/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../controller/Database";

const cluesRouter: express.Router = express.Router();

/**
 * sends all of the clue IDs in the database
 */
cluesRouter.get("/", async (req, res) => {
  try {
    const allClues: number[] = await dbWrapper.getAllClueIDs();
    res.json({ clueIDs: allClues });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
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
cluesRouter.get("/:clueID", async (req, res) => {
  const clueID = Number(req.params.clueID);

  try {
    const infoObject: object = await dbWrapper.getInfoOfClue(clueID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends all the ids of incomplete clues
 */
cluesRouter.get("/incomplete", async (req, res) => {
  try {
    const allIncompleteClues: number[] = await dbWrapper.getAllUnfinishedClueIDs();
    res.json({ clueIDs: allIncompleteClues });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends all the ids of complete clues
 */
cluesRouter.get("/complete", async (req, res) => {
  try {
    const allCompleteClues: number[] = await dbWrapper.getAllFinishedClueIDs();
    res.json({ clueIDs: allCompleteClues });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
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
cluesRouter.post("/", async (req, res) => {
  const name: string = req.body.name;
  const place: string = req.body.place;
  const crawlID = Number(req.body.crawlID);

  try {
    const infoObject: object = await dbWrapper.addClue(name, place, crawlID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
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
cluesRouter.delete("/:clueID", async (req, res) => {
  const clueID = Number(req.params.clueID);

  try {
    const infoObject: object = await dbWrapper.deleteClue(clueID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * modifies the image and finished fields of the specified clue, returns information of modified clue
 */
cluesRouter.put("/:clueID", async (req, res) => {
  const clueID = Number(req.params.clueID);
  const imageString: string = req.body.image;

  try {
    let image: string;
    if (imageString) {
      image = await dbWrapper.addPictureToClue(clueID, imageString);
    }
    const finished: number = await dbWrapper.finishClue(clueID);
    res.send({ image: image, finished: finished });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});
export default cluesRouter;
