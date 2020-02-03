const express = require("express");
const app = express();
const apiRouter = require("./routes/api_router");
const { customErrors } = require("./errors");
app.use(express.json());
app.use("/api", apiRouter);
app.all("/*", (request, response, next) => {
  next({ status: 405, msg: "Route pathway NOT FOUND" });
});
app.use(customErrors);
module.exports = app;
