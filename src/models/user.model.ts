import crypto from "node:crypto";
import mysql, { Pool, PoolConnection } from "mysql2/promise";
import { dbConfig } from "../config/dbConfig";

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

export async function updateVerifiedStatus(email:string):Promise<void>{
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  try{
    const query:string = "UPDATE users SET account_verification = 'VERIFIED' WHERE email = ?";
    const values:string[] = [email];
    await connection.query(query,values); 
  }catch(error){
    throw new Error("Error updating verified status:");
  }finally{
    connection.release();
  }

}
