"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  CircleCheckBig,
  ArrowUpRight,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BentoGrid } from "@/components/dashboard/dashboard-cards";
import { DashboardCard } from "@/components/dashboard/dashboard-cards";
import { QuickNotes } from "@/components/dashboard/quick-notes";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RecentQuotes } from "@/components/dashboard/recent-quotes";
import { formatCurrency } from "@/lib/formatters";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  metrics: {
    monthlyRevenue: number;
    pendingCount: number;
    draftCount: number;
    sentCount: number;
    approvedCount: number;
    rejectedCount: number;
    completedCount: number;
    totalCount: number;
  };
  recentApproved: {
    id: number;
    quoteNumber: string;
    clientName: string;
    total: number;
    date: string;
  }[];
  chartData: {
    name: string;
    value: number;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-[250px] md:col-span-2" />
          <Skeleton className="h-[250px]" />
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px] md:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 noise-overlay">
      {/* Header com Boas-vindas */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Versailles</h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo de volta! Aqui está o resumo da sua vidraçaria.
          </p>
        </div>
        <Button 
          onClick={() => router.push("/novo")}
          className="group h-12 px-6 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
        >
          <Plus className="h-5 w-5 transition-transform group-hover:rotate-90" />
          <span className="font-semibold">Novo Orçamento</span>
        </Button>
      </motion.div>

      <BentoGrid>
        {/* Card 1: Faturamento Mensal (Destaque) */}
        <DashboardCard 
          title="Faturamento do Mês" 
          className="md:col-span-2"
          icon={<TrendingUp className="h-4 w-4" />}
          delay={0.1}
        >
          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black tracking-tighter text-primary">
                {formatCurrency(data?.metrics.monthlyRevenue || 0)}
              </span>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                Aprovados
              </span>
            </div>
            <RevenueChart data={data?.chartData || []} />
          </div>
        </DashboardCard>

        {/* Card 2: Visão Geral dos Status */}
        <DashboardCard 
          title="Visão Geral" 
          icon={<BarChart3 className="h-4 w-4" />}
          delay={0.2}
        >
          <div className="flex flex-col h-full justify-between py-1">
            <div className="space-y-3">
              {/* Rascunhos */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Rascunhos</span>
                </div>
                <span className="text-lg font-black tracking-tighter">{data?.metrics.draftCount ?? 0}</span>
              </div>

              {/* Enviados */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Send className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Enviados</span>
                </div>
                <span className="text-lg font-black tracking-tighter">{data?.metrics.sentCount ?? 0}</span>
              </div>

              {/* Aprovados */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <ThumbsUp className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Aprovados</span>
                </div>
                <span className="text-lg font-black tracking-tighter text-primary">{data?.metrics.approvedCount ?? 0}</span>
              </div>

              {/* Recusados */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive">
                    <ThumbsDown className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Recusados</span>
                </div>
                <span className="text-lg font-black tracking-tighter text-destructive">{data?.metrics.rejectedCount ?? 0}</span>
              </div>

              {/* Concluídos */}
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary/80">
                    <CircleCheckBig className="h-4 w-4" />
                  </div>
                  <span className="text-sm">Concluídos</span>
                </div>
                <span className="text-lg font-black tracking-tighter">{data?.metrics.completedCount ?? 0}</span>
              </div>
            </div>

            <div className="mt-4 border-t border-border/50 pt-3 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Total: <span className="font-bold text-foreground">{data?.metrics.totalCount ?? 0}</span> orçamentos
              </p>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => router.push("/orcamentos")}>
                Ver todos <ArrowUpRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </DashboardCard>

        {/* Card 3: Sucessos Recentes */}
        <div className="md:col-span-2">
          <DashboardCard 
            title="Sucessos Recentes" 
            icon={<CheckCircle2 className="h-4 w-4" />}
            delay={0.2}
          >
            <RecentQuotes quotes={data?.recentApproved || []} />
            <div className="mt-6 flex justify-center">
              <Button 
                variant="outline" 
                className="w-full max-w-xs text-xs uppercase tracking-widest font-bold border-primary/20 hover:bg-primary/5"
                onClick={() => router.push("/orcamentos")}
              >
                Ver todos os orçamentos
              </Button>
            </div>
          </DashboardCard>
        </div>

        {/* Card 4: Anotações Rápidas */}
        <div className="md:col-span-1">
          <QuickNotes />
        </div>
      </BentoGrid>
    </div>
  );
}
