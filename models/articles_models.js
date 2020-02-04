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

exports.selectCommentsByArticleId = (article_id, query) => {
  const { checkArticleIdExists } = module.exports;
  console.log(article_id, query, "models");
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
  if (
    orderExists.includes(query.orderBy) &&
    collumnExists.includes(query.sortBy)
  ) {
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .orderBy(query.sortBy || "created_at", query.orderBy || "desc")
      .then(res => {
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
