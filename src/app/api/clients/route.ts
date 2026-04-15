import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clients } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/clients — Retorna os clientes cadastrados
export async function GET() {
  try {
    const result = await db
      .select()
      .from(clients)
      .orderBy(desc(clients.id));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return NextResponse.json(
      { error: "Erro ao buscar clientes." },
      { status: 500 }
    );
  }
}
