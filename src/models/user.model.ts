import mysql from "mysql2/promise";
import crypto from "node:crypto";
import {dbConfig} from "../config/dbConfig";

export async function saveNewUser(email:string, username:string, password:string): Promise<void>{
  const pool: mysql.Pool= mysql.createPool(dbConfig);
  const connection= await pool.getConnection();

  const salt:string = crypto.randomBytes(16).toString("hex");
  const hashedPassword:string = crypto.createHash("sha256").update(password + salt).digest("hex");

  try{
    const query:string = "INSERT INTO users (email, username, password, salt) VALUES (?,?,?,?)";
    const values:string[] = [email, username, hashedPassword,salt];

    await connection.query(query,values);
  }catch(error){
    console.error("Error saving new user:", error);
    throw new Error("Error saving new user");
  }finally{
    connection.release();
  }


}
