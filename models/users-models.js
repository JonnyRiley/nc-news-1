const connection = require("../db/connection");

exports.selectUsers = username => {
  console.log(username);
  return connection("users")
    .select("*")
    .where("username", "=", username)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({
          status: 400,
          msg: "Invalid column provided to username"
        });
      } else {
        return res;
      }
    });
};
