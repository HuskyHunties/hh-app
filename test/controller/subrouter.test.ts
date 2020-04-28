import * as mocha from 'mocha';
import * as chai from 'chai';
import * as express from 'express';

import chaiHttp = require('chai-http');

import sr from '../../src/controller/subrouter';

chai.use(chaiHttp);
const expect = chai.expect;

// the standalone router can't serve web requests, so we must wrap it in a server
const app: express.Application = express();
app.use("/", sr);

describe('test subrouter', () => {

  it('Points out when IDs are not 641', () => {
    return chai.request(app).get('/r/2')
    .then(res => {
      expect(res.body.response).not.to.eql("ID is the special one, 641.");
    });
  });

  it('Responds in JSON when ID is not 641', () => {
    return chai.request(app).get('/r/2')
    .then(res => {
      expect(res.type).to.eql('application/json');
    });
  });

  it('Has a special message when ID is 641', () => {
    return chai.request(app).get('/r/641') 
    .then(res => {
      const msg = res.body.response; // aka res.body["response"] -> we get back the dictionary we sent out
      expect(msg).to.eql("ID is the special one, 641.");
    });
  });
 
  it('Responds in JSON when ID is 641', () => {
    return chai.request(app).get('/r/641')
    .then(res => {
      expect(res.type).to.eql('application/json');
    });
  });


  /*
  The reason for all these closures floting around the tests is because chai provides a .then(...) method
  for testing asynchronous promises. 

  then(...) takes a callback function with one or two parameters, the first is a web response and the second is a potential http error
  The callback method isn't required to return 
  */
});

