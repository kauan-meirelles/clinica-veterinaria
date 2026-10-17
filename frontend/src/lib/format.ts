import { ApiError } from "@/lib/api";

// pt-BR formatting helpers: phone mask, dates, currency and shared label maps.

export function maskPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

// "2025-08-24" -> "24/08/2025" — string surgery on purpose: new Date("YYYY-MM-DD") parses as
// UTC midnight and shifts the day in timezones behind UTC.
export function formatDateBR(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  return y && m && d ? `${d}/${m}/${y}` : isoDate;
}

export function formatDateTimeBR(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

// Booking slots: 08:00 → 19:30, every 30 minutes.
export const TIME_SLOTS: string[] = Array.from({ length: 24 }, (_, i) => {
  const hour = 8 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${String(hour).padStart(2, "0")}:${minute}`;
});

export const SERVICE_CATEGORY_LABELS: Record<string, string> = {
  clinica: "Clínica",
  estetica: "Estética",
  prevencao: "Prevenção",
  emergencia: "Emergência",
};

export const APPOINTMENT_STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

// Turns a failed apiGet/apiPost into a friendly pt-BR message — FastAPI 422s carry
// {detail: [...]} payloads, our HTTPExceptions carry a plain string.
export function apiErrorMessage(err: unknown, fallback = "Ocorreu um erro inesperado. Tente novamente."): string {
  if (err instanceof ApiError) {
    const detail = (err.body as { detail?: unknown } | null)?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail) && detail.length > 0) {
      const first = detail[0] as { msg?: string } | undefined;
      if (first?.msg) return `Verifique os dados informados (${first.msg}).`;
    }
  }
  return err instanceof Error ? err.message : fallback;
}
