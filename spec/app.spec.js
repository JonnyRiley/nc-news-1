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
      it("Error 405 - Responds with 405 when URL is NOT FOUND", () => {
        return request(app)
          .get("/api/tc")
          .expect(405)
          .then(res => {
            expect(res.status).to.equal(405);
          });
      });
    });
    describe("/users", () => {
      it("GET - Responds with an object with the properties username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(res => {
            const { users } = res.body;
            console.log(users);
            expect(users[0].username).to.equal("rogersop");
          });
      });
      it("GET - Responds with an object with the properties username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(res => {
            const { users } = res.body;
            expect(users[0]).to.contain.keys("username");
          });
      });
      it("Error 400 - Returns status 400 for invalid username column", () => {
        return request(app)
          .get("/api/users/53billyGoat")
          .expect(400)
          .then(res => {
            expect(res.body.msg).to.equal(
              "Bad Request - Invalid column provided"
            );
          });
      });
    });
    describe.only("/articles", () => {
      it("GET - Responds with a staus 200 for getting all articles ", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body).to.have.key("articles");
          });
      });
      it("Error 405 - Responds with an object with all the properties referenced from a specific article_id", () => {
        return request(app)
          .get("/api/articl")
          .expect(405)
          .then(res => {
            expect(res.body.msg).to.equal("Route pathway NOT FOUND");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/articles")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
