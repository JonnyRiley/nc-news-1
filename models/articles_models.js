const connection = require("../db/connection");

exports.selectArticles = () => {
  return connection("articles")
    .returning("*")
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Not-Found" });
      } else {
        return res;
      }
    });
};

exports.selectArticlesById = article_id => {
  if (!isNaN(article_id)) {
    return connection("articles")
      .select("articles.*")
      .count({ comment_count: "comments.comment_id" })
      .leftJoin("comments", "articles.article_id", "comments.article_id")
      .where("articles.article_id", "=", article_id)
      .groupBy("articles.article_id")
      .modify(function(articleQuery) {
        if (article_id)
          articleQuery.where("articles.article_id", "=", article_id);
      })
      .then(res => {
        if (res.length === 0) {
          return Promise.reject({ status: 404, msg: "Not-Found" });
        } else {
          return res;
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: "Not-Found" });
  }
};

exports.patchIncVotes = (article_id, inc_votes) => {
  if ((article_id && Number.isInteger(inc_votes)) || inc_votes === undefined) {
    return connection("articles")
      .select("*")
      .where("articles.article_id", "=", article_id)
      .increment("votes", inc_votes || 0)
      .returning("*")
      .then(res => {
        if (!res.length) {
          return Promise.reject({
            status: 400,
            msg: "Bad Request"
          });
        }
        return res[0];
      });
  } else {
    return Promise.reject({
      status: 400,
      msg: "Bad Request"
    });
  }
};

exports.checkArticleIdExists = article_id => {
  return connection("articles")
    .select("*")
    .where("articles.article_id", "=", article_id)
    .then(articleRows => {
      if (articleRows.length === 0) {
        return false;
      } else return true;
    });
};

exports.insertComment = (article_id, username, body) => {
  const { checkArticleIdExists } = module.exports;
  if (Object.keys(article_id, username, body))
    return connection("comments")
      .insert({
        article_id: article_id,
        author: username,
        body: body
      })
      .returning("*")
      .then(res => {
        return Promise.all([res, checkArticleIdExists(article_id)]);
      })
      .then(([res, checkArticleIdExists]) => {
        if (checkArticleIdExists) {
          return res;
        } else
          return Promise.reject({
            status: 404,
            msg: "Bad Request"
          });
      });
  return res;
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
  const { checkArticleIdExists } = module.exports;
  const orderExists = ["asc", "desc", undefined];
  const columnExists = [
    "comment_id",
    "votes",
    "created_at",
    "author",
    "body",
    undefined
  ];
  if (orderExists.includes(order) && columnExists.includes(sort_by)) {
    return connection
      .select("*")
      .where("article_id", article_id)
      .from("comments")
      .orderBy(sort_by || "created_at", order || "desc")
      .then(res => {
        return Promise.all([res, checkArticleIdExists(article_id)]);
      })
      .then(([res, checkArticleIdExists]) => {
        if (checkArticleIdExists) {
          return res;
        } else
          return Promise.reject({
            status: 404,
            msg: "Not Found"
          });
      });
  } else return Promise.reject({ status: 400, msg: "Bad Request" });
};

const checkAuthorExists = author => {
  if (author) {
    return connection("users")
      .select("*")
      .from("users")
      .where("username", "=", author)
      .then(authorRows => {
        if (authorRows.length === 0) {
          return Promise.reject({ status: 404, msg: "Bad Request" });
        } else return authorRows;
      });
  } else return false;
};

exports.topicExists = topic => {
  if (topic) {
    return connection("topics")
      .returning("*")
      .modify(query => {
        query.where("slug", topic);
      })
      .then(allTopics => {
        return allTopics;
      })
      .then(topicRows => {
        if (topicRows.length === 0) {
          return Promise.reject({ status: 404, msg: "Bad Request" });
        } else return topicRows;
      });
  } else return false;
};

exports.queryCheck = (sort_by, order) => {
  const orderExists = ["asc", "desc", undefined];
  const columnExists = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    undefined
  ];
  if (orderExists.includes(order) && columnExists.includes(sort_by))
    return true;
  else;
  return Promise.reject({ status: 400, msg: "Bad Request" });
};

exports.getAllArticles = (
  sort_by,
  order,
  author = undefined,
  topic = undefined
) => {
  const { topicExists, queryCheck } = module.exports;
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .count({ comment_count: "comments.comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify(query => {
      if (author) {
        query.where("articles.author", author);
      }
      if (topic) {
        query.where("articles.topic", topic);
      }
    })
    .then(res => {
      const queryChecked = queryCheck(sort_by, order);
      const authorExists = checkAuthorExists(author);
      const topicExistsNew = topicExists(topic);
      return Promise.all([queryChecked, res, authorExists, topicExistsNew]);
    })
    .then(([queryChecked, res, authorExists, topicExistsNew]) => {
      if (queryChecked === true) {
        return res;
      } else {
        return Promise.reject({
          status: 404,
          msg: "Value for column does not exist"
        });
      }
    });
};
