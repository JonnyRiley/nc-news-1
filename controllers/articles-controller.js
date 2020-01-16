const {
  selectArticles,
  selectVotes,
  selectComments
} = require("../models/articles-models");
exports.sendArticles = (request, response, next) => {
  //console.log(request.params.article_id, "im in the controller");

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
  console.log("im in the votes controller");
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
      response.status(200).send({ comments });
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};
