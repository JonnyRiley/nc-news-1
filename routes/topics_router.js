const topicsRouter = require("express").Router();
const { send405Error } = require("../errors/index");
const { getTopics } = require("../controllers/topics_controller");
console.log(" Im in the topicsRouter");
topicsRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicsRouter;
