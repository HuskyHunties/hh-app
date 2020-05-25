/* eslint-disable tsdoc/syntax */
import * as express from "express";
import { dbWrapper } from "../database/DatabaseWrapper";

const crawlsRouter: express.Router = express.Router();

/**
 * sends the list of all the crawl ids
 */
crawlsRouter.get("/", (req, res) => {
  dbWrapper
    .getAllCrawls()
    .then((crawlIDs) => res.send({ crawlIDs: crawlIDs }))
    .catch((error) => res.status(400).send(error));
});
/**
 * sends the list of all the ids of all the clues on the specified crawl
 */
crawlsRouter.get("/:crawlID", (req, res) => {
  const crawlID = Number(req.params.crawlID);
  dbWrapper
    .getCluesOfCrawl(crawlID)
    .then((clueIDs) => res.send({ clues: clueIDs }))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified crawl
 */
crawlsRouter.get("/:crawlID/incomplete", (req, res) => {
  const crawlID = Number(req.params.crawlID);
  dbWrapper
    .getAllUnfinishedCluesOfCrawl(crawlID)
    .then((clueIDs) => res.send({ clues: clueIDs }))
    .catch((error) => res.status(400).send(error));
});

/**
 * sends the list of all the ids of all the incomplete clues on the specified crawl
 */
crawlsRouter.get("/:crawlID/complete", (req, res) => {
  const crawlID = Number(req.params.crawlID);
  dbWrapper
    .getAllFinishedCluesOfCrawl(crawlID)
    .then((clueIDs) => res.send({ clues: clueIDs }))
    .catch((error) => res.status(400).send(error));
});

/**
 * makes a new crawl based off the list of clues in the request body,
 * sends back the information of the crawl created.
 * { crawlID: crawlID, name: crawlName }
 */
crawlsRouter.post("/", (req, res) => {
  const name: string = req.body.name;
  dbWrapper
    .addCrawl(name)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

/**
 * deletes the crawl specified by the given crawlID param, sends back information on deleted crawl
 * { crawlID: crawlID, name: crawlName }
 */
crawlsRouter.delete("/:crawlID", (req, res) => {
  const crawlID = Number(req.params.crawlID);
  dbWrapper
    .removeCrawl(crawlID)
    .then((infoObject) => res.send(infoObject))
    .catch((error) => res.status(400).send(error));
});

export default crawlsRouter;
