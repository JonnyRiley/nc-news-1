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
    describe("/articles", () => {
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
    describe("/articles/:article_id", () => {
      it("GET - Responds with an object with all the properties referenced from a specific article_id", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(res => {
            const { articles } = res.body;
            console.log(articles, "RESSS");
            expect(articles[0].article_id).to.equal(1);
            expect(res.body).to.have.key("articles");
          });
      });
      it("GET - Responds with an object with all the properties referenced for an article_id 2 ", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(res => {
            console.log(res.body.articles[0], "SPECRESS");
            expect(res.body.articles[0].votes).to.equal(0);
          });
      });
      it("GET - Responds with an object with all the properties referenced for an article with the article_id of 1 which has the comment_count of 13", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(res => {
            console.log(res.body, "SPECRESS");
            expect(res.body.articles[0].comment_count).to.eql("13");
          });
      });
      it("Error 400 - returns status 400 for invalid column provided", () => {
        return request(app)
          .get("/api/articles/dog")
          .expect(400)
          .then(res => {
            expect(res.status).to.equal(400);
          });
      });
      it("Error 404 - Responds with 404 when URL is NOT FOUND", () => {
        return request(app)
          .get("/api/articles/99999")
          .expect(404)
          .then(res => {
            expect(res.body.msg).to.equal("Not-Found");
          });
      });
      it("PATCH - Returns a new object with the key of vote which is added to the value of votes that is incremented for a specific article_id", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(201)
          .send({ inc_vote: 12 })
          .then(res => {
            const incrementedVote = 112;
            console.log(res.body, "SPECFILE");
            expect(res.body.article[0].votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of votes which has a plus value of votes that need to be incremented for article_id 2", () => {
        return request(app)
          .patch("/api/articles/2")
          .expect(201)
          .send({ inc_vote: 12 })
          .then(res => {
            const incrementedVote = 12;
            //console.log(res.body, "SPECFILE");
            expect(res.body.article[0].votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of votes which has a minus value of votes that need to decrement for article_id 2", () => {
        return request(app)
          .patch("/api/articles/2")
          .expect(201)
          .send({ inc_vote: -12 })
          .then(res => {
            const incrementedVote = -12;
            //console.log(res.body, "SPECFILE");
            expect(res.body.article[0].votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of inc_vote that increments the vote count and has the key of article", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(201)
          .send({ inc_vote: 120 })
          .then(res => {
            expect(res.body).to.contain.key("article");
          });
      });
      it("PATCH - returns an object according to the article_id when no body is sent", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(201)
          .then(res => {
            console.log(res.body);
            expect(res.body.article[0].article_id).to.equal(1);
          });
      });
      it("Error 400 - returns status 400 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({ inc_vote: 3 })
          .then(res => {
            expect(res.body.msg).to.equal("Bad Request");
          });
      });
      it("Error 400 - returns status 400 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({ inc_vote: 3 })
          .then(res => {
            expect(res.body).to.be.an("object");
          });
      });
      it("Error 500 - returns status 500 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({})
          .then(res => {
            expect(res.body).to.eql({ msg: "Bad Request" });
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .put("/api/articles/2")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api/articles/2")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/articles,:article_id/comments", () => {
      it("POST - When given an object with the keys of username and body it will input this into the articles table", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .expect(201)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(res => {
            console.log(res.body);
            expect(res.body.comment[0].comment_id).to.equal(19);
            expect(res.body.comment[0].comment_id).to.be.a("number");
            expect(res.body.comment[0].body).to.be.a("string");
          });
      });
      it("Error 404 - When given an object with the keys of username and body but will error and send 404 Bad Request as the article_id does not exist", () => {
        return request(app)
          .post("/api/articles/1000/comments")
          .expect(404)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(res => {
            console.log(res.body);
            expect(res.body.msg).to.equal("Not Found");
          });
      });
      it("Error 400 - When given an object without the keys of username and body it will error and send 400 Bad Request", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .expect(400)
          .send({
            userne: "butter_bridge",
            boy: "I find this existence challenging"
          })
          .then(res => {
            console.log(res.body);
            expect(res.body.msg).to.equal("Bad Request");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api/articles/2/comments")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/articles/2/comments")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("GET - responds with a sort_by in an array with the article_id 1", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(res => {
            console.log(res.body, "specFile");
            expect(res.body).to.be.an("object");
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a sort_by in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(res => {
            console.log(res.body, "specFile");
            expect(res.body).to.be.an("object");
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a sort_by criteria of comment_id and order critreria of descending in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=comment_id&&order=desc")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.comments).to.be.sortedBy("comment_id", {
              descending: true
            });
            expect(res.body.comments).to.be.an("array");
          });
      });
      it("GET - responds with a sort_by criteria of author and order criteria of ascending in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=author&&order=asc")
          .expect(200)
          .then(res => {
            console.log(res.body.comments);
            expect(res.body.comments).to.be.sortedBy("author", {
              ascending: true
            });
          });
      });
      it("GET - responds with a sorted by object from the created_at key in the array in default order of descending", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=created_at")
          .expect(200)
          .then(res => {
            console.log(res.body.comments);
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a ordered array when given the ascending order in an array", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=votes")
          .expect(200)
          .then(res => {
            console.log(res.body.comments);
            expect(res.body.comments).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("GET - responds with a ordered array when given the ascending order in an array", () => {
        return request(app)
          .get("/api/articles/2/comments?order=asc")
          .expect(200)
          .then(res => {
            console.log(res.body.comments);
            expect(res.body.comments).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("Error 404 - responds with a Bad Request when given an article_id that doesnt exist", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(404)
          .then(res => {
            console.log(res.body.msg, "MESSAGE");
            expect(res.body.msg).to.equal("Value for column does not exist");
          });
      });
      it("GET - Returns a defaulted order when given an invalid order criteria", () => {
        return request(app)
          .get("/api/articles/1/comments?order=notanOrder")
          .expect(400)
          .then(res => {
            console.log(res.body);
            expect(res.body.msg).to.equal("Bad Request");
          });
      });
      it("GET - Returns a defaulted sorted by when given an invalid sort_by criteria", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=notAsort_by")
          .expect(400)
          .then(res => {
            console.log(res.body);
            expect(res.body.msg).to.equal("Bad Request");
          });
      });
      it("Error 405 -Status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api/articles/2/comments")

            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api/articles/2/comments?sort_by=comment_id")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/articles/2/comments?sort_by=comment_id")
            .expect(405)
            .then(res => {
              expect(res.body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/articles", () => {
      it("GET - Returns an array of all articles objects with all the key author, title, article_id, topic, created_at, votes, comment_count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body).to.have.key("articles");
            expect(res.body.articles[0]).to.have.key(
              "author",
              "title",
              "article_id",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
          });
      });
      it("GET - Returns an array of all articles that has been sorted by topic", () => {
        request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.articles).to.be.sortedBy("topic", {
              descending: true
            });
          });
      });
      it("GET - Returns an array of all articles that has been sorted by author", () => {
        request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(res => {
            console.log(res.body.articles, "specfile");
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: false
            });
          });
      });
      it("GET - Returns an array of all articles that has been organised in ascending order", () => {
        request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name butter_bridge", () => {
        request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(res => {
            console.log(res.body);
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: true
            });
            expect(res.body.articles[0].author).to.eql("butter_bridge");
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name butter_bridge", () => {
        request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(res => {
            console.log(res.body.articles[0].topic);
            expect(res.body.articles).to.be.sortedBy("topic", {
              descending: true
            });
            expect(res.body.articles[0].topic).to.eql("mitch");
          });
      });
      it.only("GET - Returns an array of all articles that has been queried by the author name lurker", () => {
        request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(res => {
            console.log(res.body, "HERE");
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: true
            });
            expect(res.body.articles).to.eql("lurker");
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name paper", () => {
        request(app)
          .get("/api/articles?author=paper")
          .expect(200)
          .then(res => {
            //console.log(res.body);
            expect(res.body.articles).to.be.sortedBy("author", {
              descending: true
            });
            expect(res.body.articles[0].author).to.eql("paper");
          });
      });
      // it.only("GET - Returns an array of all articles that has been queried by the topic name not-a-topic ", () => {
      //   request(app)
      //     .get("/api/articles?topic=not-a-topic")
      //     .expect(404)
      //     .then(res => {
      //       //console.log(res.body);
      //       expect(res.body.articles).to.be.sortedBy("topic", {
      //         descending: true
      //       });
      //     });
      // });
    });
  });
});
