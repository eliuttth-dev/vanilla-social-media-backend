import { Router, Request, Response } from "express";
import registerController from "../controller/register.controller";
import registerMiddleware from "../middleware/register.middleware";


export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

router.post("/register", registerMiddleware, registerController);
