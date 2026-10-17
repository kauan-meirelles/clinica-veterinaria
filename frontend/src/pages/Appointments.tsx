import { useEffect, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CircleCheck, Clock, Siren } from "lucide-react";
import { apiPost } from "@/lib/api";
import { useServices, useVeterinarians } from "@/lib/catalog";
import { apiErrorMessage, formatDateBR, maskPhone, TIME_SLOTS } from "@/lib/format";
import type { Appointment } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const SPECIES = ["Cão", "Gato", "Outro"];
const ANY_VET = "qualquer";

interface FormState {
  tutor_name: string;
  email: string;
  phone: string;
  service_id: string;
  vet_id: string;
  date: string;
  time_slot: string;
  pet_name: string;
  pet_species: string;
  message: string;
}

const INITIAL_FORM: FormState = {
  tutor_name: "",
  email: "",
  phone: "",
  service_id: "",
  vet_id: "",
  date: "",
  time_slot: "",
  pet_name: "",
  pet_species: "Cão",
  message: "",
};

export default function Appointments() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [created, setCreated] = useState<Appointment | null>(null);

  const { services, isPending: servicesPending } = useServices();
  const { vets, isPending: vetsPending } = useVeterinarians();
  const selectedService = services.find((s) => s.id === form.service_id);
  const selectedVet = vets.find((v) => v.id === form.vet_id);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  // Pre-select service/vet when arriving from catalog or team links (?service=slug / ?vet=id).
  useEffect(() => {
    const serviceSlug = searchParams.get("service");
    const vetId = searchParams.get("vet");
    setForm((current) => {
      if (serviceSlug && !current.service_id) {
        const service = services.find((s) => s.slug === serviceSlug);
        if (service) return { ...current, service_id: service.id };
      }
      if (vetId && !current.vet_id) {
        const vet = vets.find((v) => v.id === vetId);
        if (vet) return { ...current, vet_id: vet.id };
      }
      return current;
    });
  }, [services, vets, searchParams]);

  const mutation = useMutation({
    mutationFn: (payload: FormState) =>
      apiPost<Appointment>("/appointments", {
        tutor_name: payload.tutor_name.trim(),
        email: payload.email.trim(),
        phone: payload.phone.trim(),
        service_id: payload.service_id || null,
        // Sent too so the booking keeps its service label even if the id came from the built-in catalog.
        service_name: services.find((s) => s.id === payload.service_id)?.name ?? null,
        vet_id: payload.vet_id && payload.vet_id !== ANY_VET ? payload.vet_id : null,
        date: payload.date,
        time_slot: payload.time_slot,
        pet_name: payload.pet_name.trim(),
        pet_species: payload.pet_species,
        message: payload.message.trim() || null,
      }),
    onSuccess: (appointment) => {
      setCreated(appointment);
      setForm(INITIAL_FORM);
      toast.success("Agendamento enviado com sucesso!");
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Informe um e-mail válido.");
      return;
    }
    if (form.phone.replace(/\D/g, "").length < 10) {
      toast.error("Informe um telefone válido com DDD, ex: (11) 98765-4321.");
      return;
    }
    mutation.mutate(form);
  }

  return (
    <div>
      {/* Cabeçalho */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-14">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-teal-950" data-testid="booking-title">
            Agende uma Consulta
          </h1>
          <p className="max-w-2xl text-teal-800/80">
            Facilidade e rapidez no seu agendamento — escolha o serviço, o profissional e o horário.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]" data-testid="booking-content">
        {/* Formulário */}
        <Card data-testid="booking-form-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Dados do agendamento</CardTitle>
            <CardDescription>
              Preencha as informações abaixo — nossa equipe confirmará seu horário em seguida.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" data-testid="booking-form">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="booking-tutor-name">Nome completo do tutor</Label>
                <Input
                  id="booking-tutor-name"
                  value={form.tutor_name}
                  onChange={(e) => set("tutor_name")(e.target.value)}
                  placeholder="Como você se chama"
                  required
                  data-testid="booking-input-tutor-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-email">E-mail</Label>
                <Input
                  id="booking-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email")(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  required
                  data-testid="booking-input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-phone">Telefone / WhatsApp</Label>
                <Input
                  id="booking-phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set("phone")(maskPhone(e.target.value))}
                  placeholder="(11) 98765-4321"
                  required
                  data-testid="booking-input-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-service-trigger">Serviço</Label>
                <Select value={form.service_id || null} onValueChange={set("service_id")}>
                  <SelectTrigger className="w-full" data-testid="booking-select-service">
                    <SelectValue>
                      {(value) =>
                        value && services.find((s) => s.id === value)
                          ? services.find((s) => s.id === value)!.name
                          : servicesPending
                            ? "Carregando serviços..."
                            : "Selecione o serviço"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-vet-trigger">Veterinário</Label>
                <Select
                  value={form.vet_id || ANY_VET}
                  onValueChange={set("vet_id")}
                >
                  <SelectTrigger className="w-full" data-testid="booking-select-vet">
                    <SelectValue>
                      {(value) =>
                        value && value !== ANY_VET && vets.find((v) => v.id === value)
                          ? vets.find((v) => v.id === value)!.name
                          : vetsPending
                            ? "Carregando equipe..."
                            : "Sem preferência"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ANY_VET}>Sem preferência</SelectItem>
                    {vets.map((vet) => (
                      <SelectItem key={vet.id} value={vet.id}>
                        {vet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-date">Data</Label>
                <Input
                  id="booking-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date")(e.target.value)}
                  required
                  data-testid="booking-input-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-time-trigger">Horário</Label>
                <Select value={form.time_slot || null} onValueChange={set("time_slot")}>
                  <SelectTrigger className="w-full" data-testid="booking-select-time">
                    <SelectValue>{(value) => (value ? String(value) : "Escolha o horário")}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-pet-name">Nome do pet</Label>
                <Input
                  id="booking-pet-name"
                  value={form.pet_name}
                  onChange={(e) => set("pet_name")(e.target.value)}
                  placeholder="Ex: Thor"
                  required
                  data-testid="booking-input-pet-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-species-trigger">Espécie</Label>
                <Select value={form.pet_species} onValueChange={set("pet_species")}>
                  <SelectTrigger className="w-full" data-testid="booking-select-species">
                    <SelectValue>{(value) => (value ? String(value) : "Selecione")}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIES.map((species) => (
                      <SelectItem key={species} value={species}>
                        {species}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="booking-message">Mensagem / sintomas (opcional)</Label>
                <Textarea
                  id="booking-message"
                  rows={4}
                  value={form.message}
                  onChange={(e) => set("message")(e.target.value)}
                  placeholder="Conte o que está acontecendo com seu pet para agilizarmos o atendimento."
                  data-testid="booking-textarea-message"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="sm:col-span-2"
                disabled={mutation.isPending}
                data-testid="booking-submit-button"
              >
                {mutation.isPending ? "Enviando..." : "Agendar consulta"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Resumo + informações */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card size="sm" className="gap-3" data-testid="booking-summary-card">
            <CardHeader>
              <CardTitle className="font-heading text-base">Resumo do agendamento</CardTitle>
              <CardDescription>Acompanhe suas escolhas em tempo real.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Serviço</span>
                <span className="text-right font-medium text-foreground">
                  {selectedService?.name ?? "—"}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Veterinário</span>
                <span className="text-right font-medium text-foreground">
                  {form.vet_id && form.vet_id !== ANY_VET ? (selectedVet?.name ?? "—") : "Sem preferência"}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Data</span>
                <span className="text-right font-medium text-foreground">
                  {form.date ? formatDateBR(form.date) : "—"}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Horário</span>
                <span className="text-right font-medium text-foreground">{form.time_slot || "—"}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Pet</span>
                <span className="text-right font-medium text-foreground">
                  {form.pet_name ? `${form.pet_name} (${form.pet_species})` : "—"}
                </span>
              </p>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-3 border-0 bg-secondary" data-testid="booking-info-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base text-teal-950">
                <Clock className="size-4 text-primary" /> Horários de atendimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-teal-800/90">
              <p>Consultas: segunda a sábado, 08h às 20h.</p>
              <p>Os horários são confirmados pela nossa equipe conforme disponibilidade.</p>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-3 border-0 bg-red-50" data-testid="booking-emergency-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-heading text-base text-red-800">
                <Siren className="size-4" /> É uma emergência?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-red-700">
              <p>Não aguarde pelo formulário — ligue agora para o plantão 24h:</p>
              <a href="tel:+5511912345678" className="font-semibold underline-offset-4 hover:underline" data-testid="booking-emergency-call-link">
                (11) 91234-5678
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Confirmação visual */}
      <Dialog open={!!created} onOpenChange={(open) => { if (!open) setCreated(null); }}>
        <DialogContent data-testid="booking-confirm-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CircleCheck className="size-5 text-emerald-500" /> Recebemos seu agendamento!
            </DialogTitle>
            <DialogDescription>
              Guarde o código do protocolo. Nossa equipe confirmará o horário por e-mail ou
              WhatsApp em breve.
            </DialogDescription>
          </DialogHeader>
          {created && (
            <div className="space-y-2 rounded-lg bg-secondary p-4 text-sm" data-testid="booking-confirm-summary">
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Protocolo</span>
                <span className="font-mono font-semibold text-foreground">
                  {created.id.slice(0, 8).toUpperCase()}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Serviço</span>
                <span className="text-right font-medium text-foreground">{created.service_name}</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Data</span>
                <span className="font-medium text-foreground">
                  {formatDateBR(created.date)} às {created.time_slot}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Veterinário</span>
                <span className="text-right font-medium text-foreground">
                  {created.vet_name ?? "Sem preferência"}
                </span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Pet</span>
                <span className="font-medium text-foreground">
                  {created.pet_name} ({created.pet_species})
                </span>
              </p>
            </div>
          )}
          <div className="flex gap-2">
            <Button onClick={() => setCreated(null)} data-testid="booking-confirm-close-button">
              Fechar
            </Button>
            <Link
              to="/servicos"
              className="flex items-center px-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
              data-testid="booking-confirm-services-link"
            >
              Ver outros serviços
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
