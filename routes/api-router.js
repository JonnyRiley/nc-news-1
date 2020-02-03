const apiRouter = require("express").Router();
const topicsRouter = require("./topicsRouter");
console.log(" Im in the apiRouter");
apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
