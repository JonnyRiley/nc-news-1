const connection = require("../db/connection");

exports.selectArticles = article_id => {
  //console.log(article_id, "im in the models");
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
        return Promise.reject(
          // {
          //   status: 404,
          //   msg: "Bad Request - Invalid column provided"
          // }
          { status: 404, msg: "Not-Found" }
        );
      } else {
        return res;
      }
    });
};

exports.selectVotes = (article_id, inc_votes) => {
  console.log(inc_votes, "im in the votes models");
  //  return db('articles').select('*).where('article_id', article_id).then(articleRows =>
  // if (articleRows.length)
  return (
    connection("articles")
      .select("*")
      // .from("articles")
      .where("articles.article_id", "=", article_id)
      .increment("votes", inc_votes)
      .returning("*")
      .then(res => {
        console.log(res, "MO");

        res.votes = res.votes += inc_votes;
        console.log(res, "Models");
        return res;
      })
  );
}; //else // not found -> custom -> promise.reject

exports.selectComments = (article_id, username, body) => {
  console.log("im in the models");

  return connection("articles")
    .insert({
      article_id: article_id,
      author: username,
      body: body
    })
    .returning("*")
    .then(res => {
      console.log(res, "models");
      return res;
    });
}; //else // not found -> custom -> promise.reject
