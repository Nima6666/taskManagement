const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const queries = require("../database/queries");

module.exports.generateToken = (payload, accessToken) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: accessToken ? "30s" : "7d",
  });
  return token;
};

module.exports.isAuthenticated = expressAsyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization;

  if (typeof bearerToken !== "undefined") {
    const token = bearerToken.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) {
        console.log("Access token expired");
        return res.status(403).json({
          success: false,
          message: "Access Token Expired",
        });
      } else {
        // Attaching payload on successful token verification to req.headers
        const { username } = payload;
        if (!username) {
          return res.status(400).json({
            message: "access token required",
          });
        }
        req.headers.payload = payload;
        next();
      }
    });
  } else {
    console.log("token not found");
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
            message: "Refresh token Expired",
          });
        } else {
          const { user_id } = payload;
          const tokenIsValid = await queries.checkIfRefreshTokenExists(
            user_id,
            refreshToken
          );
          if (tokenIsValid) {
            req.headers.payload = payload;
            next();
          } else {
            return res.status(401).json({
              success: false,
              message: "Refresh Token Expired",
            });
          }
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
