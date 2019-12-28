import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

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

    const subRouter = express.Router();

    subRouter.get('/r/:id', 
      function (req, res, next) {
      // Each call to subRouter.get identifies a handler for GET requests to a particular route
      // If I add multiple handlers to the same route, express will deal with each in a stack
      // Also, individual subRouter.get has a substack of functions that are called in order
      if (req.params.id == '641') next('route');  // next route skips all middleware calls and skips to the next route handler
      else {
        console.log("This the first middleware call in the first handler for /r/:id");
        next();  // move on to next middleware call
      }},
      function (req, res, next) {
        console.log("This is the second middleware call in the first handler for /r/:id. It will cancel other route handlers");
        res.json({"response": `ID is ${req.params.id}, not 641`}); // this cancels other route handlers and ends res req cycle
      });
    subRouter.get('/r/:id',
      function (req, res, next) {
        console.log("This is the first middleware call in the second handler for /r/:id. It is only accessible when id=641");
        res.json({"response": "ID is the special one, 641."})
      });

    this.express.use('/', router);
    this.express.use('/subrouter', subRouter); // register the subrouter
  }
}

export default new Main().express;

