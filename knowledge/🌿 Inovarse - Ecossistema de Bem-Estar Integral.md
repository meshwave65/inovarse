# 🌿 Inovarse - Ecossistema de Bem-Estar Integral

**Status**: Em Desenvolvimento (Fase 7 de 9)  
**Última Atualização**: 10 de Abril de 2026  
**Versão**: 1.0-beta

---

## 📋 Visão Geral

**Inovarse** é uma plataforma integrativa dedicada à promoção da **saúde e bem-estar holísticos**. Posicionando-se além do conceito tradicional de estética, Inovarse guia indivíduos em uma jornada de autoconhecimento e equilíbrio, abrangendo as dimensões fundamentais da **Mente, Corpo e Espírito**.

### Propósito Central

Oferecer soluções personalizadas que visam não apenas a beleza exterior, mas a **vitalidade e harmonia internas**, resultando em uma estética que reflete o bem-estar integral.

---

## 🎯 Modelo de Negócio

O modelo de negócio da Inovarse é fundamentado em **curadoria, conexão e personalização**, operando como um hub que integra clientes a uma rede de serviços e profissionais alinhados à sua filosofia.

### Pilares Principais

| Pilar | Descrição |
|-------|-----------|
| **Teste Triângulo MCE** | Ferramenta diagnóstica central que avalia o equilíbrio nas dimensões Mente, Corpo e Espírito |
| **Programas GlowFit** | Pacotes de serviços personalizados baseados no perfil MCE do usuário |
| **Rede Credenciada** | Profissionais e estabelecimentos selecionados e alinhados à filosofia Inovarse |
| **Monetização** | Assinaturas, comissionamento, programas exclusivos e venda de produtos |

---

## 🧠 Teste Triângulo MCE

### O que é?

O **Teste Triângulo MCE** é a ferramenta diagnóstica central do ecossistema. Um modelo geométrico rigoroso que representa a alocação de recursos existenciais percebidos em três dimensões:

- **M (Mente)**: Processos cognitivos, reflexão, análise
- **C (Corpo)**: Manutenção fisiológica, movimento, sensorialidade
- **E (Espírito)**: Propósito, conexão, significado existencial

### Como Funciona?

O teste opera em **dois níveis**:

#### 1. MBP Triangle (Preferências)
- **O que é**: A distribuição ideal que o indivíduo DESEJA
- **Como é obtido**: Teste com sliders (0-10) + preferências pareadas
- **Significado**: Mostra aspirações e desejos do indivíduo
- **Importante**: NÃO indica evolução ou desenvolvimento, apenas preferência pessoal

#### 2. Real Actuality Triangle (Realidade)
- **O que é**: A distribuição ATUAL avaliada por profissionais Inovarse
- **Como é obtido**: Avaliação profissional do estado atual
- **Significado**: Mostra o estado real em cada dimensão
- **Uso**: Identifica lacunas entre desejo e realidade

### Exemplo Prático

```
Cliente X - Preferências (MBP Triangle):
├── Mente: 0.8 (prefere atividades mentais)
├── Corpo: 0.1
└── Espírito: 0.1

Cliente X - Realidade Atual (Real Actuality Triangle):
├── Mente: 0.3 (realidade atual desequilibrada)
├── Corpo: 0.5
└── Espírito: 0.2

Objetivo do Programa:
└── Evoluir realidade para se aproximar das preferências
    e do equilíbrio central (1/3, 1/3, 1/3)
```

### Conceito Crítico: Intensidade ≠ Evolução

Um indivíduo com M=8, B=1, P=1 **não é "menos evoluído"**. Ele simplesmente **prefere atividades relacionadas à mente**. O programa deve:

- ✅ Respeitar essa preferência
- ✅ Conter carga considerável de atividades mentais
- ✅ Evoluir a pessoa em cada dimensão dentro dessa preferência
- ❌ Nunca "corrigir" ou "normalizar" a preferência

---

## 💪 Programas GlowFit

### GlowFit Mente
Focado na saúde mental e bem-estar emocional:
- Terapias holísticas (meditação, mindfulness, yoga, aromaterapia)
- Apoio psicológico e coaching de bem-estar
- Workshops sobre gestão de estresse e desenvolvimento pessoal

### GlowFit Corpo
Direcionado à saúde física, nutrição e movimento:
- Nutrição integrativa e consultoria personalizada
- Atividade física consciente (pilates, treinamento funcional, dança)
- Estética avançada com profissionais credenciados

### GlowFit Espírito
Com foco em propósito, conexão e autoconhecimento:
- Práticas de conexão (retiros, círculos de partilha)
- Desenvolvimento pessoal e descoberta de propósito
- Terapias energéticas (reiki, cromoterapia, cristaloterapia)

---

