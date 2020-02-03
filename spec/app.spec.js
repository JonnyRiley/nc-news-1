process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");

chai.use(require("sams-chai-sorted"));

describe("/api", () => {
  beforeEach(() => {
    return connection.seed.run();
  });
  after(function() {
    return connection.destroy();
  });
  describe("/api", () => {
    describe("/topics", () => {
      it("GET: Responds with an array of topics objects, each film having the right properties", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            //console.log(res.body);
            expect(res.body).to.have.key("topics");
            expect(res.status).to.equal(200);
          });
      });
    });
    describe("/users", () => {
      it.only("GET - Responds with an object with the properties username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(res => {
            const { users } = res.body;
            console.log(users);
            expect(users[0].username).to.equal("rogersop");
          });
      });
    });
  });
});
