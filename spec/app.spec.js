process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
console.log(connection);

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

describe("/api", () => {
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
        expect(users[0].username).to.equal("rogersop");
      });
  });
  it("returns status 400 for invalid username column", () => {
    return request(app)
      .get("/api/users/53billyGoat")
      .expect(400)
      .then(res => {
        //console.log(res.body);
        expect(res.body.msg).to.equal("Bad Request - Invalid column provided");
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
  it("GET - Responds with an object with all the properties referenced from a specific article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(res => {
        const { articles } = res.body;
        //console.log(articles[0], "articles");
        expect(articles[0].article_id).to.equal(1);
      });
  });
  it("GET - Responds with an object with all the properties including the comment_count key", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(res => {
        const { articles } = res.body;
        expect(articles[0]).to.contain.key("comment_count");
      });
  });
  it("returns status 400 for invalid username column", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then(res => {
        //console.log(res);
        expect(res.body.msg).to.equal("Bad Request - Invalid column provided");
      });
  });

  // it.skip("GET - Responds with 404 when URL is NOT FOUND", () => {
  //   return request(app)
  //     .get("/api/articles/99999")
  //     .expect(404)
  //     .then(res => {
  //       console.log(res);
  //       expect(res.body.msg).to.equal("Not-Found");
  //     });
  // });
  it("PATCH - returns a new object with the key of inc_vote which has the value of votes that either need to be incremented of decremented", () => {
    return request(app)
      .patch("/api/articles/rogersop")
      .expect(200)
      .then(res => {
        const { articles } = res.body;
        expect(articles[0]).to.contain.key("inc_vote");
      });
  });
});
