const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection("topics")
    .returning("*")
    .then(function(mystery) {
      return mystery;
    })
    .then(response => {
      if (!response.length) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      return response;
    });
};
