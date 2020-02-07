const express = require("express");
const app = express();
const apiRouter = require("./routes/api_router");
const { customErrors, psqlErrors, serverErrors } = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", (request, response, next) => {
  next({ status: 404, msg: "Route pathway NOT FOUND" });
});
app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);
module.exports = app;
