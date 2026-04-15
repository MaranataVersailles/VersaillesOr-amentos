"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface RecentQuote {
  id: number;
  quoteNumber: string;
  clientName: string;
  total: number;
  date: string;
}

interface RecentQuotesProps {
  quotes: RecentQuote[];
}

export function RecentQuotes({ quotes }: RecentQuotesProps) {
  if (quotes.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground py-8">
        <p className="text-sm">Nenhum orçamento aprovado recentemente.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotes.map((quote, index) => (
        <motion.div
          key={quote.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
          className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 transition-colors hover:bg-accent/5"
        >
          <div className="flex flex-col gap-1">
            <span className="text-sm font-semibold tracking-tight">
              {quote.clientName}
            </span>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] h-4 font-mono px-1">
                #{quote.quoteNumber}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDate(quote.date)}
              </span>
            </div>
          </div>
          <div className="text-sm font-bold text-primary">
            {formatCurrency(quote.total)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
