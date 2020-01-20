const connection = require("../db/connection");

exports.selectArticles = article_id => {
  if (article_id)
    return connection("articles")
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .where("articles.article_id", "=", article_id)
      .then(res => {
        return res;
      })
      .then(res => {
        if (res.length === 0) {
          return Promise.reject({ status: 404, msg: "Not-Found" });
        } else {
          return res;
        }
      });
};

exports.selectVotes = (article_id, inc_votes) => {
  if (article_id && Number.isInteger(inc_votes))
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
        if (!response.length) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return response;
      });
};

exports.selectComments = (article_id, username, body) => {
  return connection("comments")
    .insert({
      article_id: article_id,
      author: username,
      body: body
    })
    .returning("*")
    .then(res => {
      return res;
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

exports.sortedArticles = query => {
  if (query.sortBy)
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .orderBy(query.sortBy || "created_at", query.orderBy || "desc")
      .then(res => {
        if (res.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Value for column does not exist"
          });
        } else return res;
      });
};

exports.allArticles = query => {
  console.log(query, "Im in the models");
  // return (
  //   connection("articles")
  //     .select(
  //       "articles.author",
  //       "articles.title",
  //       "articles.article_id",
  //       "articles.topic",
  //       "articles.created_at",
  //       "articles.votes"
  //       // "articles.comment_count"
  //     )
  //     // .from("articles")
  //     .count({ comment_count: "comments.comment_id" })
  //     .leftJoin("comments", "articles.article_id", "comments.article_id")
  //     .groupBy("articles.article_id")
  //     .where("articles.article_id", "=", article_id)
  //     .then(res => {
  //       console.log(res);
  //       return res;
  //     })
  // );

  // .orderBy(query.sortBy || "created_at", query.order || "desc")
  // .modify(function(currentQuery) {
  //   console.log(currentQuery);
  //   if (query.topic) {
  //     currentQuery.where("articles.topic", "=", query.topic);
  //   }
  //   if (query.author) {
  //     currentQuery.where("articles.author", "=", query.author);
  //   }
  // })
  // .then(articles => {
  //   console.log(articles);
  //   return articles;
  // });
};
