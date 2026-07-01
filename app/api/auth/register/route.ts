import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    // const existingUsername = await prisma.user.findUnique({ where: { name } })
    // if (existingUsername) {
    //   return NextResponse.json({ error: "Username already taken" }, { status: 400 })
    // }

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { email, password: hashed, name },
    })

    await prisma.auditLog.create({
      data: {
        action: "USER_REGISTERED",
        userId: user.id,
        meta: { email, name },
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[REGISTER ERROR]", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}