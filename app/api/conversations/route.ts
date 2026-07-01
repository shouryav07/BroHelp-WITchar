import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// GET all conversations for current user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const userId = session.user.id

  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ participantAId: userId }, { participantBId: userId }],
    },
    include: {
      participantA: { select: { id: true, name: true, username: true, image: true } },
      participantB: { select: { id: true, name: true, username: true, image: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  })

  // Count unread per conversation
  const withUnread = await Promise.all(
    conversations.map(async (conv) => {
      const unread = await prisma.message.count({
        where: {
          conversationId: conv.id,
          isRead: false,
          senderId: { not: userId },
        },
      })
      return { ...conv, unread }
    })
  )

  return NextResponse.json({ conversations: withUnread })
}

// POST - start or get existing conversation with a user
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { userId: otherUserId } = await req.json()
  const myId = session.user.id

  if (otherUserId === myId) return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 })

  // Ensure consistent ordering for @@unique constraint
  const [participantAId, participantBId] = [myId, otherUserId].sort()

  const conversation = await prisma.conversation.upsert({
    where: { participantAId_participantBId: { participantAId, participantBId } },
    create: { participantAId, participantBId },
    update: {},
    include: {
      participantA: { select: { id: true, name: true, username: true, image: true } },
      participantB: { select: { id: true, name: true, username: true, image: true } },
    },
  })

  return NextResponse.json({ conversation })
}