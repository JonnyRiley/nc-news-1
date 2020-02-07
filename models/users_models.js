const connection = require("../db/connection");

exports.selectUsers = username => {
  return connection("users")
    .select("*")
    .where("users.username", "=", username)
    .then(allUsers => {
      return allUsers;
    })
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request - Invalid column provided"
        });
      } else {
        return res;
      }
    });
};
