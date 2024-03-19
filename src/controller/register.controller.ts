import { Request, Response } from "express";
import { saveNewUser } from "../models/user.model";

export default async function registerController(req: Request, res: Response): Promise<void> {
  const { email, username, password } = req.body;

  try {
    // save new user
    await saveNewUser(email, username, password);
    res.status(201).json({ status: "success", message: "User registration done" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
