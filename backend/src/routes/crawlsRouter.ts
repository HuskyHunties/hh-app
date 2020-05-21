/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../controller/Database";

const crawlsRouter: express.Router = express.Router();

/**
 * sends the list of all the crawl ids
 */
crawlsRouter.get("/", async (req, res) => {
  try {
    const crawlIDs = await dbWrapper.getAllCrawls();
    res.send({ crawlIDs: crawlIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});
/**
 * sends the list of all the ids of all the clues on the specified crawl
 */
crawlsRouter.get("/:crawlID", async (req, res) => {
  try {
    const crawlID = Number(req.params.crawlID);
    const clueIDs: number[] = await dbWrapper.getCluesOfCrawl(crawlID);
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified crawl
 */
crawlsRouter.get("/:crawlID/incomplete", async (req, res) => {
  try {
    const crawlID = Number(req.params.crawlID);
    const clueIDs: number[] = await dbWrapper.getAllUnfinishedCluesOfCrawl(
      crawlID
    );
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified crawl
 */
crawlsRouter.get("/:crawlID/complete", async (req, res) => {
  try {
    const crawlID = Number(req.params.crawlID);
    const clueIDs: number[] = await dbWrapper.getAllFinishedCluesOfCrawl(
      crawlID
    );
    res.send({ clues: clueIDs });
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * makes a new crawl based off the list of clues in the request body,
 * sends back the information of the crawl created.
 * { crawlID: crawlID, name: crawlName }
 */
crawlsRouter.post("/", async (req, res) => {
  try {
    const name: string = req.body.name;
    const infoObject: object = await dbWrapper.addCrawl(name);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

/**
 * deletes the crawl specified by the given crawlID param, sends back information on deleted crawl
 * { crawlID: crawlID, name: crawlName }
 */
crawlsRouter.delete("/:crawlID", async (req, res) => {
  try {
    const crawlID = Number(req.params.crawlID);
    const infoObject: object = await dbWrapper.removeCrawl(crawlID);
    res.send(infoObject);
  } catch (error) {
    console.log(error);
    res.status(400).send();
  }
});

export default crawlsRouter;
