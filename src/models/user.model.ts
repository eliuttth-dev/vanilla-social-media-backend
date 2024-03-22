import crypto from "node:crypto";
import mysql, { Pool, PoolConnection, RowDataPacket } from "mysql2/promise";
import jwt from "jsonwebtoken";
import { dbConfig } from "../config/dbConfig";

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

export async function searchUser(email: string): Promise<RowDataPacket> {
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try {
    const query: string = "SELECT email, username, profile_image, bio, links, account_verification, created_at FROM users WHERE email = ?";
    const values: string[] = [email];
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
export async function loginUser(email: string, username: string): Promise<string | undefined> {
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

      const token = process.env.JWT_SECRET && jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
      return token;
    }
  } catch (error) {
    throw new Error("User not found");
  } finally {
    connection.release();
  }
}
