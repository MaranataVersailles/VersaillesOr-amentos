/**
 * Funções de formatação reutilizáveis.
 * Centralizadas aqui para evitar duplicação.
 */

/**
 * Formata uma string de data ISO para o formato brasileiro (dd/mm/aaaa).
 * Corrige o offset de timezone para evitar datas erradas.
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const offset = d.getTimezoneOffset() * 60000;
  const corrected = new Date(d.getTime() + offset);
  return corrected.toLocaleDateString("pt-BR");
}

/**
 * Formata um número para o formato de moeda brasileira (R$ 1.234,56).
 */
export function formatCurrency(value: number): string {
  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/**
 * Formata um número sem o prefixo "R$", apenas o valor (1.234,56).
 * Usado para contextos onde o "R$" já aparece separado.
 */
export function formatCurrencyValue(value: number): string {
  return Number(value).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
