const commentsRouter = require("express").Router();
const { patchComments } = require("../controllers/comments_controller");
const { send405Error } = require("../errors/index");

commentsRouter
  .route("/:comment_id")
  .patch(patchComments)
  .all(send405Error);

module.exports = commentsRouter;
