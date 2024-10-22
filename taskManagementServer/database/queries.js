const pool = require("./pool");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

module.exports.checkForExistingUser = async (email) => {
  const checkingUserQuery = "SELECT * FROM users WHERE email = $1;";
  const dbresponse = await pool.query(checkingUserQuery, [email]);
  const [foundUser] = dbresponse.rows;
  return foundUser;
};

module.exports.register = async (fullname, email, password) => {
  const registerUserQuery =
    "INSERT INTO users (id, full_name, email, password) VALUES ($1, $2, $3, $4);";
  const id = uuidv4();
  const dbresponse = await pool.query(registerUserQuery, [
    id,
    fullname,
    email,
    password,
  ]);
  return dbresponse.rowCount;
};

module.exports.setRefreshTokenForUser = async (user_id, token) => {
  const setUserTokenQuery =
    "INSERT INTO refreshtokens (id, user_id, token) VALUES ($1, $2, $3);";
  const id = uuidv4();
  const dbresponse = await pool.query(setUserTokenQuery, [id, user_id, token]);
  return dbresponse.rowCount;
};

module.exports.checkIfRefreshTokenExists = async (user_id, token) => {
  const checkTokenQuery =
    "SELECT * FROM refreshtokens WHERE user_id=$1 AND token=$2";
  const dbresponse = await pool.query(checkTokenQuery, [user_id, token]);
  return dbresponse.rowCount;
};

module.exports.dropUserTokens = async (user_id) => {
  const dropUserTokenQuery = "DELETE FROM refreshtokens WHERE user_id = $1;";
  const dbresponse = await pool.query(dropUserTokenQuery, [user_id]);
  if (dbresponse.rowCount) {
    console.log("deleted previous refresh token ", dbresponse.rowCount);
  } else {
    console.log("smthng wnt wrng clarng prev tkns");
  }
};

module.exports.getUserById = async (user_id) => {
  const checkingUserQuery = "SELECT * FROM users WHERE id = $1;";
  const dbresponse = await pool.query(checkingUserQuery, [user_id]);
  const [foundUser] = dbresponse.rows;
  return foundUser;
};

module.exports.addTask = async (user_id, title, description, due_date) => {
  const addTaskQuery =
    "INSERT INTO tasks (id, user_id, title, description, due_date) VALUES ($1, $2, $3, $4, $5);";
  const id = uuidv4();
  const dbresponse = await pool.query(addTaskQuery, [
    id,
    user_id,
    title,
    description,
    due_date,
  ]);
  return dbresponse.rowCount;
};

module.exports.getTasks = async (user_id, name, sort) => {
  const validColumns = ["created_at", "due_date", "title", "complete"];
  const sortTypes = ["ASC", "DESC"];
  if (!validColumns.includes(name)) {
    throw new Error("Invalid column name for ordering");
  }
  if (!sort.includes(sort)) {
    throw new Error("Invalid sort for ordering");
  }
  const getTaskQuery = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY ${name} ${sort};`;
  const dbresponse = await pool.query(getTaskQuery, [user_id]);
  return dbresponse.rows;
};

module.exports.getTask = async (user_id, task_id) => {
  const getTaskByIdQuery = `SELECT * FROM tasks WHERE user_id = $1 AND id = $2`;
  const dbresponse = await pool.query(getTaskByIdQuery, [user_id, task_id]);
  const [task] = dbresponse.rows;
  return task;
};

module.exports.deleteTask = async (user_id, task_id) => {
  const deleteTaskQuery = `DELETE FROM tasks WHERE user_id = $1 AND id = $2`;
  const dbresponse = await pool.query(deleteTaskQuery, [user_id, task_id]);
  console.log("task deleted ", dbresponse.rowCount);
  return dbresponse.rowCount;
};

module.exports.updateTaskStatus = async (
  completeStatus,
  completed_at,
  user_id,
  task_id
) => {
  const deleteTaskQuery =
    "UPDATE tasks SET complete = $1, completed_at = $2 WHERE user_id = $3 AND id = $4;";
  const dbresponse = await pool.query(deleteTaskQuery, [
    completeStatus,
    completed_at,
    user_id,
    task_id,
  ]);
  console.log("task deleted ", dbresponse.rowCount);
  if (dbresponse.rowCount) {
    return {
      success: true,
      updated_to: completeStatus,
    };
  } else {
    return {
      message: "something went wrong",
    };
  }
};

module.exports.getUrgentTasks = async (time) => {
  const getUrgentTaskQuery = `
    SELECT users.full_name, users.email, ARRAY_AGG(tasks.title) AS tasks 
    FROM users 
    INNER JOIN tasks ON users.id = tasks.user_id 
    WHERE tasks.due_date < $1 
    AND tasks.complete = false
    AND tasks.alerted_user = false 
    GROUP BY users.full_name, users.email;
`;
  const dbresponse = await pool.query(getUrgentTaskQuery, [time]);
  return dbresponse.rows;
};

module.exports.setEmailNotifForSentTaskOff = async (time) => {
  const setTaskNotifOffQuery = `
  UPDATE tasks SET alerted_user = True WHERE due_date < $1 AND complete = false;
`;
  const dbresponse = await pool.query(setTaskNotifOffQuery, [time]);
  return dbresponse.rowCount;
};

module.exports.setTaskReminderOn = async (user_id, task_id) => {
  const setReminderTaskQuery =
    "UPDATE tasks SET alerted_user = False WHERE user_id = $1 AND id = $2;";
  const dbresponse = await pool.query(setReminderTaskQuery, [user_id, task_id]);
  return dbresponse.rowCount;
};

module.exports.setTaskReminderOff = async (user_id, task_id) => {
  const setReminderTaskQuery =
    "UPDATE tasks SET alerted_user = True WHERE user_id = $1 AND id = $2;";
  const dbresponse = await pool.query(setReminderTaskQuery, [user_id, task_id]);
  return dbresponse.rowCount;
};

module.exports.updateTask = async (
  title,
  description,
  editedDate,
  task_id,
  user_id
) => {
  const updateTaskQuery =
    "UPDATE tasks SET title = $1, description = $2, edited_at = $3 WHERE id = $4 AND user_id = $5";
  const dbresponse = await pool.query(updateTaskQuery, [
    title,
    description,
    editedDate,
    task_id,
    user_id,
  ]);
  return dbresponse.rowCount;
};
