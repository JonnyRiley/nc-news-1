const insertedComments = require("../models/comments_models");

exports.patchComments = (request, response, next) => {
  console.log("im in controller");
  insertedComments();
};
