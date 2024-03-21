import jwt, { JwtPayload } from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret';

export const generateVerificationToken = (email: string, username: string): string => {
  return jwt.sign({ email, username }, JWT_SECRET, { expiresIn: "24h" });
};

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

