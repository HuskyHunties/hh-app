import * as express from "express";
import { ClueControllerImp } from "../controller/ClueController";
import { Path } from "controller/PathController";

const cluesRouter: express.Router = express.Router();
const controller = new ClueControllerImp();

// gets all the clues in the form of their IDs
cluesRouter.get("/", (req, res, next) => {
  try {
    const allClues: number[] = controller.getAllClues();
    res.json({ allClues: allClues });
  } catch (error) {
    console.log(error);
    res.status(400).send({ allClues: [42, 23, 53] });
  }
});

export default cluesRouter;
