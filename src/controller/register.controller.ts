import mysql, {PoolConnection, Pool,RowDataPacket} from "mysql2/promise";
import { Request, Response } from "express";
import {dbConfig} from "../config/dbConfig";
import {saveNewUser} from "../models/user.model"; 

export default async function registerController(req: Request, res: Response):Promise<void> {
  const {email, username, password} = req.body;
  const pool: mysql.Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();


  try{
    let errorHandlerMessage:string = "";
    
    // Check if user exists by username
    const queryUsernameCheck:string = "SELECT * FROM users WHERE username = ?";
    const valueUsername:string[] = [username];
    const [resultUsernameCheck] = await connection.query<RowDataPacket[]>(queryUsernameCheck,valueUsername);

    if(resultUsernameCheck.length > 0){
      errorHandlerMessage = "Username already exists. Try another one";
      throw new Error(errorHandlerMessage);
    }

    // Check if user exists by email
    const queryEmailCheck:string = "SELECT * FROM users WHERE email = ?";
    const valueEmail:string[] = [email];
    const [resultEmailCheck] = await connection.query<RowDataPacket[]>(queryEmailCheck,valueEmail); 

    if(resultEmailCheck.length > 0){ 
      errorHandlerMessage = "Email already exists. Try another one";
      throw new Error(errorHandlerMessage);
    } 

    // save new user 
    await saveNewUser(email,username,password); 
    res.status(201).json({status: "success", message: "User registration done"});
  
  }catch(error){
    console.log("Something went wrong", error);
    res.status(400).json({message: (error as Error).message});
  
  }finally{
    connection.release();
  }

}
