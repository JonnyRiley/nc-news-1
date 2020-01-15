const { selectUsers } = require("../models/users-models");
exports.sendUsers = (request, response, next) => {
  console.log("im in the controller");
  selectUsers(request.params.username).then(users => {
    response.status(200).send({ users });
  });

  // .then(topics => {
  //   console.log({ topics });
  //   response.status(200).send({ topics });
  // })
  // .catch(err => {
  //   console.log(err);
  //   next(err);
  // });
};
