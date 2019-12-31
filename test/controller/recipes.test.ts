import * as mocha from 'mocha';
import * as chai from 'chai';
import * as express from 'express';

import chaiHttp = require('chai-http');

import recipes from '../../src/controller/recipes';

chai.use(chaiHttp);
const expect = chai.expect;

// the standalone router can't serve web requests, so we must wrap it in a server
const app: express.Application = express();
app.use("/", recipes);

describe('test recipes', () => {

  it('Lists favorite recipes', () => {
    return chai.request(app).get('/favorites/recipes')
    .then(res => {
      // you will be returning a dictionary, not an object - in JS dictionary access can
      //    be done with dict.key == value
      expect(res.body.favorites.recipes).to.eql(["moroccan lentil soup", "bolognese with ALL the beef fat", "banana in meatloaf"]);
    });
  });

  it('Lists favorite ingredients', () => {
      return chai.request(app).get('/favorites/ingredients')
      .then(res => {
          expect(res.body.favorites.ingredients).to.eql(["spam", "crunchy peanut butter", "asian pear"]);
      });
  });
});