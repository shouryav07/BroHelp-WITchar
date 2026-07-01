import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const unreadCount = await prisma.message.count({
    where: {
      isRead: false,
      senderId: { not: session.user.id },
      conversation: {
        OR: [
          { participantAId: session.user.id },
          { participantBId: session.user.id },
        ],
      },
    },
  })

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: session.user.id }, { participantBId: session.user.id }],
      messages: { some: { isRead: false, senderId: { not: session.user.id } } },
    },
    include: {
      participantA: { select: { id: true, name: true, username: true, image: true } },
      participantB: { select: { id: true, name: true, username: true, image: true } },
      messages: {
        where: { isRead: false, senderId: { not: session.user.id } },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json({ unreadCount, conversations })
}