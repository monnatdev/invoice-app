import { generateToken, verifyPassword } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Handling signin route");
  const { email, password } = await req.json();

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email });
  return NextResponse.json({ token });
}