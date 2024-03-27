import dotenv from "dotenv";

import express, { Application } from "express";
import cors from "cors";
import { router } from "./routes/router";

// Config
dotenv.config();
const app: Application = express();
const port = process.env.PORT ? process.env.PORT : 3000;

// Middleware
app.use(
  cors({
    exposedHeaders: ["Authorization"],
    origin: "http://localhost:5173"
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/", router);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server http://localhost:${port}`));
