const { selectUsers } = require("../models/users-models");
exports.sendUsers = (request, response, next) => {
  selectUsers(request.params.username)
    .then(users => {
      response.status(200).send({ users });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
