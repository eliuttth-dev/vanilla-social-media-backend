import { Request, Response } from "express";
import { loginUser } from "../models/user.model";

export default async function loginController(req: Request, res: Response): Promise<void> {
  const { email, username } = req.body;

  try {
    const validUserToken = await loginUser(email, username);

    res.set("Access-Control-Expose-Headers", "Authorization")
    res.set("Authorization", `Bearer ${validUserToken}`);

    res.status(200).json({ status: "success", message: "User logged correctly" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
