const apiRouter = require("express").Router();
const topicsRouter = require("./topics_router");
const usersRouter = require("./users_router");
const articlesRouter = require("./articles_router");
console.log(" Im in the apiRouter");
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
module.exports = apiRouter;
