import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/quotes/next-number — Retorna o próximo número de orçamento
export async function GET() {
  try {
    const result = await db
      .select({ quoteNumber: quotes.quoteNumber })
      .from(quotes)
      .orderBy(desc(quotes.id))
      .limit(1);

    let nextNumber = 1;

    if (result.length > 0 && result[0].quoteNumber) {
      const lastNumber = parseInt(result[0].quoteNumber);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    return NextResponse.json({ nextNumber: nextNumber.toString() });
  } catch (error) {
    console.error("Erro ao buscar próximo número:", error);
    return NextResponse.json({ nextNumber: "1" });
  }
}
