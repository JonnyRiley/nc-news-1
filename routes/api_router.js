const apiRouter = require("express").Router();
const articlesRouter = require("./articles_router");
const allEndpoints = require("../endpoints.json");
const { send405Error } = require("../errors");

apiRouter
  .route("/")
  .get((req, res, next) => {
    res.status(200).send({ allEndpoints });
  })
  .all(send405Error);

apiRouter.use("/users", articlesRouter);

module.exports = apiRouter;
