import { Badge } from "@/components/ui/badge";
import { APPOINTMENT_STATUS_LABELS } from "@/lib/format";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800",
  confirmado: "bg-teal-100 text-teal-800",
  concluido: "bg-emerald-100 text-emerald-800",
  cancelado: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("border-transparent", STATUS_STYLES[status])} data-testid={`status-badge-${status}`}>
      {APPOINTMENT_STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
