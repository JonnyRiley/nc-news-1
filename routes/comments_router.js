const commentsRouter = require("express").Router();
const {
  patchComments,
  deleteCommentByCommentId
} = require("../controllers/comments_controller");
const { send405Error } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(patchComments)
  .delete(deleteCommentByCommentId)
  .all(send405Error);

module.exports = commentsRouter;
