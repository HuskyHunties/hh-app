import * as mocha from 'mocha';
import * as chai from 'chai';
import * as express from 'express';

import chaiHttp = require('chai-http');

import movies from '../../src/controller/movies';

chai.use(chaiHttp);
const expect = chai.expect;
const assert = chai.assert;

// the standalone router can't serve web requests, so we must wrap it in a server
const app: express.Application = express();
app.use("/", movies);

describe('test movies', () => {
      let palindromes = ["racecar", "a man, a plan, a canal - panama", "uwu"];
      palindromes.forEach((p) => {

        it('Knows Wes Anderson loves symmetry', () => {
            return chai.request(app).get("/wesanderson/" + p.toLowerCase().replace('[^a-z]', '')) // regex to get rid of non letters
                .then(res => {
                    expect(res.body.response).to.be.true; 
                });
            });
        });

      let notPalindromes = ["no laws when on claws", "happy new years!"];
      notPalindromes.forEach((p) => {
        it('Knows Wes Anderson loves symmetry', () => {
            return chai.request(app).get("/wesanderson/" + p.toLowerCase().replace('[^a-z]', ''))
                .then(res => {
                    expect(res.body.response).to.be.false;
                });
            });
      });
});

