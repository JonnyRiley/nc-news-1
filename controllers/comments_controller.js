const { insertedComments } = require("../models/comments_models");

exports.patchComments = (request, response, next) => {
  console.log(request.body, request.params, "im in controller");
  const { comment_id } = request.params;
  const { inc_vote } = request.body;
  insertedComments(comment_id, inc_vote)
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