## 🤝 Rede Credenciada

A **Rede Credenciada Inovarse** é o pilar que sustenta a entrega dos serviços, garantindo capilaridade e qualidade da oferta.

### Critérios de Credenciamento
- ✅ Qualificação profissional comprovada
- ✅ Alinhamento filosófico com abordagem integrativa MCE
- ✅ Padrões de qualidade e excelência
- ✅ Abertura para inovação e novas metodologias

### Benefícios para Credenciados
- Aumento de visibilidade e clientes
- Marketing e suporte da marca Inovarse
- Treinamento e desenvolvimento contínuo
- Acesso à plataforma tecnológica

### Benefícios para Clientes
- Rede de confiança garantida
- Recomendações personalizadas
- Conveniência de um único ponto de acesso
- Resultados duradouros e transformação integral

---

## 🏗️ Arquitetura Técnica

### Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 19 + TypeScript + Tailwind CSS 4 + Framer Motion |
| **Backend** | Express 4 + tRPC 11 + Node.js |
| **Banco de Dados** | MySQL + Drizzle ORM |
| **Autenticação** | Manus OAuth |
| **Persistência** | localStorage (frontend) + MySQL (backend) |
| **Hospedagem** | Manus Platform |

### Estrutura do Projeto

```
inovarse/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx (landing page)
│   │   │   ├── TrianguloMCE.tsx (teste completo)
│   │   │   └── ...
│   │   ├── components/
│   │   ├── lib/
│   │   │   └── trpc.ts (cliente tRPC)
│   │   ├── App.tsx (rotas)
│   │   └── index.css (estilos globais)
│   └── index.html
├── server/
│   ├── routers.ts (endpoints tRPC)
│   ├── db.ts (helpers de banco de dados)
│   ├── mce.ts (funções específicas MCE)
│   └── _core/ (framework interno)
├── drizzle/
│   ├── schema.ts (definição de tabelas)
│   └── migrations/
├── knowledge/ (documentação)
├── package.json
└── README.md (este arquivo)
```

---

## 🚀 Funcionalidades Implementadas

### ✅ Fase 1-6: Integração Básica Completa

- [x] Rota `/teste` com teste completo
- [x] Formulário de captura de leads (nome, telefone, email)
- [x] Sliders interativos para Mente, Corpo, Espírito (0-10)
- [x] Preferências pareadas (balanços secundários)
- [x] Visualização SVG do triângulo dinâmico
- [x] Interpretações personalizadas (5 perfis)
- [x] Persistência em localStorage
- [x] Backend tRPC com routers para leads e resultados
- [x] Validação com Zod
- [x] Testes unitários (14 testes passando)

### 🔄 Fase 7: Melhorias Framework MBP Triangle (Em Progresso)

- [ ] Tabela para Real Actuality Triangle no banco de dados
- [ ] Sistema de fases com benchmarks
- [ ] Cálculo de métricas derivadas (coerência, desbalanceamento, integração)
- [ ] Interpretações exploratórias respeitosas
- [ ] Routers tRPC para avaliação profissional

### 📊 Fase 8: Dashboard e Avaliação Profissional (Planejado)

- [ ] Página `/admin/evaluate` para profissionais
- [ ] Dashboard `/dashboard/progress` com histórico
- [ ] Visualização de evolução ao longo do tempo
- [ ] Comparação entre preferências e realidade

### 🧪 Fase 9: Testes e Publicação Final (Planejado)

- [ ] Testes unitários para novas métricas
- [ ] Testes de sistema para fases e benchmarks
- [ ] Validação de interpretações
- [ ] Checkpoint final e publicação

---

## 📊 Banco de Dados

### Tabelas Principais

#### `users`
Usuários do sistema com autenticação OAuth.

#### `mce_leads`
Dados de leads capturados no teste:
- `id`: UUID único
- `nome`: Nome do lead
- `telefone`: Telefone/WhatsApp
- `email`: Email
- `createdAt`: Data de captura

#### `mce_results`
Resultados do teste MCE:
- `id`: UUID único
- `leadId`: Referência ao lead
- `mental`: Valor calculado para Mente (0-1)
- `corpo`: Valor calculado para Corpo (0-1)
- `espirito`: Valor calculado para Espírito (0-1)
- `idealMental`, `idealCorpo`, `idealEspirito`: Valores ideais (0-10)
- `createdAt`: Data do teste

#### `mce_real_actuality` (Planejado)
Avaliação profissional da realidade atual:
- `id`: UUID único
- `userId`: Referência ao usuário
- `evaluatorId`: Profissional que avaliou
- `mental`, `corpo`, `espirito`: Valores atuais (0-1)
- `phase`: Fase atual do programa
- `benchmark`: Benchmark da fase
- `evaluatedAt`: Data da avaliação

