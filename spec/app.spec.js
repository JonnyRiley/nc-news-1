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
          .then(({ body }) => {
            expect(body).to.have.key("topics");
          });
      });
      it("Error 404 - Responds with 404 when URL is NOT FOUND", () => {
        return request(app)
          .get("/api/tc")
          .expect(404)
          .then(res => {
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
            const { user } = res.body;
            expect(user.username).to.equal("rogersop");
          });
      });
      it("GET - Responds with an object with the properties username, avatar_url, name", () => {
        return request(app)
          .get("/api/users/rogersop")
          .expect(200)
          .then(res => {
            const { user } = res.body;
            expect(user).to.contain.keys("username");
            expect(res.body).to.contain.keys("user");
          });
      });
      it("Error 404 - Returns status 404 for invalid username column", () => {
        return request(app)
          .get("/api/users/53billyGoat")
          .expect(404)
          .then(res => {
            const { body } = res;
            expect(body.msg).to.equal("Not Found - Invalid username");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/users/rogersop")
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
            .put("/api/users/rogersop")
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
            .delete("/api/users/rogersop")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/articles", () => {
      it("GET - Responds with a staus 200 for getting all articles ", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(res => {
            const { body } = res;
            expect(body).to.have.key("articles");
          });
      });
      it("Error 404 - Responds with an object with all the properties referenced from a specific article_id", () => {
        return request(app)
          .get("/api/articl")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Route pathway NOT FOUND");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/articles")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
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
            console.log(res.body, "body");
            const { article } = res.body;
            expect(article.article_id).to.equal(1);
            expect(res.body).to.have.key("article");
          });
      });
      it("GET - Responds with an object with all the votes property that has been referenced from a specific article_id", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            const { article } = body;
            expect(article.votes).to.equal(0);
            expect(body).to.have.key("article");
            expect(article.comment_count).to.eql("0");
          });
      });
      it("GET - Responds with an object with all the properties referenced for an article_id 2 ", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.votes).to.equal(0);
          });
      });
      it("GET - Responds with an object with all the properties referenced for an article with the article_id of 1 which has the comment_count of 13", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.comment_count).to.eql("13");
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
          .then(({ body }) => {
            expect(body.msg).to.equal("Not-Found");
          });
      });
      it("PATCH - Returns a new object with the key of vote which is added to the value of votes that is incremented for a specific article_id", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 12 })
          .then(({ body }) => {
            const incrementedVote = 112;
            expect(body.article.votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of votes which has a plus value of votes that need to be incremented for article_id 2", () => {
        return request(app)
          .patch("/api/articles/2")
          .expect(200)
          .send({ inc_votes: 12 })
          .then(({ body }) => {
            const incrementedVote = 12;
            expect(body.article.votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of votes which has a minus value of votes that need to decrement for article_id 2", () => {
        return request(app)
          .patch("/api/articles/2")
          .expect(200)
          .send({ inc_votes: -12 })
          .then(({ body }) => {
            const incrementedVote = -12;
            expect(body.article.votes).to.eql(incrementedVote);
          });
      });
      it("PATCH - returns a new object with the key of inc_vote that increments the vote count and has the key of article", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .send({ inc_votes: 120 })
          .then(({ body }) => {
            expect(body).to.contain.key("article");
          });
      });
      it("PATCH - returns an object according to the article_id when no body is sent", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(200)
          .then(({ body }) => {
            expect(body.article.article_id).to.equal(1);
          });
      });
      it("Error 400 - returns status 400 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({ inc_votes: 3 })
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("Error 400 - returns status 400 for a Bad Request value on the inc_votes key", () => {
        return request(app)
          .patch("/api/articles/1")
          .expect(400)
          .send({ inc_votes: "fdd" })
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("Error 400 - returns status 400 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({ inc_votes: 3 })
          .then(({ body }) => {
            expect(body).to.be.an("object");
          });
      });
      it("Error 500 - returns status 500 for no inc_votes on the body", () => {
        return request(app)
          .patch("/api/articles/33")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body).to.eql({ msg: "Bad Request" });
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .put("/api/articles/2")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
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
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/articles/:article_id/comments", () => {
      it("POST - When given an object with the keys of username and body it will input this into the articles table", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .expect(201)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(({ body }) => {
            console.log(body);
            expect(body.comment).to.contain.keys(
              "comment_id",
              "author",
              "body",
              "votes",
              "created_at"
            );
            expect(body.comment.comment_id).to.equal(19);
            expect(body.comment.comment_id).to.be.a("number");
            expect(body.comment.body).to.be.a("string");
          });
      });
      it("POST - Returns an object that contains the keys of comment_id, author,body , votes, created_at", () => {
        return request(app)
          .post("/api/articles/2/comments")
          .expect(201)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(({ body }) => {
            console.log(body);
            expect(body.comment).to.contain.keys(
              "comment_id",
              "author",
              "body",
              "votes",
              "created_at"
            );
            expect(body).to.have.key("comment");
            expect(body.comment.votes).to.equal(0);
          });
      });
      it("Error 400 - When given an object with the keys of username and body but will error and send 400 Bad Request as the article_id does not exist", () => {
        return request(app)
          .post("/api/articles/1000/comments")
          .expect(400)
          .send({
            username: "butter_bridge",
            body: "I find this existence challenging"
          })
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api/articles/2/comments")
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
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
            .then(({ body }) => {
              expect(body.msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
      it("GET - responds with a sort_by in an array with the article_id 1", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body).to.be.an("object");
            expect(body.comments[0].comment_id).to.equal(2);
            expect(body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a sort_by in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body).to.be.an("object");
            expect(body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a sort_by criteria of comment_id and order critreria of descending in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=comment_id&&order=desc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("comment_id", {
              descending: true
            });
            expect(body.comments).to.be.an("array");
          });
      });
      it("GET - responds with a sort_by criteria of author and order criteria of ascending in an array with the article_id 2", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("author", {
              ascending: true
            });
          });
      });
      it("GET - responds with a sorted by object from the created_at key in the array in default order of descending", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=created_at")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET - responds with a ordered array when given the ascending order in an array", () => {
        return request(app)
          .get("/api/articles/2/comments?sort_by=votes")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("votes", {
              descending: true
            });
          });
      });
      it("GET - responds with a ordered array when given the ascending order in an array", () => {
        return request(app)
          .get("/api/articles/2/comments?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("Error 400 - responds with a Bad Request when given an article_id that doesnt exist", () => {
        return request(app)
          .get("/api/articles/1000/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET - Returns a defaulted order when given an invalid order criteria", () => {
        return request(app)
          .get("/api/articles/1/comments?order=notanOrder")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("GET - Returns a defaulted sorted by when given an invalid sort_by criteria", () => {
        return request(app)
          .get("/api/articles/1/comments?sort_by=notAsort_by")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
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
            .patch("/api/articles/2/comments?sort_by=comment_id")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
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
          .then(({ body }) => {
            expect(body).to.have.key("articles");
            expect(body.articles[0]).to.have.key(
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
        return request(app)
          .get("/api/articles?sort_by=topic")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("topic", {
              descending: true
            });
          });
      });
      it("GET - Returns an array of all articles that has been sorted by author", () => {
        return request(app)
          .get("/api/articles?sort_by=author&&order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("author", {
              descending: false
            });
          });
      });
      it("GET - Returns an array of all articles that has been organised in ascending order", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("created_at", {
              descending: false
            });
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name butter_bridge", () => {
        return request(app)
          .get("/api/articles?author=butter_bridge")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("author", {
              descending: true
            });
            expect(body.articles[0].author).to.eql("butter_bridge");
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name butter_bridge", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy("topic", {
              descending: true
            });
            expect(body.articles[0].topic).to.eql("mitch");
          });
      });
      it("GET - Returns an array of all articles that has been queried by the author name lurker", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.eql([]);
          });
      });
      it("GET - Returns an array of all articles that has been queried by the topic name paper", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).to.be.sortedBy({
              descending: true
            });
            expect(body.articles).to.eql([]);
          });
      });
      it("ERROR 404 - Returns a 404 when given the topic name not-a-topic ", () => {
        return request(app)
          .get("/api/articles?topic=not-a-topic")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("ERROR 404 - Returns a 404 when given the author name not-an-author ", () => {
        return request(app)
          .get("/api/articles?author=not-an-author")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("ERROR 400 - Returns a 400 when given a sort_by criteria that is not-a-collumn ", () => {
        return request(app)
          .get("/api/articles?sort_by=not-a-column")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("ERROR 400 - Returns a 400 when given a order criteria that is not-a-collumn ", () => {
        return request(app)
          .get("/api/articles?order=not-asc-or-desc")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .patch("/api/articles")
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
            .put("/api/articles")
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
            .delete("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/comments/:comment_id", () => {
      it("PATCH - Returns an array with the value of inc_votes that have been incremented into the votes key in comments", () => {
        return request(app)
          .patch("/api/comments/2")
          .expect(200)
          .send({ inc_votes: 2 })
          .then(({ body }) => {
            const incrementedVotes = 16;
            expect(body.comment.comment_id).to.equal(2);
            expect(body.comment.votes).to.equal(incrementedVotes);
            expect(body).to.contain.key("comment");
          });
      });
      it("PATCH - Returns an array with the value of inc_votes that have been decremented into the votes key in comments", () => {
        return request(app)
          .patch("/api/comments/2")
          .expect(200)
          .send({ inc_votes: -2 })
          .then(({ body }) => {
            console.log(body);
            const incrementedVotes = 12;
            expect(body.comment.comment_id).to.equal(2);
            expect(body.comment.votes).to.equal(incrementedVotes);
            expect(body).to.contain.key("comment");
          });
      });
      it("PATCH - Returns a cooment when given no body to patch with a valid comment_id", () => {
        return request(app)
          .patch("/api/comments/1")
          .expect(200)
          .send({})
          .then(({ body }) => {
            expect(body).to.contain.key("comment");
          });
      });
      it("ERROR 400 - Returns a 400 when given an invalid inc_votes values in the body", () => {
        return request(app)
          .patch("/api/comments/2")
          .expect(400)
          .send({ inc_votes: "mfji" })
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("ERROR 400 - Returns a 400 when given an invalid inc_votes values in the body", () => {
        return request(app)
          .patch("/api/comments/875")
          .expect(404)
          .send({ inc_votes: 3 })
          .then(({ body }) => {
            expect(body.msg).to.equal("comment_id Not Found");
          });
      });
      it("ERROR 400 - Returns a 400 when given an invalid comment_id", () => {
        return request(app)
          .patch("/api/comments/not-valid-id")
          .expect(400)
          .send({ inc_votes: "mfji" })
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("ERROR 400 - Returns a 400 when given no body to patch", () => {
        return request(app)
          .patch("/api/comments/not-valid-id")
          .expect(400)
          .send({})
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("DELETE - Returns an array without the deleted comment by its comment_id", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
      it("ERROR 400 - Returns a 400 when given an invalid comment_id to delete", () => {
        return request(app)
          .delete("/api/comments/not-valid-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).to.equal("Bad Request");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["get"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .get("/api/comments/1")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/api", () => {
      it("GET - Returns all api endpoints in a JSON object", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            console.log(body);
            expect(body).to.be.an("object");
          });
      });
      it("Error 405 - Status:405", () => {
        const invalidMethods = ["delete"];
        const methodPromises = invalidMethods.map(method => {
          return request(app)
            .delete("/api")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
});
