# 📋 Guia de Integração - Projeto Inovarse Redesign com GitHub

## 📦 Arquivos Inclusos no ZIP

O arquivo `inovarse-mce-redesign-completo.zip` contém:

```
inovarse-mce-redesign/
├── client/
│   ├── public/
│   │   └── logo_inovarse.jpeg (logo oficial)
│   ├── src/
│   │   ├── App.tsx (redesign sofisticado com Supabase)
│   │   ├── index.css (tipografia premium e paleta refinada)
│   │   ├── lib/
│   │   │   └── supabase.ts (configuração Supabase)
│   │   ├── pages/
│   │   ├── components/
│   │   └── contexts/
│   └── index.html (com fontes Google: Playfair Display, Lora, Inter)
├── server/
│   └── index.ts
├── package.json (com dependências: framer-motion, @supabase/supabase-js)
├── .env.local (variáveis Supabase - IMPORTANTE: não fazer commit!)
├── vite.config.ts
├── tsconfig.json
└── pnpm-lock.yaml
```

## 🚀 Passo a Passo para Integração

### 1️⃣ Extrair o ZIP no seu repositório

```bash
# Navegue até o diretório do seu projeto
cd seu-repositorio-inovarse

# Extraia o ZIP (substitua o caminho se necessário)
unzip /caminho/para/inovarse-mce-redesign-completo.zip

# Isso criará uma pasta "inovarse-mce-redesign" com todo o projeto
```

### 2️⃣ Atualizar variáveis de ambiente

**⚠️ IMPORTANTE: Nunca fazer commit do `.env.local` com credenciais reais!**

```bash
# Copie o .env.local para .env.example (sem credenciais sensíveis)
cp inovarse-mce-redesign/.env.local inovarse-mce-redesign/.env.example

# Edite o .env.example para remover as chaves reais
# Deixe apenas os nomes das variáveis:
# VITE_SUPABASE_URL=
# VITE_SUPABASE_ANON_KEY=
```

### 3️⃣ Adicionar ao .gitignore

```bash
# Abra o arquivo .gitignore do seu projeto
# Adicione estas linhas:

# Variáveis de ambiente locais
.env.local
.env.*.local

# Dependências
node_modules/
pnpm-lock.yaml (opcional, se preferir)

# Build
dist/
.manus-logs/
```

### 4️⃣ Instalar dependências

```bash
cd inovarse-mce-redesign

# Se usar pnpm (recomendado)
pnpm install

# Ou se usar npm
npm install

# Ou se usar yarn
yarn install
```

### 5️⃣ Configurar variáveis de ambiente locais

```bash
# Crie o arquivo .env.local no diretório do projeto
# (Já está incluído no ZIP, apenas verifique)

# Conteúdo do .env.local:
VITE_SUPABASE_URL=https://rqvjsjfypuojuaetxkig.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdmpzamZ5cHVvanVhZXR4a2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDI1MDcsImV4cCI6MjA4OTU3ODUwN30.WjQ5b4PgoX1boOxAkjEXgqjKHc7cQayneUj7wWTzfF0
```

### 6️⃣ Testar localmente

```bash
cd inovarse-mce-redesign

# Iniciar servidor de desenvolvimento
pnpm dev

# Acesse http://localhost:3000 no navegador
# Teste o fluxo completo:
# 1. Clique em "Iniciar o Teste Triângulo MCE"
# 2. Ajuste os sliders
# 3. Clique em "Gerar Meu Triângulo MCE"
# 4. Verifique se os dados foram salvos no Supabase
```

### 7️⃣ Fazer commit no GitHub

```bash
# Adicione os arquivos ao git
git add inovarse-mce-redesign/

# Verifique que .env.local NÃO está sendo commitado
git status  # Deve mostrar .env.local como untracked ou ignorado

# Faça o commit
git commit -m "feat: integrar redesign sofisticado Inovarse com Supabase

- Tipografia premium (Playfair Display + Lora + Inter)
- Paleta refinada em esmeralda/ouro
- Animações elegantes via Framer Motion
- Imagens de fundo premium
- Integração Supabase para salvar resultados
- Logo oficial integrado"

# Faça push para o repositório
git push origin main  # ou sua branch padrão
```

## 🔑 Variáveis de Ambiente

### Arquivo `.env.local` (não fazer commit)
```
VITE_SUPABASE_URL=https://rqvjsjfypuojuaetxkig.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJxdmpzamZ5cHVvanVhZXR4a2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDI1MDcsImV4cCI6MjA4OTU3ODUwN30.WjQ5b4PgoX1boOxAkjEXgqjKHc7cQayneUj7wWTzfF0
```

### Arquivo `.env.example` (fazer commit)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## 📊 Estrutura do Banco de Dados (Supabase)

Tabela: `results`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | uuid | ID único (auto-gerado) |
| mental | float | Valor calculado para Mente |
| corpo | float | Valor calculado para Corpo |
| espirito | float | Valor calculado para Espírito |
| ideal_mental | integer | Valor ideal de Mente |
| ideal_corpo | integer | Valor ideal de Corpo |
| ideal_espirito | integer | Valor ideal de Espírito |
| created_at | timestamp | Data/hora de criação (auto-gerado) |

## 🎨 Principais Mudanças Implementadas

### 1. Tipografia Premium
- **Títulos**: Playfair Display (elegante e sofisticado)
- **Corpo**: Lora (legível e refinado)
- **Interface**: Inter (moderno e limpo)

### 2. Paleta de Cores
- Esmeralda principal: `#10b981`
- Esmeralda escura: `#0d6b5a`
- Ouro sutil: `#d4af37`
- Cream: `#faf8f3`

### 3. Animações
- Entrada suave dos elementos (Framer Motion)
- Hover effects nos cards
- Transições fluidas entre telas
- Loading spinner animado

### 4. Componentes
- Cards com gradientes e sombras
- Sliders estilizados por tema
- Triângulo SVG com gradiente
- Indicadores visuais refinados

### 5. Integração Supabase
- Arquivo `client/src/lib/supabase.ts` com cliente configurado
- Função `calcular()` salva dados em tempo real
- Tratamento de erros com feedback ao usuário

## 🐛 Troubleshooting

### Erro: "Supabase URL ou Anon Key não encontrados"
- Verifique se `.env.local` existe no diretório raiz do projeto
- Confirme que as variáveis estão corretas
- Reinicie o servidor de desenvolvimento

### Erro: "Cannot find module '@supabase/supabase-js'"
```bash
# Reinstale as dependências
pnpm install
# ou
npm install
```

### Dados não estão sendo salvos no Supabase
- Verifique a conexão com internet
- Confirme as credenciais do Supabase
- Verifique se a tabela `results` existe no banco de dados
- Abra o console do navegador (F12) para ver mensagens de erro

## 📝 Próximas Melhorias Sugeridas

1. **Validação de Formulário**: Adicionar validação antes de enviar dados
2. **Toast Notifications**: Feedback visual com Sonner para sucesso/erro
3. **Histórico de Resultados**: Página para visualizar testes anteriores
4. **Formulário de Contato**: Capturar email/telefone do usuário
5. **Analytics**: Rastrear quantos usuários fazem o teste

## 📞 Suporte

Se tiver dúvidas sobre a integração ou encontrar problemas:
1. Verifique o console do navegador (F12) para erros
2. Consulte os logs do servidor de desenvolvimento
3. Verifique se todas as dependências foram instaladas corretamente

---

**Criado em**: 26/03/2026  
**Versão do Projeto**: d64f357d  
**Stack**: React 19 + TypeScript + Tailwind 4 + Framer Motion + Supabase
