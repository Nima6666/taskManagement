const expressAsyncHandler = require("express-async-handler");
const queries = require("../database/queries");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../middleware/auth");

module.exports.register = expressAsyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({
      message: "Fields Missing",
    });
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({
      message: "invalid email format",
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      message: "Password must be 8 characters long.",
    });
  }

  const userExists = await queries.checkForExistingUser(req.body.email);
  if (userExists) {
    console.log("user exists");
    return res.status(400).json({
      message: "User Exists",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRegistered = await queries.register(
    fullName,
    email,
    hashedPassword
  );
  if (userRegistered) {
    return res.json({
      success: true,
      message: "User registered",
    });
  }
});

module.exports.login = expressAsyncHandler(async (req, res) => {
  const userAgent = req.headers["user-agent"]; // Get the User-Agent header
  console.log("User-Agent:", userAgent);
  const { email, password } = req.body;
  const userFromEmail = await queries.checkForExistingUser(email);
  if (!userFromEmail) {
    return res.status(401).json({
      message: "invalid credentials",
    });
  }
  const match = await bcrypt.compare(password, userFromEmail.password);
  if (match) {
    console.log(match);

    // deleting any previous user refresh tokens. limiting user to login from only one browser from only one device at a time.
    await queries.dropUserTokens(userFromEmail.id);

    // refresh token payload
    const payloadToRefreshToken = {
      user_id: userFromEmail.id,
    };

    const refreshToken = generateToken(payloadToRefreshToken);

    // storing refresh token on database
    const tokenStored = await queries.setRefreshTokenForUser(
      userFromEmail.id,
      refreshToken
    );
    if (tokenStored) {
      // access token payload
      const accessTokenPayload = {
        user_id: userFromEmail.id,
        username: userFromEmail.full_name,
        email: userFromEmail.email,
      };
      const accessToken = generateToken(accessTokenPayload, true);

      res.json({
        success: true,
        message: "logged in",
        accessToken: `Bearer ${accessToken}`,
        refreshToken,
        name: userFromEmail.full_name,
        email: userFromEmail.email,
      });
    }
  } else {
    res.status(401).json({
      message: "invalid password",
    });
  }
});

module.exports.generateAccessToken = expressAsyncHandler(async (req, res) => {
  const payload = req.headers.payload;
  const loggedInUser = await queries.getUserById(payload.user_id);
  const accessTokenPayload = {
    user_id: loggedInUser.id,
    username: loggedInUser.full_name,
    email: loggedInUser.email,
  };
  console.log("access token granted");
  const newAccessToken = generateToken(accessTokenPayload, true);
  res.json({
    success: true,
    message:
      "granted new access token. hurry with your access token it expires in 30s",
    loggedInUser: {
      name: loggedInUser.full_name,
      email: loggedInUser.email,
      newAccessToken: `Bearer ${newAccessToken}`,
    },
  });
});
