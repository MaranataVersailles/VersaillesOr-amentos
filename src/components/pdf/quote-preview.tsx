"use client";

import { Button } from "@/components/ui/button";
import { companyData } from "@/lib/company-data";
import { formatDate, formatCurrencyValue } from "@/lib/formatters";
import { Printer, X } from "lucide-react";

interface QuotePreviewProps {
  client: {
    name: string;
    address: string;
    phone: string;
  };
  quote: {
    quote_number: string;
    date: string;
    delivery_date: string;
    valid_until: string;
    payment_conditions?: string;
    discount?: number;
    notes?: string;
    total: number;
    items: Array<{
      title: string;
      image_url: string;
      width: number;
      height: number;
      glass: string;
      aluminum: string;
      hardware: string;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  };
  onClose: () => void;
}

// formatDate e formatCurrencyValue importados de @/lib/formatters

export function QuotePreview({ client, quote, onClose }: QuotePreviewProps) {
  // O handleDownload agora é puramente nativo. Rápido e infalível.
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      data-pdf-modal
      // Classes print: resolvem o layout para a folha A4 nativamente
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm print:absolute print:inset-0 print:block print:h-auto print:overflow-visible print:bg-transparent print:p-0 print:backdrop-blur-none"
      onClick={onClose}
    >
      {/* Toolbar - Escondida na hora da impressão com print:hidden */}
      <div 
        className="fixed right-4 top-4 z-[60] flex gap-2 print:hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <Button onClick={handlePrint} className="gap-2 font-semibold shadow-lg">
          <Printer className="h-4 w-4" />
          Imprimir / Salvar PDF
        </Button>
        <Button variant="secondary" size="icon" onClick={onClose} className="shadow-lg">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div
        data-pdf-content
        onClick={(e) => e.stopPropagation()}
        // Tiramos a sombra e as margens na hora de imprimir
        className="my-12 w-full max-w-[210mm] bg-white text-black shadow-2xl print:my-0 print:max-w-none print:shadow-none"
        style={{
          fontFamily: "Arial, sans-serif",
          fontSize: "10pt",
          color: "#333",
          padding: "10mm 12mm",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "2px solid #000", paddingBottom: "10px", marginBottom: "12px" }}>
          <div style={{ maxWidth: "60%" }}>
            <h1 style={{ fontSize: "18pt", margin: "0 0 3px 0", fontWeight: "bold" }}>
              {companyData.name.toUpperCase()}
            </h1>
            <div style={{ fontSize: "8pt", color: "#555", marginBottom: "10px" }}>TKZ SISTEMAS</div>
            <p style={{ margin: "2px 0", fontSize: "9pt" }}>ENDEREÇO: {companyData.address}</p>
            <p style={{ margin: "2px 0", fontSize: "9pt" }}>CNPJ: {companyData.cnpj}</p>
            <p style={{ margin: "2px 0", fontSize: "9pt" }}>EMAIL: {companyData.email} &nbsp; CEL: {companyData.cel}</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", minWidth: "200px" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", marginBottom: "8px" }} crossOrigin="anonymous" />
            <h2 style={{ fontSize: "14pt", margin: "0", textAlign: "right" }}>ORÇAMENTO {quote.quote_number}</h2>
            <p style={{ fontSize: "11pt", marginTop: "3px", textAlign: "right" }}>{formatDate(quote.date)}</p>
          </div>
        </div>

        {/* Client Info */}
        <div style={{ border: "1px solid #000", padding: "10px", marginBottom: "15px" }}>
          <p style={{ margin: "4px 0" }}><strong>{client.name.toUpperCase()}</strong></p>
          <p style={{ margin: "4px 0" }}>ENDEREÇO: {client.address}</p>
          <p style={{ margin: "4px 0" }}>CELULAR: {client.phone}</p>
        </div>

        <h2 style={{ textTransform: "uppercase", fontSize: "14pt", fontWeight: "bold", marginBottom: "15px" }}>PRODUTOS</h2>

        {quote.items.map((item, index) => (
          <div
            key={index}
            // A mágica acontece aqui: break-inside-avoid nativo do CSS
            className="print:break-inside-avoid mb-6"
            style={{
              pageBreakInside: "avoid",
              breakInside: "avoid",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", paddingBottom: "15px", borderBottom: "1px solid #ccc" }}>
              {item.image_url && (
                <div style={{ flexBasis: "120px", flexShrink: 0 }}>
                  <img src={item.image_url} alt={item.title} style={{ width: "120px", height: "120px", objectFit: "contain", border: "1px solid #eee" }} crossOrigin="anonymous" />
                </div>
              )}
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ marginBottom: "10px" }}><strong style={{ fontSize: "11pt", textTransform: "uppercase" }}>ITEM {index + 1} - {item.title}</strong></div>
                  <div style={{ fontSize: "9pt" }}>LARGURA: {item.width} &nbsp; ALTURA: {item.height}</div>
                  <div style={{ fontSize: "9pt" }}>
                    <p style={{ margin: "3px 0" }}>COR DO VIDRO: {item.glass}</p>
                    <p style={{ margin: "3px 0" }}>COR DOS ALUMÍNIOS: {item.aluminum}</p>
                    <p style={{ margin: "3px 0" }}>COR DAS FERRAGENS: {item.hardware}</p>
                    <p style={{ margin: "3px 0" }}>QUANTIDADE: {item.quantity}</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", fontSize: "10pt", minWidth: "180px", whiteSpace: "nowrap" }}>
                  {item.unit_price > 0 && <p style={{ margin: "3px 0" }}>VALOR UNITÁRIO: R$ {formatCurrencyValue(item.unit_price)}</p>}
                  <p style={{ margin: "3px 0" }}><strong>VALOR TOTAL: R$ {formatCurrencyValue(item.total_price)}</strong></p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Footer */}
        <div 
          className="print:break-inside-avoid mt-6"
          style={{ 
            pageBreakInside: "avoid", 
            breakInside: "avoid" 
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: "10px", borderTop: "2px solid #000" }}>
            <div>
              {quote.delivery_date && <p style={{ margin: "5px 0", fontSize: "9pt" }}>PREVISÃO DE ENTREGA: <strong>{formatDate(quote.delivery_date)}</strong></p>}
              {quote.valid_until && <p style={{ margin: "5px 0", fontSize: "9pt" }}>ORÇAMENTO VÁLIDO ATÉ: <strong>{formatDate(quote.valid_until)}</strong></p>}
              {quote.payment_conditions && <p style={{ margin: "5px 0", fontSize: "9pt" }}>CONDIÇÕES DE PAGAMENTO: <strong>{quote.payment_conditions}</strong></p>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              {(quote.discount ?? 0) > 0 && (
                <div style={{ padding: "0 15px", marginBottom: "5px", display: "flex", alignItems: "center", gap: "10px", color: "red" }}>
                  <span style={{ fontSize: "11pt" }}>DESCONTO:</span>
                  <span style={{ fontSize: "12pt" }}>- R$ {formatCurrencyValue(quote.discount!)}</span>
                </div>
              )}
              <div style={{ border: "2px solid #000", padding: "12px 15px", borderRadius: "5px", display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "14pt", fontWeight: "bold" }}>TOTAL:</span>
                <span style={{ fontSize: "15pt", fontWeight: "bold" }}>R$ {formatCurrencyValue(quote.total)}</span>
              </div>
            </div>
          </div>
          
          {/* Notes display */}
          {quote.notes && (
            <div style={{ marginTop: "15px", padding: "10px", border: "1px dashed #ccc", backgroundColor: "#f9f9f9" }}>
              <p style={{ margin: "0 0 5px 0", fontWeight: "bold", fontSize: "9pt" }}>OBSERVAÇÕES:</p>
              <p style={{ margin: 0, fontSize: "9pt", whiteSpace: "pre-wrap" }}>{quote.notes}</p>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
            <div style={{ textAlign: "center", width: "300px", borderTop: "1px solid #000", paddingTop: "5px" }}>
              <p style={{ fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>{client.name.toUpperCase()}</p>
            </div>
            <div style={{ textAlign: "center", width: "300px", borderTop: "1px solid #000", paddingTop: "5px" }}>
              <p style={{ fontWeight: "bold", textTransform: "uppercase", margin: 0 }}>{companyData.name.toUpperCase()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}