import { Link } from "react-router-dom";
import { ArrowRight, Check, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { serviceIcon } from "@/lib/icons";
import { formatCurrency, SERVICE_CATEGORY_LABELS } from "@/lib/format";
import type { Service } from "@/types";

// Catalog card: icon, category badge, highlights and a direct booking hook.
export default function ServiceCard({ service }: { service: Service }) {
  const Icon = serviceIcon(service.icon);

  return (
    <Card
      size="sm"
      className="flex flex-col gap-3 transition-all hover:-translate-y-1 hover:shadow-md"
      data-testid={`service-card-${service.slug}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Icon className="size-5" />
          </span>
          <Badge variant="outline" className="text-muted-foreground">
            {SERVICE_CATEGORY_LABELS[service.category] ?? service.category}
          </Badge>
        </div>
        <CardTitle className="font-heading text-lg">{service.name}</CardTitle>
        <CardDescription className="line-clamp-2">{service.short_description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          {service.features.slice(0, 3).map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check className="mt-0.5 size-3.5 shrink-0 text-primary" /> {feature}
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="justify-between border-t pt-4">
        <div className="text-sm">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3.5" /> {service.duration_min} min
          </span>
          {service.price_from != null ? (
            <span>
              <span className="block text-xs text-muted-foreground">a partir de</span>
              <span className="font-semibold text-foreground">{formatCurrency(service.price_from)}</span>
            </span>
          ) : (
            <span className="font-semibold text-foreground">{service.price_note ?? "Sob consulta"}</span>
          )}
        </div>
        <Link
          to={`/agendamentos?service=${service.slug}`}
          className={buttonVariants({ size: "sm" })}
          data-testid={`service-book-${service.slug}`}
        >
          Agendar <ArrowRight />
        </Link>
      </CardFooter>
    </Card>
  );
}
