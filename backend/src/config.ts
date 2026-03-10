import dotenv from "dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET está indefinido!");
}

export const key: string = secret; 