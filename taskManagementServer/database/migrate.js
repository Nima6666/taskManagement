// import pkg from "pg";
const { Client } = require("pg");
require("dotenv").config();
// const { Client } = pkg;

console.log(
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  process.env.DB_NAME,
  "database credentials"
);

const userQuery = `
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const tasksQuery = `
CREATE TABLE IF NOT EXISTS tasks (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP DEFAULT NULL,
  complete BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP DEFAULT NULL,
  alerted_user BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

const refreshTokenTableQuery = `
CREATE TABLE IF NOT EXISTS refreshtokens (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) UNIQUE NOT NULL,
  token VARCHAR(255) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
`;

(async () => {
  try {
    console.log("Connecting to the database...");
    const client = new Client({
      connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    });
    await client.connect();

    await client.query(userQuery);
    await client.query(tasksQuery);
    await client.query(refreshTokenTableQuery);

    await client.end();
    console.log("Database operation completed.");
  } catch (error) {
    console.log("An error occurred:", error);
  } finally {
    process.exit(1);
  }
})();
