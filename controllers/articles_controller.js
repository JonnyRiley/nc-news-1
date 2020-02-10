const {
  selectArticlesById,
  patchIncVotes,
  insertComment,
  selectCommentsByArticleId,
  getAllArticles
} = require("../models/articles_models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, author, topic } = request.query;
  getAllArticles(sort_by, order, author, topic)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.getArticlesById = (request, response, next) => {
  selectArticlesById(request.params.article_id)
    .then(([article]) => {
      console.log(article, "CONTROLLER");
      response.status(200).send({ article });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.incrementVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;
  patchIncVotes(article_id, inc_votes)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.postComments = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;
  insertComment(article_id, username, body)
    .then(([comment]) => {
      console.log(comment, "RES.SEND");
      response.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { sort_by, order } = request.query;
  selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
