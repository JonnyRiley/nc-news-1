const topicsRouter = require("express").Router();

const { getTopics } = require("../controllers/topics_controller");
console.log(" Im in the topicsRouter");
topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
