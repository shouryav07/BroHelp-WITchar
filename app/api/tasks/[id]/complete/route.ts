import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId } = await params

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { poster: true, acceptor: true },
    })

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    if (task.posterId !== session.user.id) return NextResponse.json({ error: "Only the poster can complete this task" }, { status: 403 })
    if (task.status !== "IN_PROGRESS") return NextResponse.json({ error: "Task is not in progress" }, { status: 400 })
    if (!task.acceptorId) return NextResponse.json({ error: "No acceptor found" }, { status: 400 })

    // Check poster has enough credits
    if (task.poster.credits < task.credits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 })
    }

    // Transfer credits atomically
    await prisma.$transaction([
      // Deduct from poster
      prisma.user.update({
        where: { id: task.posterId },
        data: { credits: { decrement: task.credits } },
      }),
      // Add to acceptor
      prisma.user.update({
        where: { id: task.acceptorId },
        data: { credits: { increment: task.credits } },
      }),
      // Mark task complete
      prisma.task.update({
        where: { id: taskId },
        data: { status: "COMPLETED" },
      }),
      // Log transaction
      prisma.creditTransaction.create({
        data: {
          amount: task.credits,
          reason: "TASK_PAYMENT",
          status: "COMPLETED",
          note: `Payment for task: ${task.title}`,
          fromId: task.posterId,
          toId: task.acceptorId,
          taskId,
        },
      }),
      // Audit log
      prisma.auditLog.create({
        data: {
          action: "TASK_COMPLETED",
          userId: session.user.id,
          meta: { taskId, credits: task.credits, acceptorId: task.acceptorId },
        },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[COMPLETE TASK ERROR]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}