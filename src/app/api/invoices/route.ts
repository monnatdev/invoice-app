import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const invoices = await prisma.invoice.findMany({
    include: { client: true }
  });
  return NextResponse.json(invoices);
}

export async function POST(req: Request) {
  const data = await req.json();
  const invoice = await prisma.invoice.create({ data });
  return NextResponse.json(invoice);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
  }

  await prisma.invoice.delete({
    where: { id },
  });

  return NextResponse.json({ message: 'Invoice deleted successfully' });
}