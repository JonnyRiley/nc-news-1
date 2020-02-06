const connection = require("../db/connection");
const { selectTopics } = require("../models/topics_models");

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

exports.selectArticlesById = (article_id, inc_vote) => {
  const { selectArticles } = module.exports;
  console.log("In models");
  return selectArticles().then(() => {
    // if (res[0].article_id === article_id)
    return connection("articles")
      .select("articles.*")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .where("articles.article_id", "=", article_id)
      .groupBy("articles.article_id")
      .modify(function(articleQuery) {
        if (article_id)
          articleQuery.where("articles.article_id", "=", article_id);
      })
      .then(res => {
        console.log(res, "RESS in models");
        if (res.length === 0) {
          return Promise.reject({ status: 404, msg: "Not-Found" });
        } else {
          return res;
        }
      });
  });
};

exports.patchIncVotes = (article_id, inc_votes) => {
  if ((article_id && Number.isInteger(inc_votes)) || inc_votes === undefined)
    return connection("articles")
      .select("*")
      .where("articles.article_id", "=", article_id)
      .increment("votes", inc_votes || 0)
      .returning("*")
      .then(res => {
        res.votes += inc_votes;
        return res;
      })
      .then(response => {
        console.log(response, "response");
        if (!response.length) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return response;
      });
};
exports.checkArticleIdExists = article_id => {
  return connection("articles")
    .select("*")
    .where("articles.article_id", "=", article_id)
    .then(articleRows => {
      console.log(articleRows, "exists");
      if (articleRows.length === 0) {
        return false;
      } else return true;
    });
};

exports.insertComment = (article_id, username, body) => {
  const { checkArticleIdExists } = module.exports;
  console.log(article_id, username, body, "im in models");
  if (Object.keys(article_id, username, body))
    return connection("comments")
      .insert({
        article_id: article_id,
        author: username,
        body: body
      })
      .returning("*")
      .then(res => {
        console.log(res, "RESS");
        return Promise.all([res, checkArticleIdExists(article_id)]).then(
          ([res, checkArticleIdExists]) => {
            console.log(res, "RES HERE");
            if (checkArticleIdExists) {
              return res;
            } else
              return Promise.reject({
                status: 404,
                msg: "Bad Request"
              });
          }
        );
      });
  return res;
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  const { checkArticleIdExists } = module.exports;
  console.log(article_id, sort_by, order, "models");
  // check
  const orderExists = ["asc", "desc", undefined];
  const collumnExists = [
    "comment_id",
    "votes",
    "created_at",
    "author",
    "body",
    undefined
  ];
  console.log(orderExists.includes(order) && collumnExists.includes(sort_by));
  if (orderExists.includes(order) && collumnExists.includes(sort_by)) {
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .orderBy(sort_by || "created_at", order || "desc")
      .then(res => {
        console.log("models");
        return Promise.all([res, checkArticleIdExists(article_id)]);
      })
      .then(([res, checkArticleIdExists]) => {
        console.log(res, "RES HERE");
        if (checkArticleIdExists) {
          return res;
        } else
          return Promise.reject({
            status: 404,
            msg: "Value for column does not exist"
          });
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};
const checkAuthorExists = author => {
  console.log(author, "in checkAuthorExists");
  if (author) {
    return connection("users")
      .select("*")
      .from("users")
      .where("username", "=", author)
      .then(authorRows => {
        console.log(authorRows, "exists");
        if (authorRows.length === 0) {
          return Promise.reject({ status: 404, msg: "Bad Request" });
        } else return authorRows;
      });
  } else return false;
};
const topicExists = topic => {
  if (topic) {
    return connection("topics")
      .returning("*")
      .modify(query => {
        query.where("slug", topic);
      })
      .then(allTopics => {
        return allTopics;
      })
      .then(topicRows => {
        console.log(topicRows, "ELSE");
        if (topicRows.length === 0) {
          return Promise.reject({ status: 404, msg: "Bad Request" });
        } else return topicRows;
      });
  } else return false;
};

exports.getAllArticles = (
  sort_by,
  order,
  author = undefined,
  topic = undefined
) => {
  //const { checkAuthorExists } = module.exports;
  console.log(topic, "In models");
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      console.log(author);
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(res => {
      console.log(res, "RES");
      const authorExists = checkAuthorExists(author);
      const topicExistsNew = topicExists(topic);
      return Promise.all([res, authorExists, topicExistsNew]);
    })
    .then(([res, authorExists, topicExistsNew]) => {
      console.log(authorExists, topicExistsNew, "in then");
      if (authorExists) {
        return res;
      }
      if (topicExistsNew) {
        return res;
      }
      return res;
    })
    .then(result => {
      console.log(result);
      if (result) {
        return result;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Value for column does not exist"
        });
      }
    });
};

// const topicExists = topic => {
//   if (topics)
//     return connection("topics")
//       .returning("*")
//       .modify(query => {
//         query.where("slug", topics);
//       })
//       .then(allTopics => {
//         return allTopics;
//       })
//       .then(topicRows => {
//         console.log(topicRows, "ELSE");
//         if (topicRows.length === 0) {
//           return Promise.reject({ status: 404, msg: "Bad Request" });
//         } else return topicRows;
//       });
// };
// } else if (topic) {
//   return connection("articles")
//     .select(
//       "articles.author",
//       "articles.title",
//       "articles.article_id",
//       "articles.topic",
//       "articles.created_at",
//       "articles.votes"
//     )
//     .count({ comment_count: "comments.comment_id" })
//     .leftJoin("comments", "articles.article_id", "comments.article_id")
//     .groupBy("articles.article_id")
//     .orderBy(sort_by || "created_at", order || "desc")
//     .modify(query => {
//       if (author) {
//         query.where("articles.author", author);
//       }
//       if (topic) {
//         query.where("articles.topic", topic);
//       }
//     })
//     .then(res => {
//       const topicExists = selectTopics(topic);
//       return Promise.all([topicExists, res]);
//     })
//     .then(([topicExists, res]) => {
//       console.log(topicExists, "in then");
//       if (topicExists) {
//         return res;
//       } else
//         return Promise.reject({
//           status: 404,
//           msg: "Value for column does not exist"
//         });
//     });
// }
//   } else
//     return connection("articles")
//       .select(
//         "articles.author",
//         "articles.title",
//         "articles.article_id",
//         "articles.topic",
//         "articles.created_at",
//         "articles.votes"
//       )
//       .count({ comment_count: "comments.comment_id" })
//       .leftJoin("comments", "articles.article_id", "comments.article_id")
//       .groupBy("articles.article_id")
//       .orderBy(sort_by || "created_at", order || "desc")
//       .then(res => {
//         console.log(res, "res");
//         if (res.length === 0) {
//           return Promise.reject({ status: 404, msg: "Bad Request" });
//         } else return res;
//       });
// };

// const checkAuthorExists = author => {
//   console.log(author, "in checkAuthorExists");

//   return connection("users")
//     .select("*")
//     .from("users")
//     .where("username", "=", author)
//     .then(authorRows => {
//       console.log(authorRows, "exists");
//       if (authorRows.length === 0) {
//         return Promise.reject({ status: 404, msg: "Bad Request" });
//       } else return authorRows;
//     });
// };
