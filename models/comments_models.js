const connection = require("../db/connection");

exports.insertedComments = (comment_id, inc_votes) => {
  if ((comment_id && Number.isInteger(inc_votes)) || inc_votes === undefined) {
    return connection("comments")
      .select("*")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_votes || 0)
      .returning("*")
      .then(res => {
        if (!res.length) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return res;
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};

exports.deletedComment = comment_id => {
  if (comment_id) {
    return connection("comments")
      .select("*")
      .where("comments.comment_id", "=", comment_id)
      .del()
      .then(res => {
        if (res === 1) return res;
        else return Promise.reject({ status: 400, msg: "Bad Request" });
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};
