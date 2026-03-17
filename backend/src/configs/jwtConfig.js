import dotenv from "dotenv";
dotenv.config();

export const key = process.env.JWT_SECRET;

if (!key) {
  throw new Error("JWT_SECRET está indefinido!");
}