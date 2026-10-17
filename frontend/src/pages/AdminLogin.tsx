import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogIn, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { apiPost } from "@/lib/api";
import { apiErrorMessage } from "@/lib/format";
import { beginSession } from "@/lib/session";
import type { AdminUser } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "vidaanimal2025";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (payload: { username: string; password: string }) =>
      apiPost<AdminUser>("/auth/login", payload),
    onSuccess: (user) => {
      beginSession();
      toast.success(`Bem-vindo, ${user.name}!`);
      navigate("/admin", { replace: true });
    },
    onError: (err) => toast.error(apiErrorMessage(err, "Credenciais inválidas.")),
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    mutation.mutate({ username: username.trim(), password });
  }

  return (
    <div className="grid min-h-svh place-items-center bg-gradient-to-b from-secondary to-background px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
            <PawPrint className="size-6" />
          </span>
          <h1 className="font-heading text-2xl font-semibold text-slate-900" data-testid="admin-login-title">
            Portal administrativo
          </h1>
          <p className="text-sm text-slate-600">
            Área restrita da equipe do Instituto Vida Animal
          </p>
        </div>

        <Card data-testid="admin-login-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-heading text-lg">
              <ShieldCheck className="size-5 text-primary" /> Entrar
            </CardTitle>
            <CardDescription>
              Use as credenciais da equipe para gerenciar agendamentos e mensagens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="admin-login-form">
              <div className="space-y-2">
                <Label htmlFor="admin-username">Usuário</Label>
                <Input
                  id="admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  data-testid="admin-login-input-username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Senha</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  data-testid="admin-login-input-password"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="admin-login-submit-button"
              >
                <LogIn data-icon="inline-start" /> {mutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                setUsername(DEMO_USERNAME);
                setPassword(DEMO_PASSWORD);
              }}
              data-testid="admin-login-demo-fill-button"
            >
              <Sparkles data-icon="inline-start" /> Preencher credenciais de demonstração
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-500">
          Precisa de ajuda? Fale com a coordenação técnica da clínica.
        </p>
      </div>
    </div>
  );
}