---

## 🔧 Como Usar

### Instalação

```bash
# Clonar repositório
git clone https://github.com/meshwave65/inovarse.git
cd inovarse

# Instalar dependências
pnpm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com suas credenciais
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm dev

# Acessar em http://localhost:3000

# Executar testes
pnpm test

# Verificar tipos TypeScript
pnpm check
```

### Build

```bash
# Build para produção
pnpm build

# Iniciar servidor de produção
pnpm start
```

---

## 📚 Documentação

A documentação completa do projeto está armazenada em `/knowledge`:

| Documento | Descrição |
|-----------|-----------|
| `DESENVOLVIMENTO_MBP_TRIANGLE_INTEGRATION.md` | Histórico completo de desenvolvimento e interações |
| `MBP_FRAMEWORK_ANALYSIS.md` | Análise técnica detalhada do framework MBP Triangle |
| `Ecossistema Inovarse_ Estética Integrativa, Saúde e Bem-Estar.md` | Visão geral do ecossistema |
| `Ecossistema Inovarse_ Modelo de Negócio...` | Detalhes do modelo de negócio |
| Outros documentos | Parcerias, estratégias e guias de integração |

---

## 🎨 Design e UX

### Paleta de Cores
- **Esmeralda Principal**: `#10b981`
- **Esmeralda Escura**: `#0d6b5a`
- **Ouro Sutil**: `#d4af37`
- **Cream**: `#faf8f3`

### Tipografia
- **Títulos**: Playfair Display (elegante)
- **Corpo**: Lora (refinado)
- **Interface**: Inter (moderno)

### Animações
- Entrada suave de elementos (Framer Motion)
- Hover effects nos cards
- Transições fluidas entre telas
- Loading spinners animados

---

## 🧪 Testes

### Executar Testes

```bash
# Rodar todos os testes
pnpm test

# Rodar testes em modo watch
pnpm test:watch

# Gerar coverage
pnpm test:coverage
```

### Cobertura Atual
- ✅ Validação de dados MCE
- ✅ Cálculos geométricos do triângulo
- ✅ Ranges de scores
- ✅ Formatos de email/telefone
- ✅ Classificação de perfis

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Reinstalar dependências
pnpm install
```

### Erro: "Database connection failed"
- Verificar variáveis de ambiente em `.env.local`
- Confirmar que o banco de dados está acessível
- Verificar credenciais de autenticação

### Dados não estão sendo salvos
- Verificar conexão com internet
- Abrir console do navegador (F12) para ver erros
- Verificar se as tabelas existem no banco de dados

---

## 🚀 Próximas Melhorias

### Curto Prazo (Próximas 2 semanas)
1. Implementar Real Actuality Triangle
2. Criar sistema de fases com benchmarks
3. Calcular métricas derivadas (coerência, desbalanceamento)

### Médio Prazo (Próximo mês)
1. Página de avaliação profissional
2. Dashboard de progresso com histórico
3. Interpretações exploratórias dinâmicas

### Longo Prazo (Próximos 3 meses)
1. Integração com Programas GlowFit
2. Sistema de agendamentos com rede credenciada
3. Notificações por email e push
4. Analytics e relatórios

---

## 📞 Suporte e Contribuições

### Reportar Issues
1. Abrir issue no GitHub com descrição clara
2. Incluir passos para reproduzir
3. Anexar screenshots se relevante

### Contribuir
1. Fork o repositório
2. Criar branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licença

Este projeto é propriedade do Ecossistema Inovarse. Todos os direitos reservados.

---

## 👥 Equipe

- **Conceito e Estratégia**: Equipe Inovarse
- **Desenvolvimento**: MeshWave Team
- **Documentação**: Manus AI

---

## 🔗 Links Úteis

- [Repositório GitHub](https://github.com/meshwave65/inovarse)
- [Repositório Triângulo MCE](https://github.com/meshwave65/triangulo_mce)
- [Documentação Técnica](/knowledge)
- [Stack Tecnológico](#arquitetura-técnica)

---

## 📊 Status do Projeto

| Componente | Status | Progresso |
|-----------|--------|-----------|
| Frontend Base | ✅ Completo | 100% |
| Teste MCE | ✅ Completo | 100% |
| Backend tRPC | ✅ Completo | 100% |
| Persistência | ✅ Completo | 100% |
| Real Actuality | 🔄 Em Progresso | 30% |
| Dashboard | 📋 Planejado | 0% |
| Avaliação Profissional | 📋 Planejado | 0% |
| Integração GlowFit | 📋 Planejado | 0% |

---

**Última Atualização**: 10 de Abril de 2026  
**Versão**: 1.0-beta  
**Mantido por**: Equipe Inovarse + MeshWave + Manus AI
