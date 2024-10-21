const { Router } = require("express");
const taskController = require("../controller/taskController");
const { isAuthenticated } = require("../middleware/auth");

const router = Router();

router.post("/", isAuthenticated, taskController.addTask);
router.get("/", isAuthenticated, taskController.getTasks);

module.exports = router;
