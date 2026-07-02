import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const { nextUrl } = req

  // NextAuth v5 uses these cookie names
  const sessionToken =
    req.cookies.get("authjs.session-token") ??
    req.cookies.get("__Secure-authjs.session-token") ??
    req.cookies.get("next-auth.session-token") ??
    req.cookies.get("__Secure-next-auth.session-token")

  const isLoggedIn = !!sessionToken
  const isPublic = ["/", "/login", "/register"].includes(nextUrl.pathname)

  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", nextUrl))
  }

  if (isLoggedIn && ["/login", "/register"].includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}