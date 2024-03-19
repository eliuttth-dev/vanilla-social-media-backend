import dotenv from "dotenv";

import express, { Application } from "express";
import cors from "cors";
import { router } from "./routes/router";

// Config
dotenv.config();
const app: Application = express();
const port: number = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/", router);

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`Server http://localhost:${port}`));
