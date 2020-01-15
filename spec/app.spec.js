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
  beforeEach(() => {
    return connection.seed.run();
  });
  after(function() {
    return connection.destroy();
  });
  describe("/topics", () => {
    it("GET: Responds with an array of topics objects, each film having the right properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200);
    });
    it("GET - Responds with 404 when URL is NOT FOUND", () => {
      return request(app)
        .get("/api/topic")
        .expect(404);
    });
  });
});

describe.only("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(function() {
    return connection.destroy();
  });
  it("GET - Responds with an object with the properties username, avatar_url, name", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(res => {
        const { users } = res.body;
        console.log(res.body);
        //selectUsers("use")
        expect(users[0].username).to.equal("rogersop");
      });
  });
});
