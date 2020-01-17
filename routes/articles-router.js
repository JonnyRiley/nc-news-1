const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendVotes,
  postComments,
  sortArticles
} = require("../controllers/articles-controller");
const { send405Error } = require("../errors/index");

console.log("articlesRouter");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(sendVotes);

articlesRouter
  .route("/:article_id/comments")
  .post(postComments)
  .get(sortArticles);

articlesRouter
  .route("/")
  .get(sortArticles)
  .all(send405Error);
console.log(send405Error);

module.exports = articlesRouter;
