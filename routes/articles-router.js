const articlesRouter = require("express").Router();
const { sendArticles } = require("../controllers/articles-controller");

console.log("articlesRouter");

articlesRouter.route("/:article_id").get(sendArticles);

module.exports = articlesRouter;
