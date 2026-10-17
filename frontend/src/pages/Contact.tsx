import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/format";
import type { ContactMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Rua+dos+Animais+123+S%C3%A3o+Paulo+SP";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const mutation = useMutation({
    mutationFn: (payload: typeof form) => apiPost<ContactMessage>("/contact", payload),
    onSuccess: (message) => {
      toast.success(`Obrigado pelo contato, ${message.name.split(" ")[0]}! Responderemos em breve.`);
      setForm({ name: "", email: "", message: "" });
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.name.trim().length < 3) {
      toast.error("Digite um nome válido (mínimo 3 caracteres).");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("Digite um e-mail válido.");
      return;
    }
    if (form.message.trim().length < 10) {
      toast.error("A mensagem deve conter pelo menos 10 caracteres.");
      return;
    }
    mutation.mutate({ name: form.name.trim(), email: form.email.trim(), message: form.message.trim() });
  }

  return (
    <div>
      {/* Cabeçalho */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-6xl space-y-2 px-4 py-14">
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-teal-950" data-testid="contact-title">
            Fale Conosco
          </h1>
          <p className="max-w-2xl text-teal-800/80">
            Estamos prontos para atender você e seu pet — presencialmente, por telefone ou WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[1fr_1.2fr]" data-testid="contact-content">
        {/* Informações */}
        <div className="space-y-4">
          <Card size="sm" className="gap-3" data-testid="contact-address-card">
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MapPin className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">Endereço</h3>
                  <p className="text-sm text-slate-600">Rua dos Animais, 123 — São Paulo, SP</p>
                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
                    data-testid="contact-maps-link"
                  >
                    Abrir no Google Maps
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-3" data-testid="contact-phones-card">
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Phone className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">Telefones</h3>
                  <p className="text-sm text-slate-600">(11) 98765-4321 · Recepção</p>
                  <p className="text-sm text-slate-600">(11) 91234-5678 · Emergência 24h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-3" data-testid="contact-email-card">
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Mail className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">E-mail</h3>
                  <p className="text-sm text-slate-600">contato@vidaanimal.com</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="gap-3" data-testid="contact-hours-card">
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Clock className="size-5" />
                </span>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900">Horários</h3>
                  <p className="text-sm text-slate-600">Segunda a sábado · 08h às 20h</p>
                  <p className="text-sm text-slate-600">Emergência 24h, todos os dias</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <a
            href="https://wa.me/5511987654321"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
            data-testid="contact-whatsapp-link"
          >
            <SiWhatsapp className="size-5" /> Falar no WhatsApp
          </a>
        </div>

        {/* Formulário */}
        <Card data-testid="contact-form-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Envie sua mensagem</CardTitle>
            <CardDescription>
              Respondemos em até um dia útil. Para emergências, prefira ligar ou chamar no WhatsApp.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Nome</Label>
                <Input
                  id="contact-name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Seu nome"
                  required
                  data-testid="contact-input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">E-mail</Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="seuemail@exemplo.com"
                  required
                  data-testid="contact-input-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Mensagem</Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Escreva sua mensagem aqui..."
                  required
                  data-testid="contact-textarea-message"
                />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="contact-submit-button">
                <Send data-icon="inline-start" /> {mutation.isPending ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
