import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { amount } = await req.json();

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Use transaction for safety
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { credits: { increment: amount } },
    }),
    prisma.creditTransaction.create({
      data: {
        amount,
        reason: "TOP_UP",
        status: "COMPLETED",
        toId: user.id,
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}