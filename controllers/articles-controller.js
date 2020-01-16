const { selectArticles } = require("../models/articles-models");
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
