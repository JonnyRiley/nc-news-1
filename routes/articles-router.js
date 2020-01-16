const articlesRouter = require("express").Router();
const {
  sendArticles,
  sendVotes
} = require("../controllers/articles-controller");

console.log("articlesRouter");

articlesRouter
  .route("/:article_id")
  .get(sendArticles)
  .patch(sendVotes);

module.exports = articlesRouter;
