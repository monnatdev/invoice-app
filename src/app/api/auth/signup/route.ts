import { generateToken, hashPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Handling signup route");
  const { email, password } = await req.json();

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email });
  return NextResponse.json({ token });
}