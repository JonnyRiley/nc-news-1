const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use("/api", apiRouter);

app.use(function(err, req, res, next) {
  console.log(err, "In app error");
  if (err.code) {
    const psql = {
      "42703": "Invalid column provided to sort by"
    };
    console.log(err.code, "In app error");
    res.status(400).send({ msg: psql[err.code] });
  } else if (err.status) {
    console.log(err.status, "In app error else");
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
