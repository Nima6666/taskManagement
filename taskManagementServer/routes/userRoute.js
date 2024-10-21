const { Router } = require("express");
const userController = require("../controller/userController");

const router = Router();

router.post("/", userController.register);

module.exports = router;
