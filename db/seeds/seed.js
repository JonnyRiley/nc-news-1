const { articleData } = require("../data");

const { formatDates, makeRefObj } = require("../utils/utils");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      // const articleInsertions = formatDates(articleData);

      return knex("users").insert(articleData).returning("*");
    });
  // .then((articleRows) => {
  //   const articleRef = makeRefObj(articleRows, "username", "user_id");

  //   const formattedComments = formatComments(commentData, articleRef);

  //   return knex("comments").insert(formattedComments);
  // });
};
