# 🎙️ NovaNote - Inteligência em Reuniões

> Plataforma completa de transcrição, resumo e gerenciamento de reuniões com IA, inspirada no tl;dv

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?logo=tailwind-css)

## ✨ Funcionalidades

### 🔐 Autenticação e Controle de Acesso
- Sistema de login com design glassmórfico premium
- Controle de acesso baseado em funções (Admin/User)
- Logout funcional com limpeza de sessão
- **Credenciais de teste:**
  - Admin: `admin@novanote.ai` (senha: qualquer)
  - User: qualquer outro email (senha: qualquer)

### 📊 Dashboard Personalizado
- Saudação dinâmica com nome do usuário
- Estatísticas de reuniões, horas gravadas e tasks
- Lista de reuniões recentes com status de processamento
- Totalmente responsivo (mobile-first)

### 📋 Quadro Kanban Interativo
- 3 colunas: Para Fazer, Em Progresso, Concluído
- **Drag-and-drop completo:**
  - 🖱️ Desktop: Click e arraste com o mouse
  - 📱 Mobile: Toque e segure por 250ms, depois arraste
- Cards com prioridade, responsável e data
- Reordenação dentro das colunas
- Visual feedback durante o arrasto

### 📱 Otimização Mobile
- Menu drawer responsivo
- Grids que se adaptam ao tamanho da tela
- Interações touch-friendly
- Testado em iPhone, Android e tablets

### 🎯 Páginas Implementadas
- `/login` - Autenticação
- `/dashboard` - Visão geral
- `/kanban` - Gerenciamento de tarefas
- `/meetings` - Lista de reuniões
- `/meeting/[id]` - Detalhes da reunião com player e transcrição
- `/team` - Gerenciamento de equipe (Admin only)
- `/templates` - Templates de resumo
- `/search` - Busca global
- `/settings` - Configurações (Admin only)

## 🚀 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- PostgreSQL (opcional, para backend completo)
- Redis (opcional, para backend completo)

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/Thiagollalves/tldvantigravity.git
cd tldvantigravity
```

### 2️⃣ Instale as Dependências

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
cd ..
```

### 3️⃣ Configure as Variáveis de Ambiente

#### Frontend (.env.local)
```env
# Gemini AI (opcional)
GEMINI_API_KEY=sua_chave_aqui

# Backend URL
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend (backend/.env)
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/novanote"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT
JWT_SECRET="seu_secret_super_seguro_aqui"

# Gemini AI
GEMINI_API_KEY=sua_chave_aqui

# Storage (opcional)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
AWS_S3_BUCKET=
```

### 4️⃣ Configure o Banco de Dados (Opcional)

Se você quiser rodar o backend completo:

```bash
cd backend

# Gere o Prisma Client
npx prisma generate

# Execute as migrations
npx prisma migrate dev

# (Opcional) Popule com dados de exemplo
npx prisma db seed
```

### 5️⃣ Inicie os Servidores

#### Opção A: Apenas Frontend (Recomendado para teste rápido)
```bash
npm run dev
```
Acesse: http://localhost:3000

#### Opção B: Frontend + Backend
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run start:dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## 📖 Como Usar

### 1. Faça Login
1. Acesse http://localhost:3000/login
2. Use `admin@novanote.ai` para acesso Admin
3. Ou use qualquer outro email para acesso User

### 2. Explore o Dashboard
- Veja suas estatísticas
- Acesse reuniões recentes
- Clique em "Nova Reunião" para criar

### 3. Use o Kanban
1. Acesse `/kanban` no menu lateral
2. **Desktop:** Clique e arraste os cards
3. **Mobile:** Toque e segure por 250ms, depois arraste
4. Mova cards entre colunas ou reordene dentro da mesma coluna

### 4. Gerencie sua Equipe (Admin)
- Acesse `/team` (apenas Admin)
- Convide membros
- Gerencie permissões

## 🛠️ Stack Tecnológica

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Drag-and-drop:** @dnd-kit
- **Ícones:** Lucide React
- **Notificações:** Sonner

### Backend
- **Framework:** NestJS
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL
- **Cache:** Redis
- **IA:** Google Gemini API
- **Processamento:** FFmpeg (extração de áudio)

## 📁 Estrutura do Projeto

