# 🚀 Guia de Setup - Berlim SaaS

Instruções passo a passo para colocar o Berlim SaaS em funcionamento.

## ✅ Checklist de Instalação

### 1️⃣ **Preparar o Supabase**

- [ ] Criar conta em [supabase.com](https://supabase.com)
- [ ] Criar novo projeto
- [ ] Copiar URL do projeto
- [ ] Copiar chave anon (pública)
- [ ] Salvar em `.env.local`

**Localização das credenciais:**
```
Dashboard do Supabase
→ Project Settings (ícone de engrenagem)
→ API
→ Project URL (VITE_SUPABASE_URL)
→ Project API keys → anon (VITE_SUPABASE_ANON_KEY)
```

### 2️⃣ **Instalar Dependências**

```bash
cd berlim-saas
npm install
```

**Esperar até completar.** Você verá:
```
added XXX packages in XXs
```

### 3️⃣ **Configurar Variáveis de Ambiente**

Editar `.env.local`:

```env
VITE_SUPABASE_URL=https://xyzabc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...sua-chave...
VITE_ENV=development
```

⚠️ **NÃO commit `.env.local`** - contém credenciais!

### 4️⃣ **Iniciar Servidor de Desenvolvimento**

```bash
npm run dev
```

**Esperado:**
```
  VITE v5.0.0 ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  press h + enter to show help
```

Browser abrirá automaticamente em `http://localhost:3000`

### 5️⃣ **Criar Conta de Teste**

1. Clique em "Criar Conta"
2. Digite email e senha
3. Confirme no seu email (se configurado)
4. Faça login

**Conta de teste:**
```
Email: test@example.com
Senha: TestPassword123!
```

---

## 🗄️ Tabelas do Supabase

O Supabase criará automaticamente as seguintes tabelas. Se precisar configurar manualmente:

### Obras
```sql
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  localizacao TEXT NOT NULL,
  status TEXT DEFAULT 'planejamento',
  data_inicio TIMESTAMP NOT NULL,
  data_fim_prevista TIMESTAMP,
  data_fim_real TIMESTAMP,
  responsavel_id UUID,
  orcamento DECIMAL,
  custo_atual DECIMAL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

### Demandas
```sql
CREATE TABLE demandas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  status TEXT DEFAULT 'pendente',
  prioridade TEXT DEFAULT 'media',
  atribuido_a UUID,
  data_vencimento TIMESTAMP,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (obra_id) REFERENCES obras(id)
);
```

### Funcionários
```sql
CREATE TABLE funcionarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  cargo TEXT NOT NULL,
  especialidade TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

### Materiais
```sql
CREATE TABLE materiais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL,
  unidade TEXT NOT NULL,
  preco_unitario DECIMAL NOT NULL,
  estoque_total DECIMAL NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);
```

---

## 🎯 Primeiro Acesso

### 1. Login
- Email: seu@email.com
- Senha: sua-senha

### 2. Dashboard
Verá:
- Métricas de obras em andamento
- Demandas críticas
- Orçamento total vs gasto

### 3. Criar Primeira Obra
- Vá a **Obras** no menu
- Clique **"Nova Obra"**
- Preencha dados básicos
- Salve

### 4. Adicionar Funcionário
- Vá a **Funcionários**
- Clique **"Novo Funcionário"**
- Cadastre equipe

### 5. Criar Demanda
- Vá a **Demandas**
- Clique **"Nova Demanda"**
- Defina prioridade e prazos

---

## 🔧 Comandos Úteis

### Desenvolvimento
```bash
npm run dev       # Iniciar servidor (localhost:3000)
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Verificar código
```

### Git
```bash
git status        # Ver mudanças
git add .         # Adicionar tudo
git commit -m "..." # Fazer commit
git push          # Enviar ao GitHub
```

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
# Mude a porta em vite.config.ts ou:
npm run dev -- --port 3001
```

### "Variáveis de ambiente não encontradas"
1. Verifique `.env.local` no diretório raiz
2. Reinicie o servidor (`npm run dev`)
3. Verifique spelling: `VITE_SUPABASE_URL` (não é `.env`)

### "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### "Supabase connection error"
1. Verifique URL e chave em `.env.local`
2. Tente conectar diretamente: `https://[seu-project].supabase.co`
3. Crie um novo projeto Supabase se necessário

### "502 Bad Gateway" em produção
- Verifique variáveis de ambiente no Vercel/host
- Atualize credenciais Supabase se expiradas

---

## 📈 Próximos Passos

- [ ] Configurar email de confirmação no Supabase
- [ ] Adicionar upload de fotos (Storage)
- [ ] Implementar notificações por email
- [ ] Setup CI/CD (GitHub Actions)
- [ ] Deploy em Vercel/Netlify
- [ ] Configurar backup automático
- [ ] Adicionar analytics (Posthog/Mixpanel)

---

## 📞 Precisando de Ajuda?

1. **Erros de build?** → Limpe `node_modules` e reinstale:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Supabase não conecta?** → Teste na console do browser (F12):
   ```js
   fetch('https://[seu-projeto].supabase.co/rest/v1/obras', {
     headers: { 'apikey': 'sua-chave-anon' }
   })
   ```

3. **Precisa resetar tudo?** → Delete o projeto Supabase e crie novo

---

**✨ Tudo pronto! Bem-vindo ao Berlim SaaS! ✨**
