import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import { useServices } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import ServiceCard from "@/components/ServiceCard";
import { cn } from "@/lib/utils";

const FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "clinica", label: "Clínica" },
  { value: "estetica", label: "Estética" },
  { value: "prevencao", label: "Prevenção" },
  { value: "emergencia", label: "Emergência" },
];

export default function Services() {
  const [filter, setFilter] = useState("todos");
  const { services, isPending } = useServices();
  const visible = services.filter(
    (service) => filter === "todos" || service.category === filter
  );

  return (
    <div>
      {/* Cabeçalho */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-14">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-teal-950" data-testid="services-title">
            Nossos Serviços
          </h1>
          <p className="max-w-2xl text-teal-800/80">
            Cuidado completo para o seu pet — do check-up de rotina ao pronto-atendimento, com
            estrutura moderna e preços transparentes.
          </p>
        </div>
      </section>

      {/* Catálogo */}
      <section className="mx-auto max-w-6xl px-4 py-12" data-testid="services-catalog">
        <div className="flex flex-wrap gap-2" data-testid="services-filters">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filter === option.value
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary/40 hover:text-primary"
              )}
              data-testid={`service-filter-${option.value}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {visible.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="services-grid">
              {visible.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : isPending ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-card p-6 text-sm text-muted-foreground ring-1 ring-slate-900/5" data-testid="services-empty-filter">
              Nenhum serviço nesta categoria.
            </p>
          )}
        </div>

        <p className="mt-8 text-xs text-slate-500" data-testid="services-pricing-note">
          * Valores de referência para consulta livre — o orçamento final depende da espécie, do
          porte e do plano terapêutico. A emergência 24h funciona por ordem de gravidade.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#042F2E] px-8 py-10 text-center lg:flex-row lg:text-left">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold text-white">
              Encontrou o serviço ideal?
            </h2>
            <p className="text-sm text-teal-100/80">
              Escolha o dia e o horário que ficarem melhores para você.
            </p>
          </div>
          <Link to="/agendamentos" className={buttonVariants({ size: "lg" })} data-testid="services-cta-button">
            <CalendarCheck data-icon="inline-start" /> Agendar agora
          </Link>
        </div>
      </section>
    </div>
  );
}
