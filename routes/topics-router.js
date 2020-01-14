const topicsRouter = require("express").Router();
const { sendTopics } = require("../controllers/topics-controller");

console.log("topicsRouter");

topicsRouter.route("/").get(sendTopics);

module.exports = topicsRouter;
