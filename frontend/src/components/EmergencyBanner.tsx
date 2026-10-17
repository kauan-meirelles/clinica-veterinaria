import { Phone, Siren } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";

// Thin emergency strip above the navbar: 24h hotline + WhatsApp, always one tap away.
export default function EmergencyBanner() {
  return (
    <div className="bg-[#042F2E] text-teal-50" data-testid="emergency-banner">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-1.5 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <Siren className="size-3.5 text-teal-300" />
          <span>
            <strong className="font-semibold">Emergência 24h</strong> — plantão todos os dias do ano
          </span>
        </span>
        <span className="flex items-center gap-3">
          <a
            href="tel:+5511987654321"
            className="flex items-center gap-1 font-medium text-teal-100 transition-colors hover:text-white"
            data-testid="emergency-call-link"
          >
            <Phone className="size-3.5" /> (11) 98765-4321
          </a>
          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 font-medium text-emerald-300 transition-colors hover:text-emerald-200 sm:flex"
            data-testid="emergency-whatsapp-link"
          >
            <SiWhatsapp className="size-3.5" /> WhatsApp
          </a>
        </span>
      </div>
    </div>
  );
}
