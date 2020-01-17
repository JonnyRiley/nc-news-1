process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const connection = require("../db/connection");
//console.log(connection);

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
        .expect(200)
        .then(res => {
          console.log(res);
          expect(res.status).to.equal(200);
        });
    });
    it("GET - Responds with 404 when URL is NOT FOUND", () => {
      return request(app)
        .get("/api/tc")
        .expect(404)
        .then(res => {
          console.log(res);
          expect(res.status).to.equal(404);
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
          expect(res.body.msg).to.equal(
            "Bad Request - Invalid column provided"
          );
        });
    });
  });
  describe("/api/articles", () => {
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
          expect(res.body.msg).to.equal(
            "Bad Request - Invalid column provided"
          );
        });
    });

    it("GET - Responds with 404 when URL is NOT FOUND", () => {
      return request(app)
        .get("/api/articles/99999")
        .expect(404)
        .then(res => {
          console.log(res);
          expect(res.body.msg).to.equal("Not-Found");
        });
    });
    it("PATCH - returns a new object with the key of inc_vote which has a plus value of votes that either need to be incremented of decremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send({ inc_vote: 12 })
        .then(res => {
          console.log(res.body, "specfile");
          expect(res.body).to.contain.key("article");
        });
    });
    it("PATCH - returns a new object with the key of inc_vote which has a negative value of votes that either need to be incremented of decremented", () => {
      return request(app)
        .patch("/api/articles/1")
        .expect(200)
        .send({ inc_vote: 120 })
        .then(res => {
          console.log(res.body.article[0].votes, "specfile");
          expect(res.body).to.contain.key("article");
        });
    });
    it("returns status 400 for no inc_votes on the body", () => {
      return request(app)
        .patch("/api/articles/33")
        .expect(400)
        .send({ inc_vote: 3 })
        .then(res => {
          console.log(res.body.inc_vote, "REEESSS");
          expect(res.body).to.contain.key("votes");
          //expect(res).to.be.a("number");
        });
    });
    //expect(res.body.article)to.be.an('object')
    //miss spelling
    // empty {}
    describe("/api/articles/:articles_id/comments", () => {
      it("POST - When given an object with the keys of username and body it will input this into the articles table", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .expect(201)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(res => {
            console.log(res.body.comments[0], "specFile");
            expect(res.body.comments[0].comment_id).to.equal(19);
            expect(res.body.comments[0].comment_id).to.be.a("number");
            expect(res.body.comments[0].body).to.be.a("string");
          });
      });
      // ERROR HANDLONG HERE!!!
      it("GET - responds with a sort_by and order in an array", () => {
        return request(app)
          .get("/api/articles/2/comments?sortBy=comment_id")
          .expect(200)
          .then(res => {
            console.log(res.body.sortBy);
            expect(res.body.sortBy).to.be.sortedBy("comment_id", {
              descending: true
            });
            expect(res.body.sortBy).to.be.an("array");
          });
      });
      it("Status:500", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .get("/api/articles/2/comments?order=")

            .expect(500)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Internal Server Error");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    it("Status:405", () => {
      const invalidMethods = ["post", "put", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request(app)
          .delete("/api/articles/2/comments?sortBy=comment_id")
          .expect(405)
          .then(res => {
            console.log(res);
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
});
