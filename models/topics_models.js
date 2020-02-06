const connection = require("../db/connection");

exports.selectTopics = () => {
  console.log("in topics_models");

  return connection("topics")
    .returning("*")
    .then(allTopics => {
      return allTopics;
    })
    .then(topicRows => {
      console.log(topicRows, "IF");
      if (topicRows.length === 0) {
        return Promise.reject({ status: 404, msg: "Bad Request" });
      } else return topicRows;
    });

  //   console.log(response);
  //   if (!response.length) {
  //     return Promise.reject({ status: 400, msg: "Bad Request " });
  //   }
  //   return response;
  // });
};
