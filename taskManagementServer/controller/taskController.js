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

module.exports.pollDatabaseAndSendMail = async () => {
  const thirtyMinutesFromNowInMs = new Date(Date.now() + 30 * 60 * 1000);

  const thirtyMinutesFromNow = thirtyMinutesFromNowInMs
    .toLocaleString("sv", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
      hour12: false,
    })
    .replace("T", " ")
    .replace(",", ".");

  const urgentTasks = await queries.getUrgentTasks(thirtyMinutesFromNow);
  usersWithDueTasks = urgentTasks;
  console.log("users with urgent tasks un-notified: ", usersWithDueTasks);
  for (let index = 0; index < usersWithDueTasks.length; index++) {
    const mailOptions = {
      from: process.env.EMAIL,
      to: usersWithDueTasks[index].email,
      subject: "Your Task List. Complete them before its too late", // Subject line
      text: `Hello ${
        usersWithDueTasks[index].full_name
      },\n\nHere are your tasks:\n${usersWithDueTasks[index].tasks
        .map((task) => `- ${task}`)
        .join("\n")}\n\nBest regards,\nYour Task Management Team`, // Plain text body
      html: `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
          <h2 style="color: #4CAF50;">Hello ${
            usersWithDueTasks[index].full_name
          },</h2>
          <p>Here are your tasks:</p>
          <ul style="list-style-type: none; padding: 0;">
            ${usersWithDueTasks[index].tasks
              .map(
                (task) =>
                  `<li style="padding: 5px 0; font-size: 16px;">&#x2022; ${task}</li>`
              )
              .join("")}
          </ul>
          <p style="margin-top: 20px;">Best regards,<br>Your Task Management Team</p>
        </div>
      </body>
    </html>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log("Error occurred:", error);
      }
      console.log("Email sent:", info.response);
    });
  }
  if (urgentTasks.length) {
    const taskNotifTurnedOffCount = await queries.setEmailNotifForSentTaskOff(
      thirtyMinutesFromNow
    );
    console.log("turned of notif for ", taskNotifTurnedOffCount);
  }
};

module.exports.addTask = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { title, description, due_date } = req.body;

  console.log(title, due_date, description);

  if (!due_date || !description || !title) {
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
    this.pollDatabaseAndSendMail();
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

module.exports.deleteTask = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { task_id } = req.params;
  const taskDeleted = await queries.deleteTask(user_id, task_id);
  if (!taskDeleted) {
    return res.status(404).json({
      message: "Task not found",
    });
  }
  res.json({
    success: true,
    task: taskDeleted,
    message: "task deleted",
  });
});

module.exports.setTaskCompleteStatus = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { task_id } = req.params;
  const { status_update_to } = req.body;
  const now = new Date();

  const localTimestamp = now
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(", ", "T");

  console.log(localTimestamp);
  const taskStatusUpdated = await queries.updateTaskStatus(
    status_update_to,
    status_update_to ? localTimestamp : null,
    user_id,
    task_id
  );
  if (taskStatusUpdated.success) {
    if (!status_update_to) {
      const setTaskReminderOn = await queries.setTaskReminderOn(
        user_id,
        task_id
      );
      console.log("setted task reminder on: ", setTaskReminderOn);
      this.pollDatabaseAndSendMail();
    } else {
      const setTaskReminderOff = await queries.setTaskReminderOff(
        user_id,
        task_id
      );
      console.log("setted task reminder off: ", setTaskReminderOff);
    }

    res.json({
      success: true,
      message: `Task marked ${
        taskStatusUpdated.updated_to ? "complete." : "incomplete."
      }`,
    });
  } else {
    res.status(404).json({
      message: "task not found",
    });
  }
});

module.exports.updateTask = expressAsyncHandler(async (req, res) => {
  const { user_id } = req.headers.payload;
  const { task_id } = req.params;

  const { title, description } = req.body;

  if (!description || !title) {
    return res.status(400).json({
      message: "Form fields missing.",
    });
  }

  const taskToEdit = await queries.getTask(user_id, task_id);

  if (taskToEdit.description === description && title === taskToEdit.title) {
    return res.json({
      success: true,
      message: "Nothing changed.",
    });
  }

  const now = new Date();

  const localTimestamp = now
    .toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(", ", "T");

  const taskEdited = await queries.updateTask(
    title,
    description,
    localTimestamp,
    task_id,
    user_id
  );
  console.log(taskEdited);
  if (taskEdited) {
    return res.json({
      success: true,
      message: "task updated",
    });
  } else {
    return res.status(404).json({
      message: "task not found",
    });
  }
});
