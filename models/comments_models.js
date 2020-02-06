const connection = require("../db/connection");

exports.insertedComments = (comment_id, inc_vote) => {
  if ((comment_id && Number.isInteger(inc_vote)) || inc_vote === undefined) {
    console.log("HERE");
    return connection("comments")
      .select("*")
      .where("comments.comment_id", "=", comment_id)
      .increment("votes", inc_vote || 0)
      .returning("*")
      .then(response => {
        console.log(response, "response");
        if (!response.length) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return response;
      });
  }
};
