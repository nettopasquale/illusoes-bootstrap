import dotenv from "dotenv";
dotenv.config();

export const key = process.env.JWT_SECRET;

if (!key) {
  console.warn("JWT_SECRET está indefinido!");
}