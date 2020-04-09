const {
  selectUserById,
  getAllUsers,
  insertUser,
} = require("../models/articles_models");

exports.getUsers = (request, response, next) => {
  getAllUsers()
    .then((allUsers) => {
      response.status(200).send({ allUsers });
    })
    .catch((err) => next(err));
};

exports.getUserById = (request, response, next) => {
  console.log(request.params);
  selectUserById(request.params.user_id)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (request, response, next) => {
  const { username, email } = request.body;

  insertUser(username, email)
    .then((user) => {
      console.log(user, "USERR");
      response.status(201).send({ user });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
