import { Router, Request, Response } from "express";
import registerController from "../controller/register.controller";
import registerMiddleware from "../middleware/register.middleware";
import accountVerification from "../controller/accountVerification.controller";
export const router = Router();

// User Methods
router.post("/register", registerMiddleware, registerController);
router.get("/verify", accountVerification);
