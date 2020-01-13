const ENV = process.env.NODE_ENV || "development";
const devData = require("./development-data");
const testData = require("./test-data");

module.exports = { testData, devData };
