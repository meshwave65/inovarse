import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock do contexto
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("partners.submitLead", () => {
  it("deve validar campos obrigatórios", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.partners.submitLead({
        nome: "",
        email: "test@example.com",
        telefone: "11999999999",
        tipoServico: "clinica-medica",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.message).toContain("Nome");
    }
  });

  it("deve validar formato de email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.partners.submitLead({
        nome: "João Silva",
        email: "email-invalido",
        telefone: "11999999999",
        tipoServico: "clinica-medica",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.message).toContain("Email");
    }
  });

  it("deve validar comprimento mínimo do telefone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.partners.submitLead({
        nome: "João Silva",
        email: "joao@example.com",
        telefone: "123",
        tipoServico: "clinica-medica",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.message).toContain("Telefone");
    }
  });

  it("deve aceitar dados válidos", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.partners.submitLead({
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "11999999999",
      tipoServico: "clinica-medica",
      descricao: "Clínica de estética especializada",
      cidade: "São Paulo",
      estado: "SP",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });
});

describe("contact.submit", () => {
  it("deve validar campos obrigatórios de contato", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        nome: "",
        email: "test@example.com",
        assunto: "Dúvida",
        mensagem: "Tenho uma dúvida sobre o programa",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.message).toContain("Nome");
    }
  });

  it("deve validar comprimento mínimo da mensagem", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.submit({
        nome: "João Silva",
        email: "joao@example.com",
        assunto: "Dúvida",
        mensagem: "Oi",
      });
      expect.fail("Deveria ter lançado erro");
    } catch (error: any) {
      expect(error.message).toContain("Mensagem");
    }
  });

  it("deve aceitar dados válidos de contato", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      nome: "João Silva",
      email: "joao@example.com",
      telefone: "11999999999",
      assunto: "Dúvida sobre Programas",
      mensagem: "Gostaria de saber mais sobre os Programas GlowFit",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("sucesso");
  });

  it("deve aceitar contato sem telefone", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.submit({
      nome: "João Silva",
      email: "joao@example.com",
      assunto: "Dúvida",
      mensagem: "Tenho uma dúvida sobre o programa GlowFit",
    });

    expect(result.success).toBe(true);
  });
});
