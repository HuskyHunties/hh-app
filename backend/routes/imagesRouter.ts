/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../public/DatabaseWrapper";

class Clue {
  name: string;
  listID: string;
  clueNumber: number;
  description: string;
  lat: number;
  long: number;
  finished: number;
}

const imagesRouter: express.Router = express.Router();
class ImageInfo {
  image: string;
  listID: string;
  clueNumber: number;
}

imagesRouter.get("/all", async (req, res, next) => {
  const allClueIDs = await dbWrapper.getAllClueIDs();
  const infoList: ImageInfo[] = [];

  allClueIDs.forEach(async (id) => {
    const image: string = await dbWrapper.getImageOfClue(id);
    const clueInfo: Clue = await dbWrapper.getInfoOfClue(id);

    infoList.push({
      image: image,
      listID: clueInfo.listID,
      clueNumber: clueInfo.clueNumber,
    });
  });
});

imagesRouter.get("/finished", async (req, res, next) => {
  const allClueIDs = await dbWrapper.getAllFinishedClueIDs();
  const infoList: ImageInfo[] = [];

  allClueIDs.forEach(async (id) => {
    const image: string = await dbWrapper.getImageOfClue(id);
    const clueInfo: Clue = await dbWrapper.getInfoOfClue(id);

    infoList.push({
      image: image,
      listID: clueInfo.listID,
      clueNumber: clueInfo.clueNumber,
    });
  });
});
export default imagesRouter;
