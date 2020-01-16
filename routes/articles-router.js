const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendVotes,
  postComments
} = require("../controllers/articles-controller");

console.log("articlesRouter");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(sendVotes);

articlesRouter.route("/:article_id/comments").post(postComments);

module.exports = articlesRouter;
