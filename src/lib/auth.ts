import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // แนะนำให้เก็บไว้ใน .env

/**
 * Generate JWT token
 * @param payload - object ที่ต้องการเก็บใน token เช่น { id, email }
 */
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // อายุ 7 วัน
}

/**
 * Hash password using bcrypt
 * @param password - plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

/**
 * Verify password
 * @param password - plain text password
 * @param hashedPassword - hashed password from database
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * Verify JWT from Authorization header
 * @param req - Request object
 * @returns decoded user info (id, email) | null
 */
export async function verifyAuth(req: Request | NextRequest): Promise<{ id: string; email: string } | null> {
  try {
    // ดึงค่า Authorization header (เช่น "Bearer <token>")
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    // ตัดเอาเฉพาะ token
    const token = authHeader.split(" ")[1];
    if (!token) return null;

    // ตรวจสอบความถูกต้องของ token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    return decoded;
  } catch (error) {
    console.error("verifyAuth error:", error);
    return null;
  }
}