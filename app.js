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

module.exports = app;
