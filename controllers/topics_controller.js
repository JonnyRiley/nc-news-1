const { selectTopics } = require("../models/topics_models");

exports.getTopics = (request, response, next) => {
  console.log("In topics_controllers");
  selectTopics()
    .then(topics => {
      response.status(200).send({ topics });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
