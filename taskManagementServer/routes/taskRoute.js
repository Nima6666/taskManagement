const { Router } = require("express");
const taskController = require("../controller/taskController");

const router = Router();

router.post("/", taskController.addTask);

module.exports = router;
