const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendVotes,
  postComments,
  sortArticles
} = require("../controllers/articles-controller");
const { send405Error } = require("../errors/index");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(sendVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComments)
  .get(sortArticles)
  .all(send405Error);

articlesRouter.route("/").get(sortArticles);

module.exports = articlesRouter;
