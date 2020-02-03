const connection = require("../db/connection");

exports.selectTopics = () => {
  console.log("in topics_models");
  return connection("topics")
    .returning("*")
    .then(allTopics => {
      return allTopics;
    })
    .then(response => {
      console.log(response);
      if (!response.length) {
        return Promise.reject({ status: 400, msg: "Bad Request " });
      }
      return response;
    });
};
