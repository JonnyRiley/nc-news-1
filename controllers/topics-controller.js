const { selectTopics } = require("../models/topics-models");
exports.sendTopics = (request, response, next) => {
  console.log(request.query, "im in the controller");
  selectTopics()
    .then(topics => {
      console.log({ topics });
      response.status(200).send({ topics });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
