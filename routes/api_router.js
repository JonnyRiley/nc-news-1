const apiRouter = require("express").Router();
const topicsRouter = require("./topics_router");
const usersRouter = require("./users_router");
const articlesRouter = require("./articles_router");
const commentsRouter = require("./comments_router");
const allEndpoints = require("../endpoints.json");
const { send405Error } = require("../errors");
apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ allEndpoints });
  })
  .all(send405Error);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
