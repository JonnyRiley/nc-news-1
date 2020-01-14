const { selectTopics } = require("../models/topics-models");
exports.sendTopics = (request, response, next) => {
  console.log(request.query, "im in the controller");
  selectTopics();
};
