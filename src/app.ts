import express, { Application } from "express";
import { router } from "./routes/router";
import cors from "cors";
import dotenv from "dotenv";

// Config
dotenv.config();
const app: Application = express();
const port: number = 3000;

// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use('/', router);

app.listen(port, () => console.log(`Server http://localhost:${port}`));
