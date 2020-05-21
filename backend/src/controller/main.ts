import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";

import groupsRouter from "../routes/groupsRouter";
import cluesRouter from "../routes/cluesRouter";
import pathsRouter from "../routes/pathsRouter";
import crawlsRouter from "../routes/crawlsRouter";

class Main {
  public express: express.Application;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = express.Router();

    router.get("/", (req, res, next) => {
      res.send("Whattup you gotta enter a route extension: groups, clues, paths, or crawls");
    });

    this.express.use("/", router);

    this.express.use("/groups", groupsRouter);
    this.express.use("/clues", cluesRouter);
    this.express.use("/paths", pathsRouter);
    this.express.use("/crawls", crawlsRouter);
  }
}

export default new Main().express;
