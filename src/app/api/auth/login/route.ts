import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { getRateLimitStatus, registerFailedLogin, resetLoginAttempts } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Obter IP para Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown_ip";
    
    // 1. Checa se já está bloqueado ANTES de processar
    const status = getRateLimitStatus(ip);
    if (status.blocked) {
      return NextResponse.json({ error: status.message }, { status: 429 }); // 429 Too Many Requests
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Senha é obrigatória." },
        { status: 400 }
      );
    }

    const correctPassword = process.env.APP_PASSWORD;

    if (password !== correctPassword) {
      // 2. Se a senha errou, registra a falha no rate limiter
      const failStatus = registerFailedLogin(ip);
      
      if (failStatus.blocked) {
        return NextResponse.json({ error: failStatus.message }, { status: 429 });
      }

      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

    // 3. Sucesso! Reseta as tentativas e faz o login.
    resetLoginAttempts(ip);

    // Gerar hash seguro para armazenar no cookie (nunca a senha em texto puro)
    const token = await hashPassword(password);

    const response = NextResponse.json({ success: true });

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 dias
      path: "/",
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
