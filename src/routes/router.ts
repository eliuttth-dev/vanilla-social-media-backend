import { Router, Request, Response } from "express";
import registerController from "../controller/register.controller";



export const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

router.post("/register", registerController);
