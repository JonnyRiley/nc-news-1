const { selectArticles } = require("../models/articles_models");

exports.getArticles = (request, response, next) => {
  console.log("in controller");
  selectArticles().then(articles => {
    response.status(200).send({ articles });
  });
};
