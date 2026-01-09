# NovaNote - IA para Reuniões

Este é um projeto SaaS inspirado no tl;dv para gravação, transcrição e resumo inteligente de reuniões.

## 🚀 Tecnologias
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Design**: Shadcn/UI (custom), Framer Motion, Glassmorphism
- **Backend**: Next.js Server Actions & API Routes
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **IA**: Whisper (Transcrição) e GPT-4/Claude (Resumo e Chat)

## 🛠️ Como Rodar Localmente

1. **Clone o repositório**
2. **Instale as dependências**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente**
   Crie um arquivo `.env` com as seguintes chaves:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/novanote"
   NEXTAUTH_SECRET="seu-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   OPENAI_API_KEY="..."
   ```
4. **Prepare o Banco de Dados**
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

## 📂 Estrutura do Projeto
- `src/app`: Páginas e rotas da aplicação (App Router)
- `src/components`: Componentes UI e Layout
- `src/lib`: Utilitários e instâncias (Prisma, etc.)
- `prisma/`: Definições do banco de Dados

## 🤖 Prompts de IA
Os prompts detalhados para transcrição, resumo e chat estão localizados no arquivo de documentação técnica interna.

## 🔒 Privacidade e LGPD
A plataforma inclui avisos de gravação automáticos e controle total sobre a exclusão de dados dos usuários, em conformidade com as leis de privacidade.