```
tldvantigravity/
├── src/
│   ├── app/                    # Páginas Next.js (App Router)
│   │   ├── login/             # Autenticação
│   │   ├── dashboard/         # Dashboard (page.tsx na raiz)
│   │   ├── kanban/            # Quadro Kanban
│   │   ├── meeting/[id]/      # Detalhes da reunião
│   │   ├── team/              # Gerenciamento de equipe
│   │   ├── templates/         # Templates
│   │   ├── search/            # Busca
│   │   └── settings/          # Configurações
│   ├── components/
│   │   ├── layout/            # Sidebar, ClientLayout
│   │   └── ui/                # Componentes shadcn/ui
│   └── lib/                   # Utilitários e configs
├── backend/
│   ├── src/
│   │   ├── auth/              # Autenticação JWT
│   │   ├── meetings/          # CRUD de reuniões
│   │   ├── ai/                # Integração Gemini
│   │   └── common/            # Serviços compartilhados
│   └── prisma/
│       └── schema.prisma      # Schema do banco
└── public/                    # Assets estáticos
```

## 🎨 Design System

- **Tema:** Dark mode premium
- **Efeitos:** Glassmorphism, blur, gradientes
- **Animações:** Transições suaves, micro-interações
- **Responsividade:** Mobile-first, breakpoints: sm, md, lg

## 🔧 Scripts Disponíveis

### Frontend
```bash
npm run dev          # Desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Linter
```

### Backend
```bash
npm run start:dev    # Desenvolvimento
npm run build        # Build
npm run start:prod   # Produção
npm run test         # Testes
```

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Limpe node_modules e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Erro: Prisma Client não encontrado
```bash
cd backend
npx prisma generate
```

### Erro: Porta 3000 já em uso
```bash
# Windows
npx kill-port 3000

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Drag-and-drop não funciona no mobile
- Certifique-se de segurar o card por pelo menos 250ms
- Teste em um dispositivo real ou emulador mobile

## 🚀 Deploy em Produção

### Deploy no Vercel (Frontend)

#### 1. Prepare o Projeto

Certifique-se de que os arquivos `vercel.json` e `.vercelignore` estão presentes na raiz do projeto (já incluídos).

#### 2. Configure Variáveis de Ambiente

No dashboard do Vercel, adicione as seguintes variáveis:

```
GEMINI_API_KEY=sua_chave_gemini
NEXT_PUBLIC_API_URL=https://seu-backend-url.com
```

#### 3. Configure o Build

No dashboard do Vercel:
- **Framework Preset:** Next.js
- **Root Directory:** `./` (raiz do projeto)
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

#### 4. Deploy

```bash
# Instale o Vercel CLI
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

#### 5. Fixing 404 Errors

Se você ver um erro 404 após o deploy:

1. **Verifique o Root Directory** no Vercel Dashboard
   - Deve estar em `./` (não em `src/` ou outro diretório)

2. **Force Redeploy**
   ```bash
   vercel --prod --force
   ```

3. **Verifique as Environment Variables**
   - Certifique-se de que todas as variáveis estão configuradas
   - Redeploy após adicionar variáveis

4. **Check Build Logs**
   - Acesse o Vercel Dashboard > Deployments
   - Clique no deploy com problema
   - Verifique os logs de build para erros

### Deploy do Backend (Railway/Render)

#### Opção A: Railway

```bash
# Instale o Railway CLI
npm i -g @railway/cli

# Login
railway login

# Inicie um novo projeto
cd backend
railway init

# Adicione PostgreSQL
railway add postgresql

# Adicione Redis
railway add redis

# Configure variáveis
railway variables set JWT_SECRET=seu_secret_aqui
railway variables set GEMINI_API_KEY=sua_chave_aqui

# Deploy
railway up
```

#### Opção B: Render

1. Crie um novo Web Service no [Render](https://render.com)
2. Conecte seu repositório GitHub
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
4. Adicione PostgreSQL e Redis como serviços
5. Configure as variáveis de ambiente

### Fluxo Completo de Deploy

```bash
# 1. Commit e push das configurações
git add vercel.json .vercelignore
git commit -m "chore: Add Vercel deployment configuration"
git push origin main

# 2. Deploy do Backend primeiro (Railway/Render)
# Obtenha a URL do backend deployado

# 3. Configure a URL no Vercel
# Adicione NEXT_PUBLIC_API_URL com a URL do backend

# 4. Deploy do Frontend
vercel --prod

# 5. Teste o deploy
# Acesse sua URL do Vercel e teste todas as funcionalidades
```

## 📝 Roadmap

- [ ] Integração real com Gemini AI para transcrição
- [ ] Upload de vídeos/áudios
- [ ] Gravação de tela nativa
- [ ] Exportação para PDF, Notion, Slack
- [ ] Chat com contexto da reunião
- [ ] Autenticação OAuth (Google, Microsoft)
- [ ] Deploy em produção (Vercel + Railway)

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a MIT License.

## 👨‍💻 Autor

**Thiago Alves**
- GitHub: [@Thiagollalves](https://github.com/Thiagollalves)

---

⭐ Se este projeto foi útil, considere dar uma estrela!

**Desenvolvido com ❤️ usando Antigravity AI**
