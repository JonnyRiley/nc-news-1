const { selectTopics } = require("../models/topics-models");
exports.sendTopics = (request, response, next) => {
  selectTopics()
    .then(topics => {
      response.status(200).send({ topics });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
