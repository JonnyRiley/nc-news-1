const connection = require("../db/connection");

exports.selectUsers = username => {
  console.log(username, "im in the models");
  return connection("users")
    .select("*")
    .where("users.username", "=", username)
    .then(allUsers => {
      return allUsers;
    })
    .then(response => {
      if (response.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request - Invalid column provided"
        });
      } else {
        return response;
      }
    });
};
