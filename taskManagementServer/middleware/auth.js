const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const queries = require("../database/queries");

module.exports.generateToken = (payload, accessToken) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: accessToken ? "10m" : "7d",
  });
  return token;
};

module.exports.isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (typeof bearerToken !== "undefined") {
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        console.log(err);
        return res.status(403).json({
          success: false,
          message: "Access Token Expired",
        });
      } else {
        // Attaching payload on successful token verification to req.headers
        req.headers.payload = payload;
        next();
      }
    });
  } else {
    console.log("smthng went wrong validating token");
    return res.status(400).json({
      message: "token not found",
    });
  }
});

module.exports.refreshTokenValid = expressAsyncHandler(
  async (req, res, next) => {
    console.log("access token requested");
    const { refreshToken } = req.body;

    if (typeof refreshToken !== "undefined") {
      jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, payload) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            success: false,
            message: "Token Expired",
          });
        } else {
          req.headers.payload = payload;

          next();
        }
      });
    } else {
      console.log("smthng went wrong validating token");
      return res.status(400).json({
        message: "token not found",
      });
    }
  }
);
