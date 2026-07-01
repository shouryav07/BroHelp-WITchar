import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      rating: true,
      ratingCount: true,
      createdAt: true,
      postedTasks: {
        where: { status: "COMPLETED" },
        select: { id: true, title: true, credits: true, createdAt: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      ratingsReceived: {
        include: {
          giver: { select: { id: true, name: true, username: true, image: true } },
          task: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  })

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  return NextResponse.json({ user })
}