process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");

// chai.use(chaiSorted);
chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  after(function() {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("responds with an array of topics objects, each film having the right properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
  });
});
