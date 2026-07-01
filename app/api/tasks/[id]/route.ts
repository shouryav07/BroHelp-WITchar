import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      poster: {
        select: { id: true, name: true, image: true, rating: true, ratingCount: true },
      },
      acceptor: {
        select: { id: true, name: true,  },
      },
    },
  })

  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ task })
}