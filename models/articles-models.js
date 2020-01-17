const connection = require("../db/connection");

exports.selectArticles = article_id => {
  //console.log(article_id, "im in the models");
  if (article_id)
    return connection("articles")
      .select("articles.*")
      .from("articles")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .groupBy("articles.article_id")
      .where("articles.article_id", "=", article_id)
      .then(res => {
        //console.log(res, "MO");
        return res;
      })
      .then(res => {
        console.log(res);
        if (res.length === 0) {
          return Promise.reject({ status: 404, msg: "Not-Found" });
        } else {
          return res;
        }
      });
};

exports.selectVotes = (article_id, inc_votes) => {
  console.log(inc_votes, "im in models");
  //  return db('articles').select('*).where('article_id', article_id).then(articleRows =>
  // if (articleRows.length)
  if (article_id)
    return (
      connection("articles")
        .select("*")
        // .from("articles")
        .where("articles.article_id", "=", article_id)
        .increment("votes", inc_votes)
        .returning("*")
        .then(res => {
          res[0].votes += inc_votes;
          console.log(res[0], "RESPONSEs");
          return res;
        })
        .then(response => {
          console.log(response, "RESSS");
          if (!response.length) {
            return Promise.reject({
              status: 400,
              msg: "Bad Request"
            });
          }
          return response;
        })
    );
};

//else // not found -> custom -> promise.reject

exports.selectComments = (article_id, username, body) => {
  console.log("im in the models");

  return connection("comments")
    .insert({
      article_id: article_id,
      author: username,
      body: body
    })
    .returning("*")
    .then(res => {
      console.log(res, "models");
      return res;
    })
    .then(response => {
      console.log(response, "RESSS");
      if (!response.length) {
        return Promise.reject({
          status: 400,
          msg: "Bad Request"
        });
      }
      return response;
    });
}; //else // not found -> custom -> promise.reject

exports.sortedArticles = sortBy => {
  console.log(sortBy.sortBy, "im in the models");
  if (sortBy.sortBy)
    return connection
      .select("comment_id", "votes", "created_at", "author", "body")
      .from("comments")
      .orderBy(sortBy.sortBy || "created_at", "desc")
      .then(res => {
        console.log(res, "RESSS");
        if (res.length === 0) {
          return Promise.reject({
            status: 404,
            msg: "Value for column does not exist"
          });
        } else return res;
      });
};
