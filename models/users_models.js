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
          status: 404,
          msg: "Not Found - Invalid username"
        });
      } else {
        return res;
      }
    });
};
