import { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CalendarCheck,
  CalendarDays,
  CircleCheck,
  Clock,
  LoaderCircle,
  LogOut,
  PawPrint,
  Search,
} from "lucide-react";
import { apiGet, apiPatch } from "@/lib/api";
import {
  APPOINTMENT_STATUS_LABELS,
  apiErrorMessage,
  formatDateBR,
  formatDateTimeBR,
} from "@/lib/format";
import { queryClient } from "@/lib/queryClient";
import { endSession } from "@/lib/session";
import type { AdminUser, Appointment, ContactMessage } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STATUS_FILTERS = [
  { value: "todos", label: "Todos" },
  { value: "pendente", label: "Pendentes" },
  { value: "confirmado", label: "Confirmados" },
  { value: "concluido", label: "Concluídos" },
  { value: "cancelado", label: "Cancelados" },
];

export default function AdminDashboard() {
  const authQuery = useQuery({
    queryKey: ["auth"],
    queryFn: () => apiGet<AdminUser>("/auth/me"),
    retry: false,
  });
  const apptsQuery = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: () => apiGet<Appointment[]>("/appointments"),
    enabled: !!authQuery.data,
  });
  const messagesQuery = useQuery({
    queryKey: ["admin-messages"],
    queryFn: () => apiGet<ContactMessage[]>("/contact"),
    enabled: !!authQuery.data,
  });

  const [tab, setTab] = useState("agendamentos");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [search, setSearch] = useState("");

  const appointments = apptsQuery.data ?? [];
  const messages = messagesQuery.data ?? [];

  const counts = useMemo(
    () => ({
      total: appointments.length,
      pendente: appointments.filter((a) => a.status === "pendente").length,
      confirmado: appointments.filter((a) => a.status === "confirmado").length,
      concluido: appointments.filter((a) => a.status === "concluido").length,
      cancelado: appointments.filter((a) => a.status === "cancelado").length,
    }),
    [appointments]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return appointments.filter(
      (appointment) =>
        (statusFilter === "todos" || appointment.status === statusFilter) &&
        (!query ||
          [appointment.tutor_name, appointment.pet_name, appointment.service_name, appointment.email]
            .filter(Boolean)
            .some((field) => field.toLowerCase().includes(query)))
    );
  }, [appointments, statusFilter, search]);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiPatch<Appointment>(`/appointments/${id}`, { status }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["admin-appointments"] });
      toast.success(
        `Agendamento de ${updated.pet_name} marcado como ${APPOINTMENT_STATUS_LABELS[updated.status]}.`
      );
    },
    onError: (err) => toast.error(apiErrorMessage(err)),
  });

  if (authQuery.isPending) {
    return (
      <div className="grid min-h-svh place-items-center bg-background">
        <LoaderCircle className="size-6 animate-spin text-primary" />
      </div>
    );
  }
  if (authQuery.isError) {
    return <Navigate to="/admin/login" replace />;
  }

  const kpis = [
    { label: "Total de agendamentos", value: counts.total, icon: CalendarDays },
    { label: "Pendentes", value: counts.pendente, icon: Clock },
    { label: "Confirmados", value: counts.confirmado, icon: CalendarCheck },
    { label: "Concluídos", value: counts.concluido, icon: CircleCheck },
  ];

  return (
    <div className="min-h-svh bg-background" data-testid="admin-dashboard">
      {/* Cabeçalho do painel */}
      <header className="bg-[#042F2E] text-teal-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2.5" data-testid="admin-brand-link">
            <span className="flex size-9 items-center justify-center rounded-xl bg-teal-600/30 text-teal-200">
              <PawPrint className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-sm font-semibold">Instituto Vida Animal</span>
              <span className="block text-xs text-teal-300">Painel administrativo</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-teal-100/80 sm:block" data-testid="admin-user-name">
              {authQuery.data.name}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-100 hover:bg-teal-800 hover:text-white"
              onClick={() => void endSession("/admin/login")}
              data-testid="admin-logout-button"
            >
              <LogOut data-icon="inline-start" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" data-testid="admin-kpis">
          {kpis.map((kpi) => (
            <Card key={kpi.label} size="sm" className="gap-2" data-testid={`admin-kpi-${kpi.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <CardContent className="space-y-1">
                <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <kpi.icon className="size-4" />
                </span>
                <p className="font-heading text-2xl font-semibold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab} className="gap-4">
          <TabsList className="w-fit">
            <TabsTrigger value="agendamentos" data-testid="admin-tab-appointments">
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="mensagens" data-testid="admin-tab-messages">
              Mensagens {messages.length > 0 ? `(${messages.length})` : ""}
            </TabsTrigger>
          </TabsList>

          {/* Agendamentos */}
          <TabsContent value="agendamentos" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2" data-testid="admin-filter-pills">
                {STATUS_FILTERS.map((filter) => {
                  const isActive = statusFilter === filter.value;
                  const count = filter.value === "todos" ? counts.total : counts[filter.value as keyof typeof counts];
                  return (
                    <Button
                      key={filter.value}
                      size="sm"
                      variant={isActive ? "default" : "outline"}
                      onClick={() => setStatusFilter(filter.value)}
                      data-testid={`admin-filter-pill-${filter.value}`}
                    >
                      {filter.label}
                      {typeof count === "number" && filter.value !== "todos" ? ` (${count})` : ""}
                    </Button>
                  );
                })}
              </div>
              <div className="relative w-full sm:w-72">
                <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar por tutor, pet ou serviço"
                  className="pl-8"
                  data-testid="admin-search-input"
                />
              </div>
            </div>

            <Card size="sm" className="py-0" data-testid="admin-appointments-card">
              <Table data-testid="admin-appointments-table">
                <TableHeader>
                  <TableRow>
                    <TableHead>Tutor · Pet</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Recebido em</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apptsQuery.isPending ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        Carregando agendamentos...
                      </TableCell>
                    </TableRow>
                  ) : apptsQuery.isError ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-destructive">
                        Não foi possível carregar os agendamentos. Atualize a página.
                      </TableCell>
                    </TableRow>
                  ) : filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                        Nenhum agendamento encontrado para este filtro.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((appointment) => (
                      <TableRow key={appointment.id} data-testid={`admin-appointment-row-${appointment.id}`}>
                        <TableCell>
                          <p className="font-medium text-foreground">{appointment.tutor_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.pet_name} · {appointment.pet_species}
                          </p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{appointment.phone}</p>
                          <p className="text-xs text-muted-foreground">{appointment.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{appointment.service_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {appointment.vet_name ?? "Sem preferência"}
                          </p>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {formatDateBR(appointment.date)}
                          <span className="block text-xs text-muted-foreground">{appointment.time_slot}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={appointment.status} />
                            <Select
                              value={appointment.status}
                              onValueChange={(value) =>
                                statusMutation.mutate({ id: appointment.id, status: value })
                              }
                            >
                              <SelectTrigger
                                size="sm"
                                className="w-[110px]"
                                data-testid={`admin-status-select-${appointment.id}`}
                              >
                                <SelectValue>
                                  {(value) => APPOINTMENT_STATUS_LABELS[String(value)] ?? String(value)}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(APPOINTMENT_STATUS_LABELS).map(([value, label]) => (
                                  <SelectItem key={value} value={value}>
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                          {formatDateTimeBR(appointment.created_at)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Mensagens de contato */}
          <TabsContent value="mensagens" className="space-y-3">
            {messagesQuery.isPending ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Carregando mensagens...
              </p>
            ) : messagesQuery.isError ? (
              <p className="py-10 text-center text-sm text-destructive">
                Não foi possível carregar as mensagens. Atualize a página.
              </p>
            ) : messages.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nenhuma mensagem recebida ainda.
              </p>
            ) : (
              messages.map((message) => (
                <Card key={message.id} size="sm" className="gap-2" data-testid={`admin-message-card-${message.id}`}>
                  <CardHeader>
                    <CardTitle className="text-sm">{message.name}</CardTitle>
                    <CardDescription className="text-xs">
                      {message.email} · {formatDateTimeBR(message.created_at)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-slate-700">
                    {message.message}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
