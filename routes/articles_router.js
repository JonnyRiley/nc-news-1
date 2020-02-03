const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticlesById
} = require("../controllers/articles_controller");
const { send405Error } = require("../errors/index");
articlesRouter
  .route("/")
  .get(getArticles)
  .all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(getArticlesById)
  .all(send405Error);

module.exports = articlesRouter;
