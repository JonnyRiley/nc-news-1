const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/users_controller");

usersRouter.route("/:username").get(getUsers);

module.exports = usersRouter;
