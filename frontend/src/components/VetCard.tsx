import { Link } from "react-router-dom";
import { CalendarCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Veterinarian } from "@/types";

// Team card with photo, CRMV badge, specialties and a profile dialog with full bio.
export default function VetCard({ vet }: { vet: Veterinarian }) {
  const firstName = vet.name.split(" ")[0];

  return (
    <Card className="group gap-0 overflow-hidden p-0" data-testid={`vet-card-${vet.id}`}>
      <div className="aspect-[4/5] overflow-hidden bg-secondary">
        {vet.image_url ? (
          <img
            src={vet.image_url}
            alt={vet.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-secondary text-5xl">🐾</div>
        )}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-heading text-base font-semibold text-foreground">{vet.name}</h3>
          <p className="text-sm text-muted-foreground">{vet.title}</p>
        </div>
        <Badge variant="outline" className="w-fit text-xs text-primary">
          {vet.crmv}
        </Badge>
        <div className="flex flex-wrap gap-1">
          {vet.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs font-normal">
              {specialty}
            </Badge>
          ))}
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" /> {vet.shift}
        </p>

        <div className="mt-auto flex items-center gap-2 pt-2">
          <Dialog>
            <DialogTrigger
              className={buttonVariants({ variant: "outline", size: "sm" })}
              data-testid={`vet-profile-button-${vet.id}`}
            >
              Perfil
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{vet.name}</DialogTitle>
                <DialogDescription>
                  {vet.title} · {vet.crmv}
                </DialogDescription>
              </DialogHeader>
              {vet.image_url && (
                <img src={vet.image_url} alt={vet.name} className="h-44 w-full rounded-lg object-cover" />
              )}
              <p className="text-sm leading-relaxed text-muted-foreground">{vet.bio}</p>
              <p className="text-xs text-muted-foreground">
                {vet.experience_years} anos de experiência · Atendimento: {vet.shift}
              </p>
              <Link
                to={`/agendamentos?vet=${vet.id}`}
                className={buttonVariants({ size: "sm" })}
                data-testid={`vet-dialog-book-${vet.id}`}
              >
                <CalendarCheck data-icon="inline-start" /> Agendar com {firstName}
              </Link>
            </DialogContent>
          </Dialog>
          <Link
            to={`/agendamentos?vet=${vet.id}`}
            className={buttonVariants({ variant: "outline", size: "sm" })}
            data-testid={`vet-book-${vet.id}`}
          >
            Agendar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
