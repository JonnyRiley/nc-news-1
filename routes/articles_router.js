const articlesRouter = require("express").Router();
const {
  getUsers,
  postUser,
  getUserById,
} = require("../controllers/articles_controller");

const { send405Error } = require("../errors/index");
articlesRouter.route("/").get(getUsers).post(postUser).all(send405Error);

articlesRouter.route("/:user_id").get(getUserById).all(send405Error);

module.exports = articlesRouter;
