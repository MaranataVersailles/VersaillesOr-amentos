import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas que NÃO precisam de autenticação
  const publicPaths = ["/login", "/api/auth/login", "/api/auth/logout"];
  const isPublic =
    publicPaths.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico" ||
    pathname === "/logo.png" ||
    pathname === "/sw.js" ||
    pathname === "/manifest.webmanifest";

  if (isPublic) {
    return NextResponse.next();
  }

  // Verificar cookie de autenticação (agora usa hash, não senha pura)
  const authToken = request.cookies.get("auth-token");

  if (!authToken) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const isValid = await verifyToken(authToken.value);

  if (!isValid) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
