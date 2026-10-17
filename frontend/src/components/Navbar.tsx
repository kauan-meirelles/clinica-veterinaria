import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, PawPrint } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { to: "/", label: "Início" },
  { to: "/servicos", label: "Serviços" },
  { to: "/veterinarios", label: "Veterinários" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

// Sticky glass header: brand, five section links, booking CTA, mobile sheet menu.
export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-xs backdrop-blur-xl"
      data-testid="navbar"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2.5" data-testid="navbar-brand-link">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
            <PawPrint className="size-5" />
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-slate-900">
            Instituto Vida Animal
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" data-testid="navbar-desktop-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname === link.to
                  ? "bg-secondary text-secondary-foreground"
                  : "text-slate-600 hover:bg-muted hover:text-slate-900"
              )}
              data-testid={`navbar-link-${link.to === "/" ? "inicio" : link.to.slice(1)}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link to="/agendamentos" className={buttonVariants()} data-testid="navbar-cta-button">
            Agendar Consulta
          </Link>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Abrir menu"
            className={buttonVariants({ variant: "outline", size: "icon" })}
            data-testid="navbar-menu-button"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetTitle>Menu</SheetTitle>
            <nav className="flex flex-col gap-1 px-4" data-testid="navbar-mobile-nav">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pathname === link.to
                      ? "bg-secondary text-secondary-foreground"
                      : "text-slate-600 hover:bg-muted hover:text-slate-900"
                  )}
                  data-testid={`navbar-mobile-link-${link.to === "/" ? "inicio" : link.to.slice(1)}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/agendamentos"
                onClick={() => setOpen(false)}
                className={buttonVariants({ size: "lg" })}
                data-testid="navbar-mobile-cta-button"
              >
                Agendar Consulta
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
