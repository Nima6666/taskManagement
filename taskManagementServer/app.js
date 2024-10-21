const express = require("express");
const createError = require("http-errors");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  return res.json({
    message: "task management server",
  });
});

const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");

app.use("/user", userRoute);
app.use("/task", taskRoute);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Starting Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
