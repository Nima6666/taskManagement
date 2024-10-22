const expressAsyncHandler = require("express-async-handler");
const queries = require("../database/queries");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

module.exports.pollDatabaseAndSendMail = () => {};

module.exports.addTask = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { title, description, due_date } = req.body;

  if (!due_date || !description || !!title) {
    return res.status(400).json({
      message: "Form fields missing.",
    });
  }

  const dueDate = new Date(due_date);
  if (isNaN(dueDate.getTime())) {
    return res.status(400).json({
      message: "due_date must be a valid date",
    });
  }

  if (new Date(due_date).getTime() < Date.now()) {
    return res.status(400).json({
      message: "due date cannot be on past",
    });
  }

  const taskAdded = await queries.addTask(
    user_id,
    title,
    description,
    due_date
  );
  console.log(taskAdded);
  if (taskAdded) {
    return res.json({
      success: true,
      message: "task added",
    });
  } else {
    return res.json({
      message: "something went wrong adding task",
    });
  }
});

module.exports.getTasks = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { name, sort } = req.query;
  const userTasks = await queries.getTasks(user_id, name, sort);
  res.json({
    success: true,
    tasks: userTasks,
  });
});

module.exports.getTask = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { task_id } = req.params;
  const selectedTask = await queries.getTask(user_id, task_id);
  if (!selectedTask) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  res.json({
    success: true,
    task: selectedTask,
    message: "task retrieved",
  });
});
