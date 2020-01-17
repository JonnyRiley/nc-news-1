const { topicData, articleData, commentData, userData } = require("../data");

const { formatDates, formatComments, makeRefObj } = require("../utils/utils");

exports.seed = function(knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      const topicsInsertions = knex("topics")
        .insert(topicData)
        .returning("*");
      const usersInsertions = knex("users")
        .insert(userData)
        .returning("*");

      return Promise.all([topicsInsertions, usersInsertions]);
    })
    .then(([topicsInsertions, usersInsertions]) => {
      const articleInsertions = formatDates(articleData);

      return knex("articles")
        .insert(articleInsertions)
        .returning("*");
    })
    .then(articleRows => {
      const articleRef = makeRefObj(articleRows, "title", "article_id");

      const formattedComments = formatComments(commentData, articleRef);

      return knex("comments").insert(formattedComments);
    });
};
