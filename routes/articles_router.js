const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesById,
  incrementVotes,
  postComments,
  getCommentsByArticleId
} = require("../controllers/articles_controller");
const { send405Error } = require("../errors/index");
articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .patch(incrementVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComments)
  .get(getCommentsByArticleId)
  .all(send405Error);

module.exports = articlesRouter;
