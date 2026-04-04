import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Leaf, Heart, Sparkles, Users, TrendingUp, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";

export default function Home() {
  const [, setLocation] = useLocation();

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo_inovarse.jpeg" alt="Inovarse" className="w-10 h-10 rounded-full" />
            <span className="font-semibold text-lg text-foreground">Inovarse</span>
          </div>
          <div className="hidden md:flex gap-8">
            <a href="#filosofia" className="text-sm text-muted-foreground hover:text-foreground transition">Filosofia</a>
            <a href="#teste" className="text-sm text-muted-foreground hover:text-foreground transition">Teste MCE</a>
            <a href="#programas" className="text-sm text-muted-foreground hover:text-foreground transition">Programas</a>
            <a href="#rede" className="text-sm text-muted-foreground hover:text-foreground transition">Rede</a>
            <a href="/contato" className="text-sm text-muted-foreground hover:text-foreground transition">Contato</a>
            <a href="/parceiros" className="text-sm text-muted-foreground hover:text-foreground transition">Parceiros</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-emerald-50 to-white pt-20 pb-32">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-emerald-100 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              A verdadeira beleza nasce de dentro para fora
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Bem-vindo ao Ecossistema Inovarse, onde integramos Mente, Corpo e Espírito em uma abordagem holística e preventiva de saúde e bem-estar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2" onClick={() => setLocation("/teste")}>
                Comece o Teste MCE <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => setLocation("#filosofia")}>
                Saiba Mais
              </Button>
            </div>
          </motion.div>

          {/* MCE Triangle Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <svg viewBox="0 0 300 300" className="w-full h-auto">
                {/* Triangle background areas */}
                <path d="M 150 30 L 50 250 L 250 250 Z" fill="none" stroke="#d1fae5" strokeWidth="2" />
                <path d="M 150 100 L 75 250 L 225 250 Z" fill="#e0f2fe" opacity="0.3" />
                <path d="M 150 30 L 150 100 L 75 250 Z" fill="#f3e8ff" opacity="0.3" />
                <path d="M 150 30 L 150 100 L 225 250 Z" fill="#d1fae5" opacity="0.3" />
                
                {/* Labels */}
                <text x="150" y="25" textAnchor="middle" className="text-sm font-bold fill-foreground">MENTE</text>
                <text x="40" y="270" textAnchor="middle" className="text-sm font-bold fill-foreground">CORPO</text>
                <text x="260" y="270" textAnchor="middle" className="text-sm font-bold fill-foreground">ESPÍRITO</text>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filosofia Section */}
      <section id="filosofia" className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Nossa Filosofia Integrativa</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acreditamos que a verdadeira saúde e beleza surgem do equilíbrio harmônico entre as três dimensões fundamentais do ser humano.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Mente */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Mente</h3>
              <p className="text-muted-foreground">
                Clareza mental, foco, paz interior e gestão do estresse. Uma mente equilibrada é a base para decisões conscientes e bem-estar emocional.
              </p>
            </motion.div>

            {/* Corpo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200"
            >
              <div className="w-12 h-12 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Corpo</h3>
              <p className="text-muted-foreground">
                Vitalidade física, nutrição adequada, movimento consciente e cuidado estético. Um corpo saudável reflete a harmonia interna.
              </p>
            </motion.div>

            {/* Espírito */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
            >
              <div className="w-12 h-12 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">Espírito</h3>
              <p className="text-muted-foreground">
                Propósito, conexão, gratidão e tempo para si. O espírito alimentado torna a vida significativa e plena.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Teste MCE Section */}
      <section id="teste" className="py-20 bg-emerald-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Teste Triângulo MCE</h2>
                  <p className="text-muted-foreground">Descubra seu equilíbrio pessoal</p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                O Teste Triângulo MCE é nossa ferramenta diagnóstica central. Em poucos minutos, você receberá um mapa personalizado do seu equilíbrio entre Mente, Corpo e Espírito, revelando oportunidades para otimizar sua saúde e bem-estar integral.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Diagnóstico Rápido</p>
                  <p className="text-sm text-muted-foreground">Avaliação completa em 5 minutos</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-semibold text-emerald-900 mb-2">Personalizado</p>
                  <p className="text-sm text-muted-foreground">Recomendações exclusivas para você</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-semibold text-purple-900 mb-2">Contínuo</p>
                  <p className="text-sm text-muted-foreground">Acompanhe sua evolução ao longo do tempo</p>
                </div>
              </div>

              <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-white gap-2" onClick={() => setLocation("/teste")}>
                Começar Teste Agora <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programas GlowFit Section */}
      <section id="programas" className="py-20 bg-white">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Programas GlowFit</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pacotes personalizados que integram tratamentos, procedimentos e consultas especializadas para seu equilíbrio MCE.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* GlowFit Mente */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
            >
              <Card className="h-full border-2 border-blue-200 hover:shadow-lg transition">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="w-12 h-12 rounded-lg bg-blue-500 text-white flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <CardTitle>GlowFit Mente</CardTitle>
                  <CardDescription>Equilíbrio emocional e clareza mental</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Terapias holísticas e meditação</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Apoio psicológico especializado</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Workshops de desenvolvimento pessoal</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Gestão do estresse e ansiedade</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* GlowFit Corpo */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="h-full border-2 border-emerald-200 hover:shadow-lg transition">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500 text-white flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6" />
                  </div>
                  <CardTitle>GlowFit Corpo</CardTitle>
                  <CardDescription>Vitalidade física e estética avançada</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Nutrição integrativa personalizada</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Atividade física e movimento consciente</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Tratamentos estéticos e faciais</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Procedimentos corporais funcionais</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* GlowFit Espírito */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full border-2 border-purple-200 hover:shadow-lg transition">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <div className="w-12 h-12 rounded-lg bg-purple-500 text-white flex items-center justify-center mb-4">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <CardTitle>GlowFit Espírito</CardTitle>
                  <CardDescription>Propósito e conexão interior</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Retiros e círculos de partilha</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Mentoria para descoberta de propósito</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Terapias energéticas e cristaloterapia</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="text-purple-500 font-bold">•</span>
                      <span className="text-sm text-muted-foreground">Práticas de gratidão e conexão</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rede Credenciada Section */}
      <section id="rede" className="py-20 bg-emerald-50">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Rede Credenciada Inovarse</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma rede curada de profissionais e estabelecimentos alinhados com nossa filosofia integrativa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Para Clientes */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-accent" />
                <h3 className="text-2xl font-bold text-foreground">Para Clientes</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Rede de Confiança</p>
                    <p className="text-sm text-muted-foreground">Profissionais qualificados e alinhados com nossa filosofia</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Personalização</p>
                    <p className="text-sm text-muted-foreground">Recomendações baseadas no seu Teste MCE</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Conveniência</p>
                    <p className="text-sm text-muted-foreground">Encontre profissionais próximos a você</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Benefícios Exclusivos</p>
                    <p className="text-sm text-muted-foreground">Descontos e ofertas especiais na rede</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Para Parceiros */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 border border-border"
            >
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-8 h-8 text-accent" />
                <h3 className="text-2xl font-bold text-foreground">Para Parceiros</h3>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Aumento de Clientes</p>
                    <p className="text-sm text-muted-foreground">Acesso à base de clientes Inovarse</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Marketing Conjuto</p>
                    <p className="text-sm text-muted-foreground">Campanhas e suporte da marca Inovarse</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Desenvolvimento</p>
                    <p className="text-sm text-muted-foreground">Treinamento e capacitação contínua</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-accent font-bold text-lg">✓</span>
                  <div>
                    <p className="font-semibold text-foreground">Tecnologia</p>
                    <p className="text-sm text-muted-foreground">Plataforma para gestão e agendamentos</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Critérios de Credenciamento */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 border border-border"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Critérios de Credenciamento</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground mb-2">Qualificação</p>
                <p className="text-sm text-muted-foreground">Certificações e experiência comprovada</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground mb-2">Alinhamento</p>
                <p className="text-sm text-muted-foreground">Compromisso com abordagem integrativa</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground mb-2">Qualidade</p>
                <p className="text-sm text-muted-foreground">Padrões de excelência e resultados</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <Leaf className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-foreground mb-2">Inovação</p>
                <p className="text-sm text-muted-foreground">Abertura a novas metodologias</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Parceiros */}
      <section className="py-20 bg-gradient-to-r from-accent/10 to-accent/5">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-4xl font-bold text-foreground mb-4">Quer se tornar um Parceiro Inovarse?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se à nossa rede de profissionais e estabelecimentos comprometidos com a saúde integrativa.
            </p>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white gap-2" onClick={() => setLocation("/parceiros")}>
              Solicitar Credenciamento <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo_inovarse.jpeg" alt="Inovarse" className="w-10 h-10 rounded-full" />
                <span className="font-semibold text-lg">Inovarse</span>
              </div>
              <p className="text-sm text-white/70">Estética Integrativa para Saúde e Bem-estar</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegação</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#filosofia" className="hover:text-white transition">Filosofia</a></li>
                <li><a href="#teste" className="hover:text-white transition">Teste MCE</a></li>
                <li><a href="#programas" className="hover:text-white transition">Programas</a></li>
                <li><a href="#rede" className="hover:text-white transition">Rede</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="/contato" className="hover:text-white transition">Contato</a></li>
                <li><a href="/parceiros" className="hover:text-white transition">Seja um Parceiro</a></li>
                <li><a href="#" className="hover:text-white transition">Modelo de Negócio</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li>Email: contato@inovarse.com</li>
                <li>Telefone: (11) 9999-9999</li>
                <li>São Paulo, SP</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>&copy; 2026 Ecossistema Inovarse. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
