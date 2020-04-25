import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import sr from './subrouter'; // note, the name sr is arbitrary and doesn't correspond to any literals in subRouter.ts
import movieRouter from './movies'
import recipesRouter from './recipes'

class Main {
  public express: express.Application;
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
  }

  private middleware(): void {
    this.express.use(logger('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = express.Router();

    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World!'
      }); // this ends the req res cycle and sends a json response
    });

    this.express.use('/', router);
    
    this.express.use('/subrouter', sr); // register the subrouter
    this.express.use('/movies', movieRouter); // register the movies router
    this.express.use('/recipes', recipesRouter); // register the recipes router
  }
}

export default new Main().express;

