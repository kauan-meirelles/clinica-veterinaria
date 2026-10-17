import { Link } from "react-router-dom";
import { Clock, Mail, MapPin, PawPrint, Phone } from "lucide-react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "@icons-pack/react-simple-icons";

const QUICK_LINKS = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/veterinarios", label: "Veterinários" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
  { to: "/agendamentos", label: "Agendar consulta" },
];

// Deep-emerald inverse footer with credentials, hours and direct contact channels.
export default function Footer() {
  return (
    <footer className="bg-[#042F2E] text-teal-50" data-testid="site-footer">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-600/30 text-teal-200">
              <PawPrint className="size-5" />
            </span>
            <span className="font-heading text-lg font-semibold">Instituto Vida Animal</span>
          </div>
          <p className="text-sm leading-relaxed text-teal-100/70">
            Clínica veterinária dedicada à saúde e ao bem-estar dos pets, com atendimento humanizado
            e estrutura moderna em São Paulo.
          </p>
          <div className="flex gap-2">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-lg bg-teal-900/60 text-teal-200 transition-colors hover:bg-teal-800 hover:text-white"
              data-testid="footer-instagram-link"
            >
              <SiInstagram className="size-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex size-9 items-center justify-center rounded-lg bg-teal-900/60 text-teal-200 transition-colors hover:bg-teal-800 hover:text-white"
              data-testid="footer-facebook-link"
            >
              <SiFacebook className="size-4" />
            </a>
            <a
              href="https://wa.me/5511987654321"
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="flex size-9 items-center justify-center rounded-lg bg-teal-900/60 text-teal-200 transition-colors hover:bg-teal-800 hover:text-white"
              data-testid="footer-whatsapp-icon-link"
            >
              <SiWhatsapp className="size-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-teal-300">
            Navegação
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-teal-100/80">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="transition-colors hover:text-white"
                  data-testid={`footer-link-${link.to === "/" ? "inicio" : link.to.slice(1)}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-teal-300">
            Horários
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-teal-100/80">
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-teal-400" />
              Segunda a sábado · 08h às 20h
            </li>
            <li className="flex items-start gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-teal-400" />
              Plantão de emergência 24h, todos os dias
            </li>
          </ul>
          <p className="mt-4 rounded-lg bg-teal-900/60 p-3 text-xs leading-relaxed text-teal-200">
            Estabelecimento registrado no CRMV-SP · Responsável técnica: Dra. Marina Silva
            (CRMV-SP 29871)
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-teal-300">
            Contato
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-teal-100/80">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-400" />
              Rua dos Animais, 123 — São Paulo, SP
            </li>
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-teal-400" />
              (11) 98765-4321
            </li>
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-teal-400" />
              contato@vidaanimal.com
            </li>
          </ul>
          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            data-testid="footer-whatsapp-link"
          >
            <SiWhatsapp className="size-4" /> Chamar no WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-teal-800/60 py-5 text-center text-xs text-teal-100/60" data-testid="footer-copyright">
        © {new Date().getFullYear()} Instituto Vida Animal. Todos os direitos reservados.
      </div>
    </footer>
  );
}
