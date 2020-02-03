const connection = require("../db/connection");

exports.selectArticles = () => {
  console.log("in models");
  return connection("articles")
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not-Found" });
      } else {
        return res;
      }
    });
};
