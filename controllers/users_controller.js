const { selectUsers } = require("../models/users_models");

exports.getUsers = (request, response, next) => {
  const { username } = request.params;
  selectUsers(username)
    .then(([user]) => {
      response.status(200).send({ user });
    })
    .catch(err => {
      next(err);
    });
};
