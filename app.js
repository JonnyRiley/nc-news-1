const express = require("express");
const app = express();
const apiRouter = require("./routes/api_router");
const { customErrors } = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);
app.use(customErrors);
module.exports = app;
