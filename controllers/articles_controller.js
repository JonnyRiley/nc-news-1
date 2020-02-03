const {
  selectArticles,
  selectArticlesById
} = require("../models/articles_models");

exports.getArticles = (request, response, next) => {
  console.log("in controller");
  selectArticles()
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
