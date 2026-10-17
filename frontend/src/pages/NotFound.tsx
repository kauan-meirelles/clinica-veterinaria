import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-svh place-items-center bg-background px-4 text-center">
      <div className="space-y-4">
        <PawPrint className="mx-auto size-12 text-primary" />
        <h1 className="font-heading text-4xl font-semibold text-slate-900" data-testid="notfound-title">
          Página não encontrada
        </h1>
        <p className="text-slate-600">
          O endereço que você tentou abrir não existe ou foi movido.
        </p>
        <Link to="/" className={buttonVariants({ variant: "outline" })} data-testid="notfound-home-link">
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
