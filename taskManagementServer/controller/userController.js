const expressAsyncHandler = require("express-async-handler");

module.exports.register = expressAsyncHandler(async (req, res) => {
  console.log(req.body);
});
