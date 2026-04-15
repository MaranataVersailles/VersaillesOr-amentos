import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { quotes } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Buscar todos os orçamentos com dados do cliente
    // Para dashboards, as vezes é mais performático trazer os dados necessários e processar no Node
    // do que fazer múltiplas queries complexas no SQLite via edge
    const allQuotes = await db.query.quotes.findMany({
      with: {
        client: true,
      },
      orderBy: [desc(quotes.date)],
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 2. Cálculo de Métricas
    const monthlyRevenue = allQuotes
      .filter((q: typeof quotes.$inferSelect) => {
        const qDate = new Date(q.date || "");
        return (
          (q.status === "aprovado" || q.status === "concluido") &&
          qDate.getMonth() === currentMonth &&
          qDate.getFullYear() === currentYear
        );
      })
      .reduce((sum: number, q: typeof quotes.$inferSelect) => sum + (q.total || 0), 0);

    const pendingCount = allQuotes.filter(
      (q: typeof quotes.$inferSelect) => q.status === "rascunho" || q.status === "enviado"
    ).length;

    const draftCount = allQuotes.filter((q: typeof quotes.$inferSelect) => q.status === "rascunho").length;
    const sentCount = allQuotes.filter((q: typeof quotes.$inferSelect) => q.status === "enviado").length;
    const approvedCount = allQuotes.filter((q: typeof quotes.$inferSelect) => q.status === "aprovado").length;
    const rejectedCount = allQuotes.filter((q: typeof quotes.$inferSelect) => q.status === "recusado").length;
    const completedCount = allQuotes.filter((q: typeof quotes.$inferSelect) => q.status === "concluido" || q.status === "concluído").length;
    const totalCount = allQuotes.length;

    const recentApproved = allQuotes
      .filter((q: typeof quotes.$inferSelect) => q.status === "aprovado" || q.status === "concluido")
      .slice(0, 3)
      .map((q: any) => ({
        id: q.id,
        quoteNumber: q.quoteNumber,
        clientName: q.client?.name || "Cliente não identificado",
        total: q.total,
        date: q.date,
      }));

    // 3. Dados do Gráfico (Últimos 6 meses)
    const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const chartData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setDate(1); // Evitar pulo de mês em dias 31 para meses que vão até dia 30
      d.setMonth(d.getMonth() - i);
      const m = d.getMonth();
      const y = d.getFullYear();

      const revenue = allQuotes
        .filter((q: typeof quotes.$inferSelect) => {
          const qDate = new Date(q.date || "");
          return (
            (q.status === "aprovado" || q.status === "concluido") &&
            qDate.getMonth() === m &&
            qDate.getFullYear() === y
          );
        })
        .reduce((sum: number, q: typeof quotes.$inferSelect) => sum + (q.total || 0), 0);

      chartData.push({
        name: monthNames[m],
        value: revenue,
      });
    }

    return NextResponse.json({
      metrics: {
        monthlyRevenue,
        pendingCount,
        draftCount,
        sentCount,
        approvedCount,
        rejectedCount,
        completedCount,
        totalCount,
      },
      recentApproved,
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Erro ao carregar dados do dashboard" },
      { status: 500 }
    );
  }
}
