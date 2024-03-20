// Verification token util
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function generateVerificationToken(email:string, username:string):string{
  return jwt.sign({email, username}, JWT_SECRET, {expiresIn: '24h'});
}

export function verifyToken(token:string):any{
  return jwt.verify(token,JWT_SECRET);
}
