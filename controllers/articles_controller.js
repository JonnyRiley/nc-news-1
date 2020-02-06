const {
  selectArticles,
  selectArticlesById,
  patchIncVotes,
  insertComment,
  selectCommentsByArticleId,
  getAllArticles,
  checkAuthorExists
} = require("../models/articles_models");

exports.getArticles = (request, response, next) => {
  const { sort_by, order, author, topic } = request.query;
  // console.log("in controller");
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
  console.log("in controller");
  selectArticlesById(request.params.article_id)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.incrementVotes = (request, response, next) => {
  console.log("in controller");
  patchIncVotes(request.params.article_id, request.body.inc_vote)
    .then(article => {
      response.status(201).send({ article });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.postComments = (request, response, next) => {
  console.log("im in controller");
  insertComment(
    request.params.article_id,
    request.body.username,
    request.body.body
  )
    .then(comment => {
      response.status(201).send({ comment });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.getCommentsByArticleId = (request, response, next) => {
  console.log(request.query, "im in controller");
  const { article_id } = request.params;
  const { sort_by, order } = request.query;
  //console.log(article_id, query, "im in controller");
  selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      response.status(200).send({ comments });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
