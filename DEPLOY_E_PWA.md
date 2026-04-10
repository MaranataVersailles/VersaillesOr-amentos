# 📋 Plano de Deploy + PWA — Gerador de Orçamentos Versailles

> **Data:** 08/04/2026  
> **Status:** Pendente — Aguardando decisão do usuário

---

## 🎯 Objetivo

Colocar o projeto online (deploy) e transformá-lo em um app instalável no celular Android via **PWA (Progressive Web App)**.

---

## 📊 Análise do Projeto

O projeto tem 3 dependências que impactam o deploy:

| Dependência | Uso | Impacto |
|---|---|---|
| **Puppeteer** | Gera PDFs com Chrome headless | Precisa de Chromium (~400MB), elimina Vercel/Netlify |
| **SQLite** | Banco de dados em arquivo local (`data/orcamentos.db`) | Perde dados em redeploy sem disco persistente |
| **Filesystem** | Uploads (`public/uploads/`) e PDFs (`data/`) | Precisa de armazenamento persistente |

---

## 🚀 Opções de Deploy Avaliadas

### ⭐ Opção 1: Render com Docker (Recomendada)
- **Custo:** ~$7/mês (plano Starter)
- **Dificuldade:** Fácil
- **Requer:** Dockerfile + conta no Render + repositório no GitHub
- **SQLite:** Usar disco persistente ($0.25/GB/mês) OU migrar para PostgreSQL

### Opção 2: VPS (Contabo/Hetzner)
- **Custo:** ~$4-6/mês
- **Dificuldade:** Média (precisa configurar SSH, Nginx, PM2, Certbot)
- **Vantagem:** Controle total, SQLite funciona sem problemas

### ❌ Descartadas
- **Vercel / Netlify** — Não suportam Puppeteer
- **APK nativo** — Inviável sem reescrever o projeto inteiro

---

## ✅ O que precisa ser feito

### Fase 1: Preparar para Deploy
- [ ] Mudar porta para dinâmica: `process.env.PORT || 3000` em `server.js`
- [ ] Criar `Dockerfile` na raiz do projeto
- [ ] Criar `.dockerignore`
- [ ] Verificar que `.gitignore` inclui: `node_modules`, `.env`, `data/*.db`, `data/*.pdf`
- [ ] Decidir: manter SQLite (disco persistente) ou migrar para PostgreSQL

### Fase 2: Deploy
- [ ] Criar conta na plataforma escolhida (Render ou VPS)
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente (PORT, MAIL_HOST, MAIL_PORT, etc.)
- [ ] Fazer primeiro deploy e testar

### Fase 3: PWA (Após deploy funcionando)
- [ ] Criar `manifest.json` em `public/` (nome do app, ícones, cores)
- [ ] Criar Service Worker (`sw.js`) para cache básico
- [ ] Gerar ícones do app (192x192 e 512x512)
- [ ] Adicionar meta tags no `index.html` para PWA
- [ ] Testar "Adicionar à tela inicial" no Chrome Android

### Fase 4: Extras (Opcional)
- [ ] Configurar domínio próprio (ex: orcamentos.versailles.com.br)
- [ ] HTTPS com Certbot (se VPS)
- [ ] Migrar SQLite → PostgreSQL para robustez em produção

---

## 📝 Mudanças de Código Necessárias

### `server.js` — Porta dinâmica
```javascript
// DE:
const port = 3000;

// PARA:
const port = process.env.PORT || 3000;
```

### Novo arquivo: `Dockerfile`
```dockerfile
FROM ghcr.io/puppeteer/puppeteer:latest
WORKDIR /app
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN mkdir -p data public/uploads
EXPOSE 3000
CMD ["node", "server.js"]
```

### Novo arquivo: `.dockerignore`
```
node_modules
.git
.env
data/*.db
data/*.pdf
```

---

## 💡 Decisões Pendentes

1. **Qual plataforma de deploy?** Render (fácil) ou VPS (barato + controle total)?
2. **Manter SQLite ou migrar para PostgreSQL?**
3. **Precisa de domínio próprio?**
