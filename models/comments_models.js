const connection = require("../db/connection");

exports.insertedComments = (comment_id, inc_votes) => {
  const { checkCommentIdExists } = module.exports;
  if ((comment_id && Number.isInteger(inc_votes)) || inc_votes === undefined) {
    return connection("comments")
      .select("*")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_votes || 0)
      .returning("*")
      .then(res => {
        return Promise.all([res, checkCommentIdExists(comment_id)]);
      })
      .then(([res, checkCommentIdExists]) => {
        if (checkCommentIdExists === false) {
          return Promise.reject({
            status: 404,
            msg: "comment_id Not Found"
          });
        } else if (checkCommentIdExists === true) return res;
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};

exports.checkCommentIdExists = comment_id => {
  return connection("comments")
    .select("*")
    .where("comments.comment_id", "=", comment_id)
    .then(commentRows => {
      if (commentRows.length === 0) {
        return false;
      } else return true;
    });
};

exports.deletedComment = comment_id => {
  if (comment_id) {
    return connection("comments")
      .select("*")
      .where("comments.comment_id", "=", comment_id)
      .del()
      .then(res => {
        if (res === 1) return res;
        else return Promise.reject({ status: 404, msg: "Not Found" });
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};
