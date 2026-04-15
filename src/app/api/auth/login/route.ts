import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "Senha é obrigatória." },
        { status: 400 }
      );
    }

    const correctPassword = process.env.APP_PASSWORD;

    if (password !== correctPassword) {
      return NextResponse.json({ error: "Senha incorreta." }, { status: 401 });
    }

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
