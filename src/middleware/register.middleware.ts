import mysql, {PoolConnection, Pool, RowDataPacket} from "mysql2/promise";
import {Request, Response, NextFunction} from "express";
import {dbConfig} from "../config/dbConfig";

export default async function registerMiddleware(req: Request, res: Response, next: NextFunction):Promise<void>{

  const {email,username,password} = req.body;
  const pool: Pool = mysql.createPool(dbConfig);
  const connection: PoolConnection = await pool.getConnection();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  const usernameRegex = /^[^\s]+$/; 
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

  // Check if inputs are valid format
  if(!emailRegex.test(email)){
    res.status(400).json({status: "error", message: "Email format is not correct. Please try again."});
    return;
  }

  if(!usernameRegex.test(username)){
    res.status(400).json({status: "error", message: "Username can not contain white spaces."});
    return;
  }

  if(!passwordRegex.test(password)){
    res.status(400).json({status: "error", message: "Password should contain: 1 UpperCase letter, 1 LowerCase letter, 1 number and at least 6 characters long."});
    return;
  }


  try{
  
    let errorMessage:string = "";

    // Check if user already exists by username
    const queryUsernameCheck:string = "SELECT username FROM users WHERE username = ?";
    const valueUsername:string[] = [username];
    const [resultUsernameCheck] = await connection.query<RowDataPacket[]>(queryUsernameCheck,valueUsername);
    
    if(resultUsernameCheck.length > 0){
      errorMessage = "Username already exists. Try a new one";
      throw new Error(errorMessage);
    }
  
    // Check if user already exists by email
    const queryEmailCheck:string = "SELECT email FROM users WHERE email = ?";
    const valueEmail:string[] = [email];
    const [resultEmailCheck] = await connection.query<RowDataPacket[]>(queryEmailCheck, valueEmail);

    if(resultEmailCheck.length > 0){
      errorMessage = "Email aready exists. Try a new one";
      throw new Error(errorMessage);
    }

    // Save new user
    next();
  }catch(error){
    console.log("Something went wrong",error);
    res.status(400).json({status: "error", message: (error as Error).message});
  }finally{
    connection.release();
  }
}
