import { verifyAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const client = await prisma.client.findUnique({ where: { id } });
    return NextResponse.json(client);
  }

  const clients = await prisma.client.findMany({ where: { userId: user.id } });
  return NextResponse.json(clients);
}

export async function POST(req: Request) {
  console.log(req, "req");
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const client = await prisma.client.create({
    data: {
      ...data,
      user: { connect: { id: user.id } },
    },
  });
  console.log(client,"client")
  return NextResponse.json(client);
}

export async function PUT(req: Request) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const data = await req.json();

  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  const client = await prisma.client.update({
    where: { id },
    data,
  });

  return NextResponse.json(client);
}

export async function DELETE(req: Request) {
  const user = await verifyAuth(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
  }

  await prisma.client.delete({ where: { id } });
  return NextResponse.json({ message: "Client deleted successfully" });
}
