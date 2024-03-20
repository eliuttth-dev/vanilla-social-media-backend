import {Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import { updateVerifiedStatus } from "../models/user.model";

export default async function accountVerificationController(req: Request, res:Response){

  const token = req.query.token as string;

  // Check if token is missing
  if(!token) return res.status(400).json({status: "error", error: "Token is missing"});

  try{
    let decoded: JwtPayload | undefined;
    
    // Verify token using JWT_SECRET
    if(process.env.JWT_SECRET){
      decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload | undefined;
    } else {
      throw new Error("JWT_SECRET is undefined");
    }

    // Check if decoded token contains email and username
    if(decoded && decoded.email && decoded.username){
      await updateVerifiedStatus(decoded.email);
      
      res.status(200).json({status: "success", message: "User verified successfully"});
    } else {
      throw new Error("Invalid token format");
    }
  }catch(error){
    console.error("Error verifying token:",error);
    return res.status(401).json({status: "error", error: "Invalid or expired token"});
  }

}

