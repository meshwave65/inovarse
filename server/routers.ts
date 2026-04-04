import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createPartnerLead, createContact } from "./db";

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
});

export type AppRouter = typeof appRouter;
