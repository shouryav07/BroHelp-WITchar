import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id: taskId } = await params

  try {
    const task = await prisma.task.findUnique({ where: { id: taskId } })

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 })
    if (task.status !== "OPEN") return NextResponse.json({ error: "Task is no longer available" }, { status: 400 })
    if (task.posterId === session.user.id) return NextResponse.json({ error: "You cannot accept your own task" }, { status: 400 })

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "IN_PROGRESS",
        acceptorId: session.user.id,
      },
    })

    await prisma.auditLog.create({
      data: { action: "TASK_ACCEPTED", userId: session.user.id, meta: { taskId, posterId: task.posterId } },
    })

    return NextResponse.json({ task: updated })
  } catch (err) {
    console.error("[ACCEPT TASK ERROR]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}