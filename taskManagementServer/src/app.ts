import express, { Request, Response, NextFunction } from "express";
import createError from "http-errors";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // You can use env variables for port

// Middleware
app.use(
  cors({
    // origin: "", // Specify allowed origins here if needed
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Task Management Server.",
  });
});

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Starting Server
app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

console.log(process.env.DB_NAME);
