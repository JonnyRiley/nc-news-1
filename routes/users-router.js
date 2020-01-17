const usersRouter = require("express").Router();
const { sendUsers } = require("../controllers/users-controller");
const { send405Error } = require("../errors/index");

usersRouter.route("/:username").get(sendUsers);
usersRouter
  .route("/")
  .get(sendUsers)
  .all(send405Error);

module.exports = usersRouter;
