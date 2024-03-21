import { Request, Response } from "express";
import { loginUser, searchUser } from "../models/user.model";
import jwt, { JwtPayload } from "jsonwebtoken";

export default async function loginController(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    const validUserToken = await loginUser(email, username, password);

    res.set("Authorization", `Bearer ${validUserToken}`);

    res.status(200).json({ status: "success", message: "User logged correctly" });
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
