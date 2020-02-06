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

exports.getAllArticles = (sort_by, order, author, topic) => {
  //const { checkAuthorExists } = module.exports;
  console.log(author, "In models");
  return (
    connection("articles")
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
        // console.log(author === true);

        if (author) {
          query.where("articles.author", author);
        }
        if (topic) {
          query.where("articles.topic", topic);
        }
      })
      // CANNOT GET INTO HERE , EVERYTHING SEEMS TO BE WORKING UNTIL NOW
      .then(res => {
        console.log(res, "first RES");
        return Promise.all([res, checkAuthorExists(author)]);
      })
      .then(([res, checkAuthorExists]) => {
        console.log(checkAuthorExists, "RES HERE");
        if (checkAuthorExists) {
          return res;
        } else
          return Promise.reject({
            status: 404,
            msg: "Value for column does not exist"
          });
      })
  );
};

const checkAuthorExists = author => {
  console.log(author, "in checkAuthorExists");
  return connection("users")
    .select("*")
    .from("users")
    .where("username", author)
    .then(authorRows => {
      console.log(authorRows, "exists");
      if (authorRows) return true;
    })
    .catch(err => {
      console.log(err);
    });
};
// exports.getAllArticles = (sort_by, order, author, topic) => {
//   const { checkAuthorExists } = module.exports;
//   console.log(sort_by, order, author, topic, "In models");

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
//     .leftJoin("users", "articles.author", "users.username")
//     .groupBy("articles.author")
//     .leftJoin("comments", "articles.article_id", "comments.article_id")
//     .groupBy("articles.article_id")
//     .orderBy(sort_by || "created_at", order || "desc")
//     .modify(function(currentQuery) {
//       console.log("hello");
//       if (topic) {
//         currentQuery.where("articles.topic", "=", topic);
//       }
//       if (author) {
//         currentQuery.where("articles.author", "=", author);
//       }
//     })
//     .then(res => {
//       console.log(res, "models");
//       return Promise.all([checkAuthorExists(author), res]);
//     })
//     .then(([res, checkAuthorExists]) => {
//       console.log(res, "RES HERE");
//       if (checkAuthorExists) {
//         return res;
//       } else
//         return Promise.reject({
//           status: 404,
//           msg: "Value for column does not exist"
//         });
//     });
// };

// exports.getAllArticles = (sort_by, order, author, topic) => {
//   const { checkAuthorExists } = module.exports;
//   console.log(sort_by, order, author, topic, "In models");
//   return checkAuthorExists(author).then(authorExists => {
//     console.log(authorExists, "authorExists");
//     return (
//       connection("articles")
//         .select(
//           "articles.author",
//           "articles.title",
//           "articles.article_id",
//           "articles.topic",
//           "articles.created_at",
//           "articles.votes"
//         )
//         .count({ comment_count: "comments.comment_id" })
//         .leftJoin("users", "articles.author", "users.username")
//         .groupBy("articles.author")
//         .leftJoin("comments", "articles.article_id", "comments.article_id")
//         .groupBy("articles.article_id")
//         .orderBy(sort_by || "created_at", order || "desc")
//         .modify(function(currentQuery) {
//           console.log(authorExists, "hello");
//           if (authorExists) {
//             currentQuery.where("articles.author", "=", author);
//           }
//           if (topic) {
//             currentQuery.where("articles.topic", "=", topic);
//           }
//         })
//         // CANNOT GET INTO HERE , EVERYTHING SEEMS TO BE WORKING UNTIL NOW
//         .then(res => {
//           return Promise.all([authorExists, res]).then(result => {
//             console.log(result, "RES HERE");
//             if (result.length === 0) {
//               return result;
//             } else
//               return Promise.reject({
//                 status: 404,
//                 msg: "Value for column does not exist"
//               });
//           });
//         })
//     );
//   });
// };
