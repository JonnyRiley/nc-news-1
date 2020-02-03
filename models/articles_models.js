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

exports.selectArticlesById = article_id => {
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
        console.log(res);
        if (res.length === 0) {
          return Promise.reject({ status: 404, msg: "Not-Found" });
        } else {
          return res;
        }
      });
  });
};
