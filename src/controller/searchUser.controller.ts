import { Request, Response } from "express";
import { searchUser } from "../models/user.model";

export default async function searchUserController(req: Request, res: Response) {
  const { email } = req.body;

  try {
    const userFound = await searchUser(email);

    if (userFound) {
      res.status(200).json({ status: "success", data: userFound });
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
}
