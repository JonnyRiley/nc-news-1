const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router");
const {
  psqlErrors,
  customErrors,
  serverErrors,
  send405Error
} = require("./errors/index");
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", (req, res, next) => {
  next({ status: 404, msg: "Route pathway NOT FOUND" });
});
app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);
app.use(send405Error);
// app.use(function(err, req, res, next) {
//   console.log(err, "In app error");
//   if (err.code) {
//     const psql = {
//       "42703": "Invalid column provided",
//       "22P02": "Bad Request - Invalid column provided",
//       "23505": "column already exists",
//       "42601": "Bad Request"
//     };
//     console.log(err.code, "In app error");
//     res.status(400).send({ msg: psql[err.code] });
//   } else if (err.status) {
//     console.log(err, "In app error else");
//     res.status(err.status).send({ msg: err.msg });
//   }
// });

module.exports = app;
