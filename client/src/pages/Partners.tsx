import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function Partners() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    tipoServico: "",
    descricao: "",
    cidade: "",
    estado: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.partners.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Sua solicitação foi enviada com sucesso!");
      setSubmitted(true);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        tipoServico: "",
        descricao: "",
        cidade: "",
        estado: "",
      });
      setTimeout(() => setLocation("/"), 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Erro ao enviar formulário");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.email || !formData.telefone || !formData.tipoServico) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    submitMutation.mutate(formData);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-accent" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Obrigado!</h2>
          <p className="text-muted-foreground mb-8">
            Sua solicitação foi recebida com sucesso. Nossa equipe entrará em contato em breve para discutir sua participação no Ecossistema Inovarse.
          </p>
          <Button onClick={() => setLocation("/")} className="w-full bg-accent hover:bg-accent/90 text-white">
            Voltar para Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/10 to-accent/5 py-12 border-b border-border">
        <div className="container max-w-6xl mx-auto px-4">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <h1 className="text-4xl font-bold text-foreground mb-2">Credenciamento de Parceiros</h1>
          <p className="text-lg text-muted-foreground">
            Junte-se à rede Inovarse e expanda suas oportunidades de negócio
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-6 bg-emerald-50 rounded-lg border border-emerald-200"
          >
            <div className="text-3xl font-bold text-accent mb-2">1</div>
            <h3 className="font-semibold text-foreground mb-2">Candidature</h3>
            <p className="text-sm text-muted-foreground">
              Preencha o formulário com suas informações e tipo de serviço
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="font-semibold text-foreground mb-2">Análise</h3>
            <p className="text-sm text-muted-foreground">
              Nossa equipe avaliará seu perfil e alinhamento com a Inovarse
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 bg-purple-50 rounded-lg border border-purple-200"
          >
            <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
            <h3 className="font-semibold text-foreground mb-2">Integração</h3>
            <p className="text-sm text-muted-foreground">
              Após aprovação, você será integrado à rede com suporte completo
            </p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-border">
            <CardHeader>
              <CardTitle>Formulário de Credenciamento</CardTitle>
              <CardDescription>
                Preencha os campos abaixo para solicitar seu credenciamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Nome Completo *
                    </label>
                    <Input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Telefone *
                    </label>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Tipo de Serviço *
                    </label>
                    <Select value={formData.tipoServico} onValueChange={(value) => setFormData({ ...formData, tipoServico: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clinica-medica">Clínica Médica</SelectItem>
                        <SelectItem value="clinica-estetica">Clínica de Estética</SelectItem>
                        <SelectItem value="laboratorio">Laboratório</SelectItem>
                        <SelectItem value="academia">Academia</SelectItem>
                        <SelectItem value="psicologia">Psicologia</SelectItem>
                        <SelectItem value="nutricao">Nutrição</SelectItem>
                        <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                        <SelectItem value="terapias-alternativas">Terapias Alternativas</SelectItem>
                        <SelectItem value="restaurante">Restaurante</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Cidade
                    </label>
                    <Input
                      type="text"
                      placeholder="São Paulo"
                      value={formData.cidade}
                      onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Estado
                    </label>
                    <Input
                      type="text"
                      placeholder="SP"
                      value={formData.estado}
                      onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Descrição do Serviço
                  </label>
                  <Textarea
                    placeholder="Descreva seu serviço, experiência e por que gostaria de fazer parte da rede Inovarse..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    rows={6}
                  />
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <p className="text-sm text-muted-foreground">
                    * Campos obrigatórios. Seus dados serão utilizados apenas para análise de credenciamento e comunicação com nossa equipe.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-accent hover:bg-accent/90 text-white py-6 text-lg"
                >
                  {submitMutation.isPending ? "Enviando..." : "Enviar Solicitação"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
