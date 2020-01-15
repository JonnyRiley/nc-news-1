const connection = require("../db/connection");

exports.selectUsers = username => {
  //console.log(username1, "im in the models");
  console.log(username);
  return connection("users")
    .select("*")
    .where("username", "=", username);
};
