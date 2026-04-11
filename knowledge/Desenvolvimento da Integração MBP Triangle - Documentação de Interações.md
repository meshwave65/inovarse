# Desenvolvimento da Integração MBP Triangle - Documentação de Interações

**Data**: 10 de Abril de 2026  
**Projeto**: Inovarse - Integração do Teste Triângulo MCE  
**Status**: Em Desenvolvimento (Fase 7 de 9)

---

## 1. Contexto Inicial

### 1.1 Objetivo Principal
Integrar completamente o app Triângulo MCE (Mente, Corpo e Espírito) ao site Inovarse, transformando um botão não-funcional ("Fazer o Teste") em uma experiência completa de teste, captura de leads e persistência de dados.

### 1.2 Repositórios Analisados
- **triangulo_mce**: https://github.com/meshwave65/triangulo_mce
- **inovarse**: https://github.com/meshwave65/inovarse

### 1.3 Stack Tecnológico
- **Frontend**: React 19 + Tailwind 4 + Framer Motion
- **Backend**: tRPC + Express 4
- **Banco de Dados**: MySQL com Drizzle ORM
- **Persistência**: localStorage (frontend) + MySQL (backend)

---

## 2. Fases de Desenvolvimento

### Fase 1-6: Integração Básica Completa ✅

**O que foi implementado:**

1. **Rota `/teste`** - Página acessível com o teste completo
2. **Formulário de Captura de Leads** - Nome, telefone, email
3. **Sliders Interativos** - Controles para Mente, Corpo e Espírito (0-10)
4. **Preferências Pareadas** - Balanços secundários entre dimensões
5. **Visualização SVG** - Triângulo dinâmico com cálculos geométricos precisos
6. **Interpretações Personalizadas** - 5 perfis baseados em resultados
7. **Persistência** - localStorage para dados entre sessões
8. **Backend tRPC** - Routers para submissão de leads e resultados
9. **Validação com Zod** - Schemas para dados de entrada
10. **Testes Unitários** - 14 testes passando (validação de dados, cálculos MCE)

**Checkpoint**: `98383e6f` - Backend completo com persistência MySQL

---

### Fase 7: Melhorias Framework MBP Triangle (Em Progresso)

**Baseado na análise do documento "Análise Precisa: Framework MBP Triangle para Integração ao Inovarse"**

#### 7.1 Mudanças Conceituais Identificadas

**Problema Inicial**: A implementação atual tratava intensidade como um indicador de evolução/desenvolvimento.

**Correção Necessária**: Intensidade = **preferência e aspiração pessoal**, não nível de evolução.

**Exemplo Crítico**:
- Um indivíduo com M=8, B=1, P=1 NÃO é "menos evoluído"
- Ele simplesmente PREFERE atividades relacionadas à mente
- O programa deve conter carga considerável de atividades mentais para alinhar com seu gosto
- Dentro deste programa, evoluir esta pessoa a cada dia em cada dimensão

#### 7.2 Dois Triângulos Distintos

**MBP Triangle (Preferências)**
- O que o indivíduo DESEJA
- Obtido através do teste com sliders + preferências pareadas
- Mostra aspirações e desejos
- Nunca muda durante o programa (a menos que o cliente mude suas preferências)

**Real Actuality Triangle (Realidade)**
- O que o indivíduo ESTÁ AGORA
- Avaliado por profissionais Inovarse
- Mostra o estado real em cada dimensão
- Pode estar completamente diferente do MBP Triangle
- Muda com o tempo conforme o programa evolui

**Exemplo Prático**:
```
Cliente X:
- MBP Triangle: M=0.8, B=0.1, P=0.1 (prefere atividades mentais)
- Real Actuality (Inicial): M=0.3, B=0.5, P=0.2 (realidade desequilibrada)
- Real Actuality (Após 6 meses): M=0.6, B=0.3, P=0.1 (melhorou, mas ainda não ideal)
```

#### 7.3 Deslocamentos Laterais = Preferências Autênticas

**Conceito Crítico**: Os deslocamentos laterais NÃO são anomalias ou distúrbios.

São **expressões autênticas de como cada pessoa naturalmente aloca seus recursos existenciais.**

**Devem ser**:
- ✅ Respeitados e integrados na elaboração de programas personalizados
- ❌ Nunca "corrigidos" ou "normalizados"

**Interpretação de Deslocamentos**:
- **Mind-Centric**: Prioriza processos cognitivos → Enfatizar aspectos reflexivos e analíticos
- **Body-Centric**: Prioriza manutenção fisiológica → Enfatizar aspectos físicos e sensoriais
- **Purpose-Centric**: Prioriza processos orientados a propósito → Enfatizar aspectos de significado
- **Centrado**: Integra as três dimensões equilibradamente → Oferecer variedade e flexibilidade

#### 7.4 Sistema de Fases com Benchmarks

**Problema de Saturação**:
Imagine Real Actuality inicial = (3, 3, 3). Após 6 meses = (8, 8, 8).
Como manter a sistemática se o indivíduo só precisa de 2 pontos para atingir o nível ótimo?

**Solução: Sistema de Fases**
```
Fase 1: Benchmark = (3, 3, 3) → Meta = (8, 8, 8)
Fase 2: Benchmark = (8, 8, 8) → Meta = (9, 9, 9)
Fase 3: Benchmark = (9, 9, 9) → Meta = (10, 10, 10)
```

Cada fase recomeça com novos níveis e metas, mantendo a dinâmica indefinidamente.

#### 7.5 Métricas Derivadas Importantes

**Coerência Percebida**
- Medida pela proximidade ao centroide (1/3, 1/3, 1/3)
- Fórmula: `coerência = 1 - (distância_ao_centroide / distância_máxima)`
- Interpretação: Quanto maior, mais o indivíduo percebe seus recursos como alinhados

**Desbalanceamento Percebido**
- Medida pela disparidade entre dimensões
- Fórmula: `desbalanceamento = max(|M-1/3|, |B-1/3|, |P-1/3|)`
- Interpretação: Quanto maior, mais uma dimensão está sobre/sub-investida

**Integração entre Domínios**
- Medida pelo grau de deslocamento lateral
- Quanto menor o deslocamento = maior independência
- Quanto maior o deslocamento = maior integração

**Áreas de Ajuste Intencionais**
- Identificadas pela análise de qual dimensão está mais distante do ideal (1/3)
- Sugerem oportunidades para rebalanceamento

#### 7.6 Interpretações Exploratórias (Não Prescritivas)

**Princípio**: Interpretações devem ser reflexivas, exploratórias e respeitosas das preferências pessoais.

**Exemplo de Interpretação Exploratória (Mind-Centric)**:
> "Seu padrão MBP mostra uma distribuição onde Mind (0.5), Body (0.3) e Purpose (0.2), com um deslocamento natural na direção de Mind.
>
> Isso sugere que você naturalmente prioriza processos cognitivos e tende a integrar Body e Purpose através de uma lente mental. Você pode preferir abordagens reflexivas, analíticas e intelectuais.
>
> Para o programa Inovarse, isso significa que podemos enfatizar aspectos cognitivos e reflexivos, enquanto também integramos elementos corporais e de propósito de forma que façam sentido para você."

---

## 3. Estrutura Geométrica Fundamental

### 3.1 Triângulo Harmonia (TH)

Um triângulo equilátero com 3 vértices que representa o espaço total de alocação de recursos.

**Componentes**:
- **Ponto Central (Centroide)**: Centro geométrico (1/3, 1/3, 1/3) = equilíbrio perfeito
- **3 Triângulos Dimensionais**:
  - **M (Mind)**: Base = lado inferior, Vértice = Centro
  - **B (Body)**: Base = lado esquerdo, Vértice = Centro
  - **P (Purpose)**: Base = lado direito, Vértice = Centro

### 3.2 Escala de Intensidade Radial

Medida ao longo da altura perpendicular de cada triângulo dimensional:

- **Altura = 0** (na base): Alocação zero
- **Altura = 1** (no centro): Alocação máxima
- **0 < altura < 1**: Alocação proporcional

**Restrição Fundamental**:
```
intensidade_M + intensidade_B + intensidade_P = 1
```

Esta restrição garante que a soma de todas as alocações é conservada.

### 3.3 Cálculos Matemáticos

Para um ponto P dentro do triângulo dimensional:

```javascript
intensidade_M = distância_perpendicular_P_até_base_M / altura_total_M
intensidade_B = distância_perpendicular_P_até_base_B / altura_total_B
intensidade_P = distância_perpendicular_P_até_base_P / altura_total_P
```

---

## 4. Implementação Técnica Necessária

### 4.1 Banco de Dados (Schema Drizzle)

