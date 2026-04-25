# 🚀 DEPLOY NA VERCEL - INSTRUÇÕES PARA LINK PRONTO

## ⏱️ 10 MINUTOS PARA SEU APP ONLINE

Siga exatamente nesta ordem para obter um link pronto para acessar.

---

## PASSO 1️⃣: CRIAR CONTA SUPABASE (2 minutos)

1. Acesse: **https://supabase.com**
2. Clique em "Start your project"
3. Faça login com GitHub ou email
4. Clique em "New project"
5. Preencha:
   - **Name**: `berlim-saas`
   - **Database Password**: Crie uma senha forte (salve-a!)
   - **Region**: `South America - São Paulo` (ou mais próximo)
6. Clique "Create new project" e **aguarde 2-3 minutos** até estar pronto

### ✅ Quando estiver pronto:
- Você estará em: `https://supabase.com/dashboard/project/xxxxx`
- Na aba "Settings" > "API", copie e salve em um arquivo de texto:
  - **Project URL** (ex: `https://abc123.supabase.co`)
  - **anon public** key (ex: `eyJhbGc...`)

---

## PASSO 2️⃣: EXECUTAR SQL NO SUPABASE (1 minuto)

1. No dashboard Supabase, clique em **"SQL Editor"** (lado esquerdo)
2. Clique em **"New query"**
3. Abra o arquivo: `supabase/migrations/001_init.sql` (nesta pasta)
4. **Copie TODO o conteúdo** do arquivo
5. **Cole no SQL Editor** do Supabase
6. Clique em **"RUN"** (botão verde)
7. Aguarde até ver "Success"

✅ Seu banco de dados está criado!

---

## PASSO 3️⃣: CRIAR ARQUIVO .env.local (1 minuto)

1. Na pasta `C:\Users\Karen\berlim-saas`, abra o arquivo `.env.local.example`
2. Copie seu conteúdo
3. Crie um novo arquivo chamado `.env.local` **na mesma pasta**
4. Cole o conteúdo e substitua:
   ```
   VITE_SUPABASE_URL=https://SEU-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=SUA-CHAVE-AQUI
   ```
5. Salve o arquivo

---

## PASSO 4️⃣: CRIAR REPOSITÓRIO GITHUB (2 minutos)

1. Abra PowerShell em `C:\Users\Karen\berlim-saas`
2. Execute esses comandos **um por um**:

```powershell
git init
git add .
git commit -m "Initial commit - Berlim SaaS"
```

3. Acesse: **https://github.com/new**
4. Preencha:
   - **Repository name**: `berlim-saas`
   - **Description**: `Sistema SaaS de gerenciamento de obras`
   - **Public** ou **Private** (sua escolha)
5. Clique "Create repository"
6. Ele vai mostrar comandos - **copie exatamente** a linha que começa com `git remote add origin`:

```powershell
git remote add origin https://github.com/SEU-USUARIO/berlim-saas.git
git branch -M main
git push -u origin main
```

✅ Seu código agora está no GitHub!

---

## PASSO 5️⃣: DEPLOY NA VERCEL (3 minutos)

1. Acesse: **https://vercel.com**
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Procure por **`berlim-saas`** e clique "Import"
5. **Selecione seu repositório** na lista
6. Vá para **"Environment Variables"**
7. Adicione 2 variáveis:
   - **Name**: `VITE_SUPABASE_URL` | **Value**: `https://abc123.supabase.co`
   - **Name**: `VITE_SUPABASE_ANON_KEY` | **Value**: `eyJhbGc...`
8. Clique em **"Deploy"**
9. **Aguarde 2-3 minutos** enquanto faz o build

### 🎉 PRONTO!

Quando terminar, você verá uma tela com:
```
https://berlim-saas-xxxxx.vercel.app
```

**Esse é seu link!** 🚀

---

## 🔗 SUA URL PRONTA:

Após o deploy completar, acesse seu link:
```
https://berlim-saas-xxxxx.vercel.app
```

**Credentials de teste:**
- Email: `teste@exemplo.com`
- Senha: Qualquer senha (registre-se primeiro)

---

## ✅ CHECKLIST RÁPIDO:

- [ ] Conta Supabase criada
- [ ] SQL executado com sucesso
- [ ] `.env.local` criado com chaves corretas
- [ ] Repositório GitHub criado
- [ ] Código feito push para GitHub (`git push -u origin main`)
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy iniciado
- [ ] Link gerado e testado

---

## 🆘 PROBLEMAS?

**Erro ao executar SQL:**
- Verifique se copou TODO o arquivo 001_init.sql
- Tente executar em partes (copie até a primeira linha "CREATE TABLE")

**Build falhou na Vercel:**
- Verifique se `.env.local` está preenchido corretamente
- Clique "Redeploy" após corrigir
- Verifique se package.json existe na raiz

**App em branco ou erro de conexão:**
- Abra o browser (F12) > Console
- Verifique se a URL do Supabase está correta
- Verifique se a chave Anon está correta

**Não consigo fazer git push:**
- Verifique se tem acesso ao GitHub
- Tente fazer login: `git config --global user.email "seu-email@github.com"`
- Tente fazer push novamente: `git push -u origin main`

---

**Tempo total: ~10 minutos** ⏱️

Boa sorte! Seu app estará online em pouco tempo! 🎉
