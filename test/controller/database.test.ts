<<<<<<< HEAD
import * as mocha from "mocha";
import * as chai from "chai";
import chaiHttp = require("chai-http");

import Main from "../../src/controller/main";
=======
import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');

import Main from '../../src/controller/main';
>>>>>>> 584b962... added addClue and addCrawl

chai.use(chaiHttp);
const expect = chai.expect;

<<<<<<< HEAD
describe("baseRoute", () => {
  it("should be json", () => {
    return chai
      .request(Main)
      .get("/")
      .then((res) => {
        expect(res.type).to.eql("application/json");
      });
  });

  it("should have a message prop", () => {
    return chai
      .request(Main)
      .get("/")
      .then((res) => {
        expect(res.body.message).to.eql("Hello World!");
      });
  });
});
=======
describe('baseRoute', () => {

  it('should be json', () => {
    return chai.request(Main).get('/')
    .then(res => {
      expect(res.type).to.eql('application/json');
    });
  });

  it('should have a message prop', () => {
    return chai.request(Main).get('/')
    .then(res => {
      expect(res.body.message).to.eql('Hello World!');
    });
  });

});

>>>>>>> 584b962... added addClue and addCrawl
