# 🏗️ Berlim SaaS - Sistema de Gestão de Obras

Sistema moderno e inteligente para gerenciar obras, demandas, funcionários e materiais em projetos de construção.

## ✨ Características

- **Dashboard em Tempo Real**: Visualize métricas e demandas críticas
- **Gestão de Obras**: Crie e acompanhe projetos completos
- **Gerenciamento de Demandas**: Organize tarefas com prioridades e prazos
- **Equipe**: Cadastre funcionários e aloque em obras
- **Estoque de Materiais**: Controle preços e quantidade disponível
- **Autenticação Segura**: Login e registro com Supabase
- **Dark Mode**: Interface adaptável ao modo claro/escuro
- **Responsivo**: 100% adaptável para mobile e desktop

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ (com npm ou yarn)
- Conta Supabase ativa
- Git

### Instalação

1. **Clone ou acesse o diretório**
   ```bash
   cd berlim-saas
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   
   Edite `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://seu-project.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
   VITE_ENV=development
   ```

   **Como obter as credenciais Supabase:**
   1. Acesse [supabase.com](https://supabase.com)
   2. Crie um novo projeto ou acesse um existente
   3. Vá para Project Settings → API
   4. Copie o URL do projeto e a chave anon (pública)

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

   A aplicação abrirá automaticamente em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
berlim-saas/
├── frontend/
│   ├── src/
│   │   ├── App.tsx              # Componente raiz com roteamento
│   │   ├── main.tsx             # Ponto de entrada
│   │   ├── components/
│   │   │   └── Navigation.tsx    # Menu lateral e mobile
│   │   ├── pages/
│   │   │   ├── Login.tsx         # Página de autenticação
│   │   │   ├── Dashboard.tsx     # Painel principal
│   │   │   ├── Obras.tsx         # Gestão de projetos
│   │   │   ├── Demandas.tsx      # Gestão de tarefas
│   │   │   ├── Funcionarios.tsx  # Gestão de equipe
│   │   │   └── Materiais.tsx     # Controle de estoque
│   │   ├── services/
│   │   │   └── supabase.ts       # Cliente Supabase com CRUD
│   │   ├── types/
│   │   │   └── index.ts          # Tipos TypeScript
│   │   └── styles/
│   │       ├── index.css         # Estilos globais
│   │       └── tokens.css        # Design tokens
│   ├── index.html                # HTML principal
│   ├── vite.config.ts           # Configuração do Vite
│   └── tsconfig.json            # Configuração TypeScript
├── supabase/                     # Migrationss e configurações do banco
├── .env.local                    # Variáveis de ambiente
├── package.json                  # Dependências
└── tailwind.config.js           # Configuração do Tailwind CSS
```

## 🎨 Design System

O Berlim SaaS utiliza um design system profissional baseado em:

- **Paleta de Cores**: Indigo primário com verde como cor de sucesso
- **Tipografia**: Sistema de tipos estruturado (12px - 36px)
- **Espaçamento**: Grid 8pt para consistência
- **Animações**: Transições fluidas em 150-300ms
- **Acessibilidade**: Contraste WCAG AA+, suporte a reduced motion

## 🗄️ Banco de Dados

O Supabase fornece automaticamente:

- **Autenticação** com email/senha
- **PostgreSQL** para armazenamento de dados
- **Storage** para fotos e arquivos
- **Realtime** para atualizações em tempo real

### Tabelas Principais

- `obras` - Projetos de construção
- `demandas` - Tarefas e solicitações
- `funcionarios` - Membros da equipe
- `alocacoes` - Associação funcionário/obra
- `materiais` - Catálogo de materiais
- `consumos_material` - Histórico de consumo

## 🔐 Segurança

- ✅ Autenticação via Supabase Auth
- ✅ Tokens JWT para API
- ✅ Row-level security (RLS) opcional
- ✅ Variáveis de ambiente privadas
- ✅ HTTPS em produção

## 📱 Responsividade

- Mobile-first design
- Breakpoints: 375px, 768px, 1024px, 1440px
- Touch targets ≥44px
- Safe area awareness

## ⚡ Performance

- Code splitting por rota
- Lazy loading de componentes
- Otimização de imagens
- Caching de requisições
- <1s Time to Interactive (mobile)

## 🚢 Deploy em Produção

### Vercel (Recomendado)

1. Push ao GitHub
2. Conecte o repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático

```bash
npm run build
npm run preview
```

### Build Manual

```bash
npm run build
# Saída em ./dist
```

## 📚 Documentação

- [Supabase Docs](https://supabase.com/docs)
- [React Router Docs](https://reactrouter.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contribuindo

Este projeto é desenvolvido com enfoque em:
- Clean code
- Type safety (TypeScript)
- Acessibilidade
- Performance
- Experiência do usuário

## 📄 Licença

MIT - Veja LICENSE.md para detalhes

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação do Supabase
2. Consulte os logs do navegador (F12)
3. Crie uma issue no repositório

---

**Desenvolvido com ❤️ para a gestão inteligente de obras**
