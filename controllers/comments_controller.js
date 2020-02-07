const {
  insertedComments,
  deletedComment
} = require("../models/comments_models");

exports.patchComments = (request, response, next) => {
  console.log(request.body, request.params, "im in controller");
  const { comment_id } = request.params;
  const { inc_votes } = request.body;
  insertedComments(comment_id, inc_votes)
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.deleteCommentByCommentId = (request, response, next) => {
  console.log("IM in controller");
  const { comment_id } = request.params;
  deletedComment(comment_id)
    .then(comment => {
      response.status(204).send();
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
