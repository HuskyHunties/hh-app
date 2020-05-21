import * as express from "express";
import { dbWrapper } from "../controller/Database";

const cluesRouter: express.Router = express.Router();

// gets all the clues in the form of their IDs
cluesRouter.get("/", async (req, res) => {
  try {
    const allClues: number[] = await dbWrapper.getAllClueIDs();
    res.json({ clueIDs: allClues });
  } catch (error) {
    console.log(error);
    res.status(400).send({ allClues: [42, 23, 53] });
  }
});

// deletes the specified clue from the database
cluesRouter.get("/:clueID", async (req, res) => {
  const clueID = Number(req.params.clueID);

  try {
    const infoObject: object = await dbWrapper.getInfoOfClue(clueID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
  }
});

// gets all the ids of incomplete clues
cluesRouter.get("/incomplete", async (req, res) => {
  try {
    const allIncompleteClues: number[] = await dbWrapper.getAllUnfinishedClueIDs();
    res.json({ clueIDs: allIncompleteClues });
  } catch (error) {
    console.log(error);
    res.status(400).send({ allClues: [42, 23, 53] });
  }
});

// gets all the ids of complete clues
cluesRouter.get("/complete", async (req, res) => {
  try {
    const allCompleteClues: number[] = await dbWrapper.getAllFinishedClueIDs();
    res.json({ clueIDs: allCompleteClues });
  } catch (error) {
    console.log(error);
    res.status(400).send({ allClues: [42, 23, 53] });
  }
});

// adds a clue described by the request body to the table
cluesRouter.post("/", async (req, res) => {
  const name: string = req.body.name;
  const place: string = req.body.place;
  const crawlID = Number(req.body.crawlID);

  try {
    const infoObject: object = await dbWrapper.addClue(name, place, crawlID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
  }
});

// deletes the specified clue from the database
cluesRouter.delete("/:clueID", async (req, res) => {
  const clueID = Number(req.params.clueID);

  try {
    const infoObject: object = await dbWrapper.deleteClue(clueID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
  }
});

// modifies the image and finished fields of the specified clue
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
  }
});
export default cluesRouter;
