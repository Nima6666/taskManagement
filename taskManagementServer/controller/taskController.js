const expressAsyncHandler = require("express-async-handler");
const queries = require("../database/queries");

module.exports.addTask = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
});
