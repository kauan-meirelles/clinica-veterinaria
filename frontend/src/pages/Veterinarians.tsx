import { Link } from "react-router-dom";
import { CalendarCheck, ShieldCheck } from "lucide-react";
import { useVeterinarians } from "@/lib/catalog";
import { buttonVariants } from "@/components/ui/button";
import VetCard from "@/components/VetCard";

export default function Veterinarians() {
  const { vets, isPending } = useVeterinarians();

  return (
    <div>
      {/* Cabeçalho */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-14">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-teal-950" data-testid="vets-title">
            Nossa Equipe
          </h1>
          <p className="max-w-2xl text-teal-800/80">
            Profissionais apaixonados por cuidar do seu pet — todos com registro ativo no CRMV-SP e
            formação continuada.
          </p>
        </div>
      </section>

      {/* Diretório */}
      <section className="mx-auto max-w-6xl px-4 py-12" data-testid="vets-directory">
        {vets.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" data-testid="vets-grid">
            {vets.map((vet) => (
              <VetCard key={vet.id} vet={vet} />
            ))}
          </div>
        ) : (
          isPending && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          )
        )}

        <p className="mt-8 flex items-center gap-2 text-xs text-slate-500" data-testid="vets-crmv-note">
          <ShieldCheck className="size-4 text-primary" />
          Todos os profissionais possuem registro ativo no CRMV-SP, verificado anualmente.
        </p>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#042F2E] px-8 py-10 text-center lg:flex-row lg:text-left">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-semibold text-white">
              Quer escolher quem atende seu pet?
            </h2>
            <p className="text-sm text-teal-100/80">
              No agendamento online você seleciona o profissional de preferência.
            </p>
          </div>
          <Link to="/agendamentos" className={buttonVariants({ size: "lg" })} data-testid="vets-cta-button">
            <CalendarCheck data-icon="inline-start" /> Agendar consulta
          </Link>
        </div>
      </section>
    </div>
  );
}
