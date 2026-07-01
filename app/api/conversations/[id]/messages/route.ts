import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher-server"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: conversationId } = await params
  const userId = session.user.id

  // Verify user is part of this conversation
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ participantAId: userId }, { participantBId: userId }],
    },
  })
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Mark messages as read
  await prisma.message.updateMany({
    where: { conversationId, senderId: { not: userId }, isRead: false },
    data: { isRead: true },
  })

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { sender: { select: { id: true, name: true, username: true, image: true } } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ messages })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: conversationId } = await params
  const userId = session.user.id
  const { content } = await req.json()

  if (!content?.trim()) return NextResponse.json({ error: "Message cannot be empty" }, { status: 400 })

  // Verify user is part of this conversation
  const conv = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ participantAId: userId }, { participantBId: userId }],
    },
  })
  if (!conv) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const message = await prisma.message.create({
    data: { content, conversationId, senderId: userId },
    include: { sender: { select: { id: true, name: true, username: true, image: true } } },
  })

  // Update conversation updatedAt
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })

  // Trigger Pusher event on conversation channel
  await pusherServer.trigger(`conversation-${conversationId}`, "new-message", message)

  // Trigger notification for the other participant
  const otherUserId = conv.participantAId === userId ? conv.participantBId : conv.participantAId
  await pusherServer.trigger(`user-${otherUserId}`, "new-notification", {
    type: "MESSAGE",
    conversationId,
    senderId: userId,
    senderName: session.user.name,
    preview: content.slice(0, 60),
  })

  return NextResponse.json({ message })
}