```typescript
// Tabela de preferências (MBP Triangle)
export const mce_preferences = mysqlTable("mce_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  mental: decimal("mental", { precision: 3, scale: 2 }).notNull(),
  body: decimal("body", { precision: 3, scale: 2 }).notNull(),
  purpose: decimal("purpose", { precision: 3, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabela de realidade atual (Real Actuality Triangle)
export const mce_real_actuality = mysqlTable("mce_real_actuality", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  evaluatorId: int("evaluator_id").notNull(), // Profissional que avaliou
  mental: decimal("mental", { precision: 3, scale: 2 }).notNull(),
  body: decimal("body", { precision: 3, scale: 2 }).notNull(),
  purpose: decimal("purpose", { precision: 3, scale: 2 }).notNull(),
  phase: int("phase").default(1).notNull(),
  benchmark: json("benchmark").notNull(), // {mental, body, purpose}
  evaluatedAt: timestamp("evaluated_at").defaultNow().notNull(),
});

// Histórico de avaliações
export const mce_evaluations = mysqlTable("mce_evaluations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  evaluatorId: int("evaluator_id").notNull(),
  mental: decimal("mental", { precision: 3, scale: 2 }).notNull(),
  body: decimal("body", { precision: 3, scale: 2 }).notNull(),
  purpose: decimal("purpose", { precision: 3, scale: 2 }).notNull(),
  coherence: decimal("coherence", { precision: 3, scale: 2 }).notNull(),
  imbalance: decimal("imbalance", { precision: 3, scale: 2 }).notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 4.2 Cálculos de Métricas (TypeScript)

```typescript
// Coerência Percebida
function calculateCoherence(m: number, b: number, p: number): number {
  const centerX = 1/3, centerY = 1/3, centerZ = 1/3;
  const distance = Math.sqrt((m - centerX)² + (b - centerY)² + (p - centerZ)²);
  const maxDistance = Math.sqrt((1 - centerX)² + (0 - centerY)² + (0 - centerZ)²);
  return 1 - (distance / maxDistance);
}

// Desbalanceamento Percebido
function calculateImbalance(m: number, b: number, p: number): number {
  return Math.max(
    Math.abs(m - 1/3),
    Math.abs(b - 1/3),
    Math.abs(p - 1/3)
  );
}

// Integração entre Domínios (baseado em deslocamento)
function calculateIntegration(displacement: number): number {
  // Quanto maior o deslocamento, maior a integração
  return Math.min(displacement / 0.5, 1); // Normalizado
}

// Distância ao Centro
function distanceToCenter(m: number, b: number, p: number): number {
  return Math.sqrt(
    (m - 1/3)² + (b - 1/3)² + (p - 1/3)²
  );
}
```

### 4.3 Routers tRPC Necessários

```typescript
// Router para avaliação profissional
mce: router({
  // Existentes
  submitLead: protectedProcedure.input(...).mutation(...),
  submitResult: protectedProcedure.input(...).mutation(...),
  
  // Novos
  createRealActuality: adminProcedure
    .input(z.object({
      userId: z.number(),
      mental: z.number().min(0).max(1),
      body: z.number().min(0).max(1),
      purpose: z.number().min(0).max(1),
    }))
    .mutation(async ({ input, ctx }) => {
      // Salvar Real Actuality Triangle
      // Calcular métricas derivadas
      // Determinar fase e benchmark
    }),
    
  getRealActuality: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      // Retornar Real Actuality atual + histórico
    }),
    
  getMetrics: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      // Retornar coerência, desbalanceamento, integração
    }),
    
  getPhaseProgress: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      // Retornar progresso da fase atual
    }),
}),
```

---

## 5. Próximas Fases

### Fase 8: Página de Avaliação Profissional e Dashboard
- [ ] Criar página `/admin/evaluate` para profissionais avaliarem Real Actuality
- [ ] Implementar dashboard `/dashboard/progress` com histórico
- [ ] Visualizar evolução ao longo do tempo
- [ ] Comparar MBP (preferências) vs Real Actuality (realidade)

### Fase 9: Testes e Publicação
- [ ] Escrever testes para novas métricas
- [ ] Testar sistema de fases
- [ ] Validar interpretações exploratórias
- [ ] Criar checkpoint final
- [ ] Publicar versão melhorada

---

## 6. Documentação Armazenada

Este arquivo faz parte da documentação centralizada no repositório Inovarse:

- **Localização**: `/knowledge/DESENVOLVIMENTO_MBP_TRIANGLE_INTEGRATION.md`
- **Complementos**:
  - `MBP_FRAMEWORK_ANALYSIS.md` - Análise técnica completa do framework
  - `Análise_Precisa_Framework_MBP_Triangle_para_Integração_ao_Inovarse.docx` - Documento original
  - Documentos de ecossistema e modelo de negócio

---

## 7. Referências e Recursos

### Documentação Técnica
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [tRPC Documentation](https://trpc.io/)
- [React 19 Documentation](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)

### Conceitos MBP Triangle
- Framework geométrico rigoroso para alocação de recursos existenciais
- Baseado em coordenadas baricêntricas
- Restrição fundamental: M + B + P = 1

---

**Documento Criado**: 10 de Abril de 2026  
**Versão**: 1.0  
**Status**: Documentação em Progresso
