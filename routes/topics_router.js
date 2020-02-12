const topicsRouter = require("express").Router();
const { send405Error } = require("../errors/index");
const { getTopics } = require("../controllers/topics_controller");

topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicsRouter;
