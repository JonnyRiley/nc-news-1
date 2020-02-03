const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users_controller");
const { send405Error } = require("../errors/index");
usersRouter
  .route("/:username")
  .get(getUsers)
  .all(send405Error);

module.exports = usersRouter;
