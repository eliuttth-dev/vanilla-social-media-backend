import { Router } from "express";
import registerController from "../controller/register.controller";
import registerMiddleware from "../middleware/register.middleware";
import accountVerification from "../controller/accountVerification.controller";
import loginController from "../controller/login.controller";
import loginMiddleware from "../middleware/login.middleware";
export const router = Router();

// User Methods
router.post("/register", registerMiddleware, registerController);
router.get("/verify", accountVerification);
router.post("/login", loginMiddleware, loginController);
