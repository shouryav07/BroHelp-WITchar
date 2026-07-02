import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          await prisma.auditLog.create({
            data: { action: "LOGIN_FAILED", meta: { email: credentials.email, reason: "User not found" } },
          })
          return null
        }

        if (user.isBanned) {
          await prisma.auditLog.create({
            data: { action: "LOGIN_BLOCKED_BANNED", userId: user.id, meta: { reason: user.banReason } },
          })
          return null
        }

        const valid = await bcrypt.compare(credentials.password as string, user.password)

        if (!valid) {
          await prisma.auditLog.create({
            data: { action: "LOGIN_FAILED", userId: user.id, meta: { reason: "Wrong password" } },
          })
          return null
        }

        await prisma.auditLog.create({
          data: { action: "LOGIN_SUCCESS", userId: user.id },
        })

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.credits = (user as any).credits
        token.name = (user as any).name
        token.image = (user as any).image
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).credits = token.credits
        ;(session.user as any).name = token.name
        ;(session.user as any).image = token.image
      }
      return session
    },
  },
  events: {
    async signOut(message) {
      const token = (message as any).token
      if (token?.id) {
        await prisma.auditLog.create({
          data: { action: "LOGOUT", userId: token.id as string },
        })
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})