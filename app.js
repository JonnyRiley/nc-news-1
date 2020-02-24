const express = require("express");
const app = express();
const apiRouter = require("./routes/api_router");
const {
  customErrors,
  psqlErrors,
  serverErrors,
  all404Errors
} = require("./errors");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", all404Errors);
app.use(customErrors);
app.use(psqlErrors);
app.use(serverErrors);
module.exports = app;
