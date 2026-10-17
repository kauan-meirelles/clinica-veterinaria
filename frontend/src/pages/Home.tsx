import { Link } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowRight,
  CalendarCheck,
  Cat,
  HeartPulse,
  Microscope,
  PawPrint,
  Quote,
  Scissors,
  Siren,
  Star,
} from "lucide-react";
import { useServices, useVeterinarians } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ServiceCard from "@/components/ServiceCard";
import VetCard from "@/components/VetCard";
import { cn } from "@/lib/utils";

const HERO_IMAGE =
  "https://images.pexels.com/photos/22504402/pexels-photo-22504402.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";

const STATS = [
  { value: "15+", label: "anos de história" },
  { value: "30 mil+", label: "atendimentos realizados" },
  { value: "12", label: "especialistas na equipe" },
  { value: "4.9", label: "avaliação média dos tutores" },
];

const DIFFERENTIATORS = [
  {
    icon: Siren,
    title: "Emergência 24h",
    description: "Pronto atendimento com UTI veterinária, todos os dias do ano — basta chegar ou ligar.",
    classes: "bg-primary text-white ring-0 lg:col-span-2",
    descriptionClasses: "text-teal-50/90",
  },
  {
    icon: Microscope,
    title: "Laboratório interno",
    description: "Exames com resultado em até 24h, sem sair da clínica.",
    classes: "bg-card ring-slate-900/5",
    descriptionClasses: "text-slate-600",
  },
  {
    icon: HeartPulse,
    title: "Centro cirúrgico",
    description: "Anestesia monitorada e pós-operatório completo.",
    classes: "bg-card ring-slate-900/5",
    descriptionClasses: "text-slate-600",
  },
  {
    icon: Scissors,
    title: "Grooming spa",
    description: "Banho e tosa com produtos hipoalergênicos e secamento controlado, de pequenos a grandes portes.",
    classes: "bg-card ring-slate-900/5 lg:col-span-2",
    descriptionClasses: "text-slate-600",
  },
  {
    icon: Cat,
    title: "Espaço cat-friendly",
    description: "Área exclusiva para felinos, longe de cães e de odores — menos estresse do início ao fim do atendimento.",
    classes: "bg-secondary text-secondary-foreground ring-0 lg:col-span-3",
    descriptionClasses: "text-teal-800/80",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "O Dr. Carlos operou a patinha do Thor com todo cuidado do mundo. Recebi fotos e updates em cada etapa do pós-operatório.",
    name: "Mariana Costa",
    role: "tutora do Thor",
  },
  {
    quote:
      "Minha gata odeia caixa de transporte, mas no espaço cat-friendly ela fica tranquila. A Dra. Marina entende felinos como ninguém.",
    name: "Roberto Santos",
    role: "tutor da Luna",
  },
  {
    quote: "Agendei pelo site num domingo à noite e fui atendido na segunda de manhã. Processo simples e equipe atenciosa.",
    name: "Juliana Prado",
    role: "tutora da Pipoca",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export default function Home() {
  const { services, isPending: servicesPending } = useServices();
  const { vets: allVets, isPending: vetsPending } = useVeterinarians();

  const featured = services.filter((s) => s.featured).slice(0, 4);
  const vets = allVets.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Hero */}
      <section className="bg-gradient-to-b from-secondary to-background" data-testid="home-hero">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-14 lg:grid-cols-2 lg:pt-20">
          <div className="space-y-6">
            <Badge
              variant="outline"
              className="border-primary/30 bg-white/70 text-primary"
              data-testid="home-hero-badge"
            >
              <PawPrint className="size-3.5" /> Clínica veterinária · São Paulo
            </Badge>
            <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Cuidando do seu pet com <span className="text-primary">amor e dedicação</span>
            </h1>
            <p className="max-w-lg text-lg text-slate-600">
              Consultas, vacinação, cirurgia e emergência 24h em uma estrutura moderna — com uma
              equipe que trata cada pet como se fosse seu.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/agendamentos"
                className={buttonVariants({ size: "lg" })}
                data-testid="home-hero-cta-agendar"
              >
                <CalendarCheck data-icon="inline-start" /> Agendar Consulta
              </Link>
              <Link
                to="/servicos"
                className={buttonVariants({ variant: "outline", size: "lg" })}
                data-testid="home-hero-cta-servicos"
              >
                Nossos Serviços <ArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-6 sm:grid-cols-4" data-testid="home-stats">
              {STATS.map((stat, i) => (
                <div key={stat.label}>
                  <p className="font-heading text-2xl font-semibold text-primary" data-testid={`home-stat-value-${i}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative pb-6 lg:pb-0" data-testid="home-hero-visual">
            <img
              src={HERO_IMAGE}
              alt="Veterinária examinando um cão na clínica"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl ring-1 ring-slate-900/10"
            />
            <div
              className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/90 p-4 shadow-lg ring-1 ring-slate-200 backdrop-blur animate-float sm:left-6"
              data-testid="home-hero-emergency-card"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-red-50 text-red-500">
                <Siren className="size-5" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                  </span>
                  Plantão aberto agora
                </p>
                <p className="text-xs text-slate-500">Emergência 24h · todos os dias</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços em destaque */}
      <section className="mx-auto max-w-6xl px-4 py-16" data-testid="home-services-section">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
              Nossos serviços
            </h2>
            <p className="text-slate-600">Cuidado completo para cada fase da vida do seu pet.</p>
          </div>
          <Link
            to="/servicos"
            className={buttonVariants({ variant: "ghost" })}
            data-testid="home-services-see-all"
          >
            Ver todos <ArrowRight />
          </Link>
        </motion.div>
        <div className="mt-8">
          {featured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-testid="home-services-grid">
              {featured.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            servicesPending && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* Diferenciais (bento) */}
      <section className="bg-white py-16" data-testid="home-differentiators">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl space-y-2 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
              Por que escolher o Instituto Vida Animal?
            </h2>
            <p className="text-slate-600">Estrutura completa, do banho à UTI, em um só lugar.</p>
          </motion.div>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {DIFFERENTIATORS.map((item, i) => (
              <motion.div
                key={item.title}
                {...fadeUp}
                className={cn("rounded-2xl p-6", item.classes)}
                data-testid={`home-differentiator-${i}`}
              >
                <item.icon className="size-6" />
                <h3 className="mt-3 font-heading text-lg font-semibold">{item.title}</h3>
                <p className={cn("mt-1 text-sm leading-relaxed", item.descriptionClasses)}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="mx-auto max-w-6xl px-4 py-16" data-testid="home-vets-section">
        <motion.div {...fadeUp} className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
              Nossos veterinários
            </h2>
            <p className="text-slate-600">Profissionais apaixonados por cuidar do seu pet.</p>
          </div>
          <Link
            to="/veterinarios"
            className={buttonVariants({ variant: "ghost" })}
            data-testid="home-vets-see-all"
          >
            Conhecer toda a equipe <ArrowRight />
          </Link>
        </motion.div>
        <div className="mt-8">
          {vets.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="home-vets-grid">
              {vets.map((vet) => (
                <VetCard key={vet.id} vet={vet} />
              ))}
            </div>
          ) : (
            vetsPending && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-80 animate-pulse rounded-2xl bg-muted" />
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className="bg-secondary py-16" data-testid="home-testimonials">
        <div className="mx-auto max-w-6xl px-4">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl space-y-2 text-center">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-teal-950">
              Quem confia, recomenda
            </h2>
            <p className="text-teal-800/80">Histórias de tutores que passam por aqui.</p>
          </motion.div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial, i) => (
              <Card key={testimonial.name} size="sm" className="gap-3" data-testid={`home-testimonial-${i}`}>
                <CardContent className="space-y-3">
                  <Quote className="size-5 text-primary/50" />
                  <p className="text-sm leading-relaxed text-slate-700">{testimonial.quote}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{testimonial.name}</p>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                    <span className="flex text-amber-400">
                      {[0, 1, 2, 3, 4].map((star) => (
                        <Star key={star} className="size-3.5 fill-current" />
                      ))}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-16" data-testid="home-cta-band">
        <motion.div
          {...fadeUp}
          className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#042F2E] px-8 py-12 text-center lg:flex-row lg:text-left"
        >
          <div className="space-y-2">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Pronto para cuidar do seu pet?
            </h2>
            <p className="text-teal-100/80">
              Agende em menos de um minuto — escolha o serviço, o dia e o horário.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/agendamentos"
              className={buttonVariants({ size: "lg" })}
              data-testid="home-cta-band-button"
            >
              Agendar agora
            </Link>
            <a
              href="tel:+5511987654321"
              className={buttonVariants({ variant: "outline", size: "lg" })}
              data-testid="home-cta-band-call"
            >
              (11) 98765-4321
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

