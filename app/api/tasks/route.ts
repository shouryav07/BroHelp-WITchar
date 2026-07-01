import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { title, description, category, credits, estimatedTime, location, isRemote, tags, expiresAt } = await req.json()

    if (!title || !description || !credits || !estimatedTime) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (credits <= 0) {
      return NextResponse.json({ error: "Credits must be greater than 0" }, { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category: category || null,
        credits: parseFloat(credits),
        estimatedTime: parseInt(estimatedTime),
        location: location || null,
        isRemote: isRemote ?? true,
        tags: tags || [],
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        posterId: session.user.id,
      },
    })

    await prisma.auditLog.create({
      data: { action: "TASK_CREATED", userId: session.user.id, meta: { taskId: task.id, title } },
    })

    return NextResponse.json({ task })
  } catch (err) {
    console.error("[CREATE TASK ERROR]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const category = searchParams.get("category")
  const minCredits = searchParams.get("minCredits")
  const maxCredits = searchParams.get("maxCredits")
  const isRemote = searchParams.get("isRemote")
  const status = searchParams.get("status") || "OPEN"

  const tasks = await prisma.task.findMany({
    where: {
      status: status as any,
      ...(category && { category }),
      ...(isRemote !== null && isRemote !== "" && { isRemote: isRemote === "true" }),
      ...(minCredits || maxCredits
        ? {
            credits: {
              ...(minCredits && { gte: parseFloat(minCredits) }),
              ...(maxCredits && { lte: parseFloat(maxCredits) }),
            },
          }
        : {}),
    },
    include: {
      poster: {
        select: { id: true, name: true, image: true, rating: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ tasks })
}