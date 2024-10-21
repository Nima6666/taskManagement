const { Router } = require("express");
const userController = require("../controller/userController");
const { refreshTokenValid } = require("../middleware/auth");

const router = Router();

router.post(
  "/accessToken",
  refreshTokenValid,
  userController.generateAccessToken
);
router.post("/login", userController.login);
router.post("/", userController.register);

module.exports = router;
