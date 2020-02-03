const apiRouter = require("express").Router();
const topicsRouter = require("./topics_router");
console.log(" Im in the apiRouter");
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
