const connection = require("../db/connection");

exports.selectTopics = () => {
  return connection("topics")
    .returning("*")
    .then(allTopics => {
      return allTopics;
    })
    .then(topicRows => {
      if (topicRows.length === 0) {
        return Promise.reject({ status: 404, msg: "Bad Request" });
      } else return topicRows;
    });
};
