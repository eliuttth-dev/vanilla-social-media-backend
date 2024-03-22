import crypto from "node:crypto";
import mysql, { PoolConnection, Pool, RowDataPacket } from "mysql2/promise";
import { Request, Response, NextFunction } from "express";
import { dbConfig } from "../config/dbConfig";

// Track failed login attempts
const failedLoginAttempts: { [key: string]: number } = {};

// Reset failed login attempts after 15 mins
setInterval(
  () => {
    for (const key in failedLoginAttempts) {
      failedLoginAttempts[key] = 0;
    }
  },
  15 * 60 * 1000,
);

export default async function loginMiddleware(req: Request, res: Response, next: NextFunction) {
  const { email, username, password } = req.body;

  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try {
    // Get salt with valid username/email
    const searchSalt = "SELECT salt FROM users WHERE email = ? OR username = ?";
    const [getSalt] = await connection.query<RowDataPacket[]>(searchSalt, [email, username]);

    if (!getSalt.length) {
      throw new Error("Wrong Credentials. Please try again!");
    }

    const salt = getSalt[0].salt;

    const hashedPassword: string = crypto
      .createHash("sha256")
      .update(password + salt)
      .digest("hex");

    // Check credentials
    const query = "SELECT * FROM users WHERE (email = ? OR username = ?) AND password = ?";
    const value = [email, username, hashedPassword];
    const [result] = await connection.query<RowDataPacket[]>(query, value);

    if (!result.length) {
      // Increment count of failed attempts
      failedLoginAttempts[email || username] = (failedLoginAttempts[email || username] || 0) + 1;

      // Check if exceed limit of attempts
      if (failedLoginAttempts[email || username] > 5) {
        return res.status(429).json({ status: "error", message: "Too many failed login attempts. Please try again later." });
      }

      throw new Error("Wrong Credentials. Please try again!");
    }

    next();
  } catch (error) {
    console.error("Something went wrong. Loggin Middleware:", error);
    res.status(401).json({ status: "error", message: "Wrong Credentials. Please try again!"});
  } finally {
    connection.release();
  }
}
