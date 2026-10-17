import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Eye,
  HeartHandshake,
  ShieldCheck,
  Siren,
  Target,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const FACILITY_IMAGE =
  "https://images.unsplash.com/photo-1654895716780-b4664497420d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzR8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBleGFtaW5pbmclMjBkb2d8ZW58MHx8fHwxNzkwMjk0NDQzfDA&ixlib=rb-4.1.0&q=85";

const VALUES = [
  {
    icon: Target,
    title: "Missão",
    text: "Promover saúde, carinho e qualidade de vida aos pets, com ética e responsabilidade em cada atendimento.",
  },
  {
    icon: Eye,
    title: "Visão",
    text: "Ser a clínica veterinária de referência em São Paulo, reconhecida pelo atendimento humanizado e pela excelência técnica.",
  },
  {
    icon: HeartHandshake,
    title: "Valores",
    text: "Amor aos animais, transparência com os tutores, evolução científica contínua e respeito em cada detalhe.",
  },
];

const TIMELINE = [
  {
    year: "2010",
    title: "A fundação",
    text: "O Instituto Vida Animal abre as portas com duas salas de atendimento e um sonho: medicina veterinária de excelência.",
  },
  {
    year: "2015",
    title: "Laboratório interno",
    text: "Passamos a realizar hemogramas e bioquímicos no próprio endereço, com resultado em até 24h.",
  },
  {
    year: "2019",
    title: "Centro cirúrgico e UTI",
    text: "Inauguração do centro cirúrgico com anestesia monitorada e UTI veterinária com plantão 24h.",
  },
  {
    year: "2022",
    title: "Espaço cat-friendly",
    text: "Área exclusiva para felinos, com espera, consultório e internação separados dos cães.",
  },
  {
    year: "2025",
    title: "30 mil atendimentos",
    text: "Atingimos a marca de 30 mil atendimentos realizados, sempre com a mesma missão.",
  },
];

const PROTOCOLS = [
  "Esterilização de materiais em autoclave",
  "Anestesia monitorada multiparamétrica",
  "Check-up pré-anestésico obrigatório",
  "Internação com acompanhamento contínuo",
];

export default function About() {
  return (
    <div>
      {/* Cabeçalho */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-14">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-teal-950" data-testid="about-title">
            Sobre Nós
          </h1>
          <p className="max-w-2xl text-teal-800/80">
            Conheça nossa história, nossa missão e a estrutura que construímos ao longo de 15 anos.
          </p>
        </div>
      </section>

      {/* História */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2" data-testid="about-story">
        <div className="space-y-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
            Uma clínica feita de histórias
          </h2>
          <p className="leading-relaxed text-slate-600">
            O Instituto Vida Animal foi fundado em 2010 com o propósito de oferecer o melhor cuidado
            e bem-estar aos animais de estimação. Começamos pequenos, com duas salas de consulta e
            muita vontade de fazer diferente — e foi assim que construímos cada etapa da nossa
            história: ouvindo tutores e cuidando de pets.
          </p>
          <p className="leading-relaxed text-slate-600">
            Hoje, nossa clínica conta com estrutura moderna, laboratório interno, centro cirúrgico,
            UTI 24h e uma equipe de especialistas altamente capacitados. O atendimento humanizado
            continua no centro de tudo: foco no conforto e na segurança dos nossos pacientes e seus
            tutores.
          </p>
          <p className="font-heading text-lg font-medium text-primary">
            Somos apaixonados pelo que fazemos.
          </p>
        </div>
        <img
          src={FACILITY_IMAGE}
          alt="Ambiente acolhedor da clínica para pets de todos os portes"
          className="aspect-[4/3] w-full rounded-3xl object-cover shadow-lg ring-1 ring-slate-900/10"
        />
      </section>

      {/* Missão, visão e valores */}
      <section className="mx-auto max-w-6xl px-4 pb-16" data-testid="about-values">
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((value) => (
            <Card key={value.title} size="sm" className="gap-3" data-testid={`about-value-${value.title.toLowerCase()}`}>
              <CardContent className="space-y-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <value.icon className="size-5" />
                </span>
                <h3 className="font-heading text-lg font-semibold text-slate-900">{value.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{value.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Linha do tempo */}
      <section className="bg-white py-16" data-testid="about-timeline">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-slate-900">
            Nossa linha do tempo
          </h2>
          <ol className="mt-10 space-y-8 border-l-2 border-teal-100 pl-6">
            {TIMELINE.map((item) => (
              <li key={item.year} className="relative">
                <span className="absolute -left-[31px] top-1 size-3.5 rounded-full border-2 border-primary bg-white" />
                <p className="font-heading text-sm font-semibold text-primary">{item.year}</p>
                <h3 className="font-heading text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Protocolos + CTA */}
      <section className="mx-auto max-w-6xl px-4 py-16" data-testid="about-protocols">
        <div className="grid items-center gap-10 rounded-3xl bg-[#042F2E] px-8 py-12 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="font-heading text-3xl font-semibold text-white">
              Segurança em cada procedimento
            </h2>
            <ul className="space-y-3">
              {PROTOCOLS.map((protocol) => (
                <li key={protocol} className="flex items-center gap-2 text-sm text-teal-50/90">
                  <ShieldCheck className="size-4 shrink-0 text-teal-300" /> {protocol}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4 rounded-2xl bg-teal-900/60 p-6">
            <div className="flex items-start gap-3">
              <Siren className="mt-0.5 size-5 shrink-0 text-teal-300" />
              <p className="text-sm leading-relaxed text-teal-50/90">
                Emergência não espera: nosso plantão 24h está de pé todos os dias do ano, com equipe
                dedicada e UTI veterinária.
              </p>
            </div>
            <Link
              to="/agendamentos"
              className={buttonVariants({ size: "lg" })}
              data-testid="about-cta-button"
            >
              <CalendarCheck data-icon="inline-start" /> Agendar consulta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

