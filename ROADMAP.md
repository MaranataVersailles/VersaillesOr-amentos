# Status de Desenvolvimento - Versailles

Este arquivo documenta o progresso do desenvolvimento, o estado atual do projeto e os próximos passos para guiar futuras interações e o planejamento de novas funcionalidades.

## 🛠️ Tecnologias Principais
- **Framework**: Next.js 16 (App Router)
- **Banco de Dados**: Turso (SQLite) com Drizzle ORM
- **Estilos e UI**: Tailwind CSS + Shadcn/UI (lucide-react, cards, etc)
- **Hospedagem (Assets/Imagens)**: Vercel Blob API

---

## ✅ Funcionalidades Implementadas (O que já está pronto)

### Fase 1: Segurança e Dívida Técnica
- Implementado hashing real **SHA-256** para as senhas (em `src/lib/auth.ts`).
- Criação e ativação do `src/middleware.ts` para proteção segura das rotas do painel.
- Centralização de código (`formatDate` e `formatCurrency`) para o `src/lib/formatters.ts`, limpando o PDF e a listagem.

### Fase 2: Automação Numérica
- Foi criada a rota dinâmica para **Numeração Automática**. Ao iniciar um novo formulário, o sistema descobre autonomamente o último orçamento criado e preenche a numeração com lógica limpa (ex: preenche `013`).

### Fase 3: Acompanhamento e Agilidade (Status & Duplicação)
- Adicionado campo de **Status** (`rascunho`, `enviado`, `aprovado`, `recusado`, `concluído`) direto no Banco de Dados (`schema.ts`).
- Interface do formulário e tabelas atualizada para exibir os status com cores.
- Botão mágico de **Duplicar Orçamento**. Ele clona o orçamento principal junto de todos os itens do orçamento para evitar retrabalho com variações do cliente.

### Fase 4: Busca Rápida
- Inserido um campo de pesquisa e filtros na tela inicial (`orcamentos/page.tsx`), conseguindo varrer instantaneamente a busca por "Nome do Cliente" ou "Número do Orçamento".

### Fase 5: Memória do Cliente (Autocomplete)
- Foi criado o endpoint dinâmico `/api/clients`.
- No formulário de orçamento, usar o input "Nome do Cliente" agora sugere clientes já salvos anteriormente na base, autocompletando o `Endereço` e `Telefone` dinamicamente com base nas consultas prévias.

### Fase 6: Flexibilidade Financeira e WhatsApp
- Inserção de novos campos cruciais no DB: **Descontos (R$)**, **Condições de Pagamento** e **Observações**.
- O **Preview em PDF** (`quote-preview.tsx`) foi completamente expandido e agora exibe com elegância o desconto de abates (e recálculo da diferença), as parcelas acordadas, e o campo formatado de nota final.
- Botão **"Enviar para WhatsApp"** na tela de listagem, configurado para puxar o telefone salvo do cliente e enviar uma pré-mensagem educada formatada e gerada pela própria ferramenta com o link / resumo do orçamento na web (usando o `wa.me`).

---

## 🚀 Próximos Passos e Planejamento Futuro

Daqui em diante, quando for retomar o projeto, as Fases primordiais para escalar o valor visual e a UX do gerente são:

### Fase 7: Dashboard Financeiro (Prioridade)
A home da aplicação (`/`) atualmente cai em um longo formulário de entrada livre. A ideia é:
1. Transferir o formulário de orçamentos para uma _rota filha_ (`/novo` ou no próprio modal/popover).
2. Deixar a página `/` como um poderoso **Dashboard Pessoal**. 
   - Exibir gráficos de barras simples do que faturou no mês (status 'Aprovado' / 'Concluído').
   - Contabilizar quantos orçamentos restam parados em "Rascunho" ou "Enviado".
   - Botão rápido ("Call to Action"): `+ Novo Orçamento`.

### Fase 8: Referências Visuais (Drag & Drop)
Ajustar o funcionamento de envio de fotos nos **"Itens do Orçamento"**:
1. Implementar uma área drop zone.
2. Permitir arrastar múltiplas fotos de referência do aparelho/notebook diretamente pra caixa, e enviar elas em lote (ou em paralelo) para o Vercel Blob, reduzindo atritos do botão tradicional `<input type="file">`.

### Fase 9: Aprimoramento (PWA & Dark Mode)
- Criar a chave para alternar dinamicamente o visual para `Dark Mode` e garantir que tabelas, inputs e textos não percam constrastes no Shadcn.
- Validar se todas as manifestações do PWA web (`manifest.json` com ícones da maçã/android) interagem e geram prompts de instalação confiáveis nativamente nos dispositivos móveis.

---

### Fase 10: UX/UI da Tela de Formulário de Orçamento (Análise por UX Psychology)

> Diagnóstico feito em 14/04/2025. Baseado nas leis de Hick, Fitts, Miller, Von Restorff e Serial Position.

#### Problemas identificados:
- **Miller's Law**: Um item tem 9 campos com mesma aparência visual — sobrecarga cognitiva.
- **Hick's Law**: Campo "Status" aparece cedo no fluxo, mas é uma decisão secundária.
- **Fitts' Law**: "Salvar" e "Preview PDF" têm mesmo peso visual — CTA principal não se destaca.
- **Von Restorff**: Total final `R$ ****` tem quase nenhum destaque visual — é o número mais importante da tela.
- **Serial Position**: "Nome do Cliente" (campo mais importante) não tem destaque diferenciado.

#### Melhorias planejadas (por prioridade):

**🥇 Alta prioridade:**
- [ ] **Total sticky na barra inferior**: Barra fixa no rodapé da tela exibindo subtotal, desconto e total final enquanto o usuário preenche — inspirado no carrinho de e-commerce. Botões "PDF" e "Salvar" vivem ali.
- [ ] **"Especificações Técnicas" colapsável em cada item**: Campos de Cor do Vidro, Alumínio e Ferragens ficam dentro de um acordeão/collapsible. Reduz poluição visual e resolve layout quebrado em mobile.

**🥈 Média prioridade:**
- [ ] **Nome do cliente com destaque visual**: Input com altura `h-12`, leve fundo tintado `bg-primary/5` e texto levemente maior. É o campo mais importante do formulário.
- [ ] **Preview PDF em Drawer lateral (Sheet do shadcn)**: Em vez de tomar a tela toda, abrir o preview num painel deslizante lateral para o usuário comparar formulário e PDF lado a lado.
- [ ] **Reorganização da ordem das seções**: 
  - Atual: Cliente → Detalhes → Itens → Condições → Total
  - Ideal: Cliente → Itens → Condições de Pagamento → Datas/Status → Total

**🥉 Baixa prioridade (polish):**
- [ ] **Animação ao adicionar item**: Novo item entra com `fade + slide down` (Framer Motion `AnimatePresence`).
- [ ] **Animação ao remover item**: Item sai com `slide up + fade out` — deixa claro o que foi removido.
- [ ] **Campo "Total do Item" com animação de contador**: Ao mudar qtd × preço, o número "anima" para o novo valor (sensação de que o sistema está vivo).
- [ ] **Hierarquia visual nos inputs**: Diferenciar visualmente campos calculados (somente leitura) dos editáveis com `bg-muted/50`.

