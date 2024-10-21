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
  const { field } = req.query;
  console.log(field);
  const userTasks = await queries.getTasks(user_id, field);
  res.json({
    success: true,
    tasks: userTasks,
  });
});
