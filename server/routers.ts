import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createPartnerLead, createContact, createMceLead, createMceResult } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  partners: router({
    submitLead: publicProcedure
      .input(z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("Email inválido"),
        telefone: z.string().min(10, "Telefone inválido"),
        tipoServico: z.string().min(1, "Tipo de serviço é obrigatório"),
        descricao: z.string().optional(),
        cidade: z.string().optional(),
        estado: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        try {
          await createPartnerLead(input);
          return { success: true, message: "Sua solicitação foi enviada com sucesso!" };
        } catch (error) {
          console.error("Erro ao criar partner lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao processar sua solicitação",
          });
        }
      }),
  }),

  contact: router({
    submit: publicProcedure
      .input(z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        email: z.string().email("Email inválido"),
        telefone: z.string().optional(),
        assunto: z.string().min(1, "Assunto é obrigatório"),
        mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
      }))
      .mutation(async ({ input }) => {
        try {
          await createContact(input);
          return { success: true, message: "Sua mensagem foi enviada com sucesso!" };
        } catch (error) {
          console.error("Erro ao criar contato:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao processar sua mensagem",
          });
        }
      }),
  }),

  /**
   * Router MCE — Teste MBP Triangle (Mind-Body-Purpose)
   *
   * Fluxo:
   * 1. submitLead: Captura os dados do usuário (nome, telefone, email) e retorna o leadId
   * 2. submitResult: Persiste os valores calculados do MBP Triangle associados ao lead
   *
   * Conceito central: os valores armazenados representam PREFERÊNCIAS PESSOAIS,
   * não diagnóstico, evolução ou nível de desenvolvimento.
   */
  mce: router({
    /**
     * Cria um lead do teste MBP Triangle.
     * Retorna o leadId para ser usado em submitResult.
     */
    submitLead: publicProcedure
      .input(z.object({
        nome: z.string().min(1, "Nome é obrigatório"),
        telefone: z.string().min(8, "Telefone inválido"),
        email: z.string().email("Email inválido"),
      }))
      .mutation(async ({ input }) => {
        try {
          const { id } = await createMceLead(input);
          return {
            success: true,
            leadId: id,
            message: "Lead registrado com sucesso",
          };
        } catch (error) {
          console.error("Erro ao criar lead MBP:", error);
          // Não lança erro — a persistência é best-effort para não bloquear o usuário
          return {
            success: false,
            leadId: null,
            message: "Não foi possível registrar o lead",
          };
        }
      }),

    /**
     * Persiste o resultado do teste MBP Triangle.
     * Armazena os valores calculados (combinação de sliders + preferências pareadas)
     * e as preferências primárias brutas.
     */
    submitResult: publicProcedure
      .input(z.object({
        leadId: z.string().uuid("ID de lead inválido"),
        // Valores calculados (combinação de sliders + preferências pareadas)
        mind: z.number().min(0).max(10),
        body: z.number().min(0).max(10),
        purpose: z.number().min(0).max(10),
        // Preferências primárias brutas (sliders principais)
        prefMind: z.number().min(0).max(10),
        prefBody: z.number().min(0).max(10),
        prefPurpose: z.number().min(0).max(10),
      }))
      .mutation(async ({ input }) => {
        try {
          await createMceResult(input);
          return {
            success: true,
            message: "Resultado MBP Triangle salvo com sucesso",
          };
        } catch (error) {
          console.error("Erro ao salvar resultado MBP:", error);
          return {
            success: false,
            message: "Não foi possível salvar o resultado",
          };
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
