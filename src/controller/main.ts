<<<<<<< HEAD
import * as express from "express";
import * as logger from "morgan";
import * as bodyParser from "body-parser";
import sr from "./subrouter"; // note, the name sr is arbitrary and doesn't correspond to any literals in subRouter.ts
=======
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import sr from './subrouter'; // note, the name sr is arbitrary and doesn't correspond to any literals in subRouter.ts
>>>>>>> 584b962... added addClue and addCrawl

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
      res.json({
        dan: "dumb",
      }); // this ends the req res cycle and sends a json response
    });

<<<<<<< HEAD
    this.express.use("/", router);

    this.express.use("/subrouter", sr); // register the subrouter
=======
    this.express.use('/', router);
    
    this.express.use('/subrouter', sr); // register the subrouter
>>>>>>> 584b962... added addClue and addCrawl
  }
}

export default new Main().express;
