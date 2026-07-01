import { NextResponse } from "next/server";
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      credits: true,
      transactionsFrom: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          to: { select: { name: true } },
          task: { select: { title: true } },
        },
      },
      transactionsTo: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          from: { select: { name: true } },
          task: { select: { title: true } },
        },
      },
    },
  });

  return NextResponse.json({ user });
}