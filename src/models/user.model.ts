import crypto from "node:crypto";
import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import { dbConfig } from "../config/dbConfig";
import jwt, { JwtPayload } from "jsonwebtoken";

// Save new user
export async function saveNewUser(email: string, username: string, password: string): Promise<void> {
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  const salt: string = crypto.randomBytes(16).toString("hex");
  const hashedPassword: string = crypto
    .createHash("sha256")
    .update(password + salt)
    .digest("hex");

  try {
    const query: string = "INSERT INTO users (email, username, password, salt) VALUES (?,?,?,?)";
    const values: string[] = [email, username, hashedPassword, salt];
    await connection.query(query, values);
  } catch (error) {
    throw new Error("Error saving new user");
  } finally {
    connection.release();
  }
}

// Update account verified status
export async function updateVerifiedStatus(email: string): Promise<void> {
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try {
    const query: string = "UPDATE users SET account_verification = 'VERIFIED' WHERE email = ?";
    const values: string[] = [email];
    await connection.query(query, values);
  } catch (error) {
    throw new Error("Error updating verified status:");
  } finally {
    connection.release();
  }
}

//Search user by email or username
export async function searchUser(email: string, username: string) {
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try {
    const query: string = "SELECT email, username, account_verification FROM users WHERE email = ? OR username = ?";
    const values: string[] = [email, username];
    const [result] = await connection.query<RowDataPacket[]>(query, values);

    if (result[0]) {
      return result[0];
    }
    throw new Error("User not found");
  } catch (error) {
    throw new Error("Error trying to search a user");
  } finally {
    connection.release();
  }
}

// Login user
export async function loginUser(email: string, username: string, password: string) {
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try {
    const query: string = "SELECT * FROM users WHERE email = ? OR username = ?";
    const values: string[] = [email, username];
    const [result] = await connection.query<RowDataPacket[]>(query, values);

    if (result[0]) {
      const payload = {
        userId: result[0].id,
        email: result[0].email,
        username: result[0].username,
      };

      const token = process.env.JWT_SECRET ? jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" }) : null;

      const hashedPassword: string = crypto
        .createHash("sha256")
        .update(password + result[0].salt)
        .digest("hex");

      if (email === result[0].email || (username === result[0].username && hashedPassword === result[0].password)) {
        return token;
      } else {
        throw new Error("Wrong Credentials");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw new Error("Error trying to log in a user");
  } finally {
    connection.release();
  }
}
