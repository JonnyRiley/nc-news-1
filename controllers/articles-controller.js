const {
  selectArticles,
  selectVotes,
  selectComments,
  sortedArticles
} = require("../models/articles-models");
exports.sendArticles = (request, response, next) => {
  console.log(request.body, "im in the controller");

  selectArticles(request.params.article_id)
    .then(articles => {
      response.status(200).send({ articles });
    })
    .catch(err => {
      // console.log(err);
      next(err);
    });
};

exports.sendVotes = (request, response, next) => {
  console.log(request.body.inc_vote, "im in the votes controller");
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
  console.log("im in the controller");
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
  console.log(request.query, "im in the controllers");
  sortedArticles(request.query)
    .then(sortBy => {
      response.status(200).send({ sortBy });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
