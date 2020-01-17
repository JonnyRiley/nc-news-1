const {
  selectArticles,
  selectVotes,
  selectComments,
  sortedArticles
} = require("../models/articles-models");
exports.sendArticles = (request, response, next) => {
  selectArticles(request.params.article_id)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(err => {
      next(err);
    });
};

exports.sendVotes = (request, response, next) => {
  selectVotes(request.params.article_id, request.body.inc_vote)
    .then(article => {
      response.status(200).send({ article });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.postComments = (request, response, next) => {
  selectComments(
    request.params.article_id,
    request.body.username,
    request.body.body
  )
    .then(comments => {
      response.status(201).send({ comments });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

exports.sortArticles = (request, response, next) => {
  sortedArticles(request.query)
    .then(sortBy => {
      response.status(200).send({ sortBy });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
