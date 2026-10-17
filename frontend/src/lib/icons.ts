import type { LucideIcon } from "lucide-react";
import { HeartPulse, Microscope, Scissors, Siren, Stethoscope, Syringe } from "lucide-react";

// Maps the icon key stored on Service documents (seed.py) to a lucide glyph.
const SERVICE_ICONS: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  scissors: Scissors,
  syringe: Syringe,
  siren: Siren,
  "heart-pulse": HeartPulse,
  microscope: Microscope,
};

export function serviceIcon(icon: string): LucideIcon {
  return SERVICE_ICONS[icon] ?? Stethoscope;
}
