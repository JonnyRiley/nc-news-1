const { selectUsers } = require("../models/users_models");

exports.getUsers = (request, response, next) => {
  console.log("im in the controller");
  selectUsers(request.params.username).then(users => {
    response.status(200).send({ users });
  });
};
