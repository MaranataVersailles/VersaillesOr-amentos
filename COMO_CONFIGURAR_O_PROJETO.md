# 🚀 Como fazer o projeto funcionar como esperado

Como mudamos o sistema para uma arquitetura moderna (preparada para rodar **100% de graça e rápido** na Vercel), o site parou de salvar imagens e bancos de dados em uma "pastinha local" (já que serviços de nuvem apagam pastas locais quando reiniciam).

Para poder criar orçamentos e escolher imagens no "Select" novamente, você **precisa** concluir o cadastro nesses dois serviços abaixo e preencher o seu arquivo `.env.local`.

Siga este passo a passo e ele voltará a funcionar imediatamente!

---

## Passo 1: Configurar o Banco de Dados (Turso / SQLite)

O Turso é o nosso novo banco de dados distribuído que usa SQLite (a mesma tecnologia que você já usava). Ele é perfeito e gratuito.

1. Acesse: [https://turso.tech/](https://turso.tech/) e crie uma conta gratuita (você pode logar com o GitHub).
2. No painel principal (Dashboard), clique no botão para criar um novo Banco de Dados (ex: `versailles-db`).
3. Quando o banco for criado, você verá a página de overview dele. Procure por duas credenciais muito importantes e copie para o seu `.env.local`:
   - **URL do Banco** (geralmente começa com `libsql://...`): Cole em `TURSO_DATABASE_URL=`.
   - **Token de Acesso (Auth Token):** (Fica no botão de gerar token / connect). Cole em `TURSO_AUTH_TOKEN=`.
4. Uma vez que o `.env.local` estiver preenchido com isso, abra um novo terminal no seu VS Code e rode:
   ```bash
   npx drizzle-kit push
   ```
   _(Este comando vai ler os seus arquivos e criar as tabelas `clients`, `quotes` e `quote_items` vazias lá na nuvem automaticamente!)_

---

## Passo 2: Configurar o Armazenamento de Imagens (Vercel Blob)

Para as fotos aparecerem no "Select" (Box de vidro, por exemplo) para você poder escolher na hora de criar o orçamento, as fotos precisam estar hospedadas na nuvem. Nós usamos o próprio serviço da Vercel para isso.

1. Acesse a Vercel [https://vercel.com/](https://vercel.com/) e faça login.
2. Na aba de "Storage" (Armazenamento), selecione a opção **Vercel Blob** e crie um novo.
3. No painel após a criação, a Vercel vai te mostrar algumas chaves e tokens pra você conectar o app nela.
4. Procure pela chave chamada `BLOB_READ_WRITE_TOKEN`.
5. Copie o valor que eles gerarem (é algo grande tipo `vercel_blob_rw_...`) e cole dentro do `BLOB_READ_WRITE_TOKEN=` no seu `.env.local`.

---

## Passo 3: Colar Imagens Iniciais (Apenas na 1º vez)

Agora que você tem o Blob ativo, você precisará hospedar algumas fotos lá uma primeira vez para elas começarem a aparecer no sistema de Novo Orçamento.

- **Opção A (Fácil):** No próprio painel da Vercel (onde você gerou o Token), tem uma interface onde diz "Upload Files". Você pode arrastar as fotos das suas esquadrias, ferragens, etc. pra lá! Na mesma hora que você subir, elas já vão aparecer no seu site no momento de clicar em escolher Imagem!
- **Opção B (Pelo Site futuramente):** Você pode criar uma tela para si mesmo no painel do Projeto Versailles pra ficar subindo essas requisições.

---

## Passo 4: Como colocar no AR (Deploy final)

Quando o site estiver rodando lindo na sua máquina após seguir os 3 passos acima, você pode colocar ele online:

1. Publique esse projeto atualizado no GitHub.
2. Vá até a Vercel e clique em "Add New Project" importing desse Github.
3. **MUITO IMPORTANTE:** Durante a criação na Vercel, na seção de painel em **"Environment Variables"**, adicione as mesmas 4 variáveis que você colou aqui no seu arquivo `.env.local` uma por uma. (Sem colocar lá, a versão pública online vai quebrar).
4. Clique em Deploy!

---

**Resumo de Onde Fica Suas Senhas:**
Lembrete: Você é quem dita as regras. A senha padrão provisória de acesso está configurada no `.env.local` como `APP_PASSWORD=versailles2026`. Se quiser alterar, basta alterar ali mesmo!

##

Com certeza! Para ficar bem fácil de entender o motivo desses dois passos, precisamos entender como a Vercel (onde você vai hospedar o site de graça) funciona.

Antigamente, as empresas alugavam um "servidor" (um computador ligado 24h). Nele, você salvava as fotos numa pasta e o banco de dados em um arquivinho lá.

A Vercel é o que chamamos de "Serverless" (Sem Servidor). Como isso funciona? Quando alguém acessa seu site, a Vercel liga um computador super-rápido, mostra o site e desliga o computador. Isso significa que se você tentar salvar uma foto numa pasta local ou tentar salvar um orçamento em um arquivo, ele será apagado 5 minutos depois quando o sistema desligar o robozinho.

É para resolver isso que usamos o Turso (Passo 1) e o Blob (Passo 2).

Passo 1 (Turso): O Cofre de Textos (Banco de Dados)
O Turso vai ser o responsável por guardar apenas textos e números: Como os dados dos clientes, os preços, os endereços e os valores dos orçamentos.

Por que escolhemos ele? Seu sistema antigo usava um banco de dados levinho chamado "SQLite". O Turso é a única empresa hoje que pegou esse mesmo banco levinho e colocou "nas nuvens" de graça.

Quando você loga no site do Turso.tech, cadastra e clica para "Criar Banco" e dá um nome, ele te dá um link e uma chave.
Colocamos esse link lá no seu VS Code (no .env.local).
Quando a gente rodar o comando especial (npx drizzle-kit push), o seu código sai do seu computador, viaja no ar, bate no site do Turso e fala: "Opa, cria aí uma tabela de clientes e uma de orçamentos". A partir daí, pra sempre que você gerar um orçamento na tela do sistema, seu site manda a informação para ficar salva nesse "cofre" da Turso (que nunca é apagado).
Passo 2 (Vercel Blob): O "Google Drive" de Fotos
Bancos de dados ODEIAM guardar imagens. Imagens são pesadas e travam eles. A Vercel (onde você publicará o site) tem um serviço próprio só para guardar imagens, chamado Vercel Blob (Blob é como chamamos grandes arquivos na programação).

Como ele funciona? Imagine ele como um Google Drive especial para o seu site.

Na sua conta geral da Vercel, tem a aba "Storage" (Armazenamento).
Você cria um Blob. Nesse momento ele te entrega uma "chave da porta" (o famoso BLOB_READ_WRITE_TOKEN).
Com essa chave configurada, sabe aquele Select de "Imagem: Nenhuma"? Ele usa a chave para perguntar pra Vercel: "Quais imagens o dono da Versailles botou nesse Drive?". E ai ele mostra a lista pra você escolher!
Para as imagens aparecerem lá no Select, você só precisa upar elas no Google Drive do seu projeto de Gerenciador pela própria interface do Vercel Web.
Ficou mais fácil de visualizar agora qual é o papel que eles 2 fazem e o porquê deles serem os substitutos perfeitos para seu sistema rodar online na Vercel? Quando quiser que comecemos, podemos criar o do Turso pra testar!
