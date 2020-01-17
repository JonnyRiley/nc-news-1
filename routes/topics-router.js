const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-controller");
const { send405Error } = require("../errors/index");

console.log("topicsRouter");
topicsRouter.route("/").get(sendTopics);

topicsRouter
  .route("/")
  .get(sendTopics)
  .all(send405Error);
module.exports = topicsRouter;
