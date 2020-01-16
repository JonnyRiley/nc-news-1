const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");

app.use(express.json());
app.use("/api", apiRouter);

app.use(function(err, req, res, next) {
  //console.log(err, "In app error");
  if (err.code) {
    const psql = {
      "42703": "Invalid column provided",
      "22P02": "Bad Request - Invalid column provided"
    };
    //console.log(err.code, "In app error");
    res.status(400).send({ msg: psql[err.code] });
  } else if (err.status) {
    // console.log(err, "In app error else");
    res.status(err.status).send({ msg: err.msg });
  }
});

module.exports = app;
