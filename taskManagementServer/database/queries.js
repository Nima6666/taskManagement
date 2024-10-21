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

module.exports.dropUserTokens = async (user_id) => {
  const dropUserTokenQuery = "DELETE FROM refreshtokens WHERE user_id = $1;";
  const dbresponse = await pool.query(dropUserTokenQuery, [user_id]);
  console.log(dbresponse);
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

module.exports.getTasks = async (user_id, field) => {
  const getTaskQuery = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY ${field} DESC;`;
  const dbresponse = await pool.query(getTaskQuery, [user_id]);
  return dbresponse.rows;
};
