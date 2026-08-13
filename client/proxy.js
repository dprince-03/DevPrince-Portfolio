import { NextResponse } from "next/server";

export default function proxy(request) {
  const hasSession = request.cookies.has("session");

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
