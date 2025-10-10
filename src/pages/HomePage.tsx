import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-[var(--color-primary)] flex items-center justify-center text-[var(--color-primary-foreground)] font-bold">
            S
          </div>
          <div>
            <div className="text-lg font-bold">Schedfy</div>
            <div className="text-xs text-[var(--color-muted-foreground)]">
              Simple scheduling for businesses
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button
            onClick={() => navigate("/create-business")}
            className="px-3 py-2 rounded-md border border-[var(--color-border)] text-[var(--color-foreground)]"
          >
            {t("home.create_business") || "Create business"}
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-2 rounded-md text-sm"
          >
            {t("home.login") || "Login"}
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight">
            Schedfy — agendamentos mais fáceis para seu negócio
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-xl">
            Gerencie serviços, profissionais e reservas a partir de uma
            interface simples e intuitiva. Acelere o atendimento, reduza faltas
            e ofereça pagamento integrado.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={() => navigate("/create-business")}>
              {t("home.cta_business") || "Criar meu negócio"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
            >
              {t("home.login") || "Login"}
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-[var(--color-card)] rounded-md shadow-sm gradient-border">
              <h3 className="font-semibold">Agendamento público</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Permita que clientes agendem sem precisar de conta.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-card)] rounded-md shadow-sm gradient-border">
              <h3 className="font-semibold">Gestão de profissionais</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Controle agendas, comissões e disponibilidade.
              </p>
            </div>
            <div className="p-4 bg-[var(--color-card)] rounded-md shadow-sm gradient-border">
              <h3 className="font-semibold">Pagamentos mock</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Fluxo de pagamento integrado para testes e demonstrações.
              </p>
            </div>
          </div>
        </section>

        <aside className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-md p-6 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] rounded-xl text-[var(--color-primary-foreground)] shadow-lg">
            <div className="text-sm uppercase font-medium opacity-90">
              Plataforma Completa
            </div>
            <h2 className="text-2xl font-bold mt-2">Gerencie seu negócio</h2>
            <p className="mt-3 text-[var(--color-primary-foreground)]/90">
              Sistema completo de agendamentos com gestão de profissionais,
              serviços e análises.
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-md bg-[var(--color-primary-foreground)] text-[var(--color-primary)] font-semibold"
              >
                {t("home.login") || "Acessar Sistema"}
              </button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-sm text-[var(--color-muted-foreground)] border-t border-[var(--color-border)]">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <strong>Schedfy</strong> — © {new Date().getFullYear()} • Todos os
            direitos reservados
          </div>
          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <label className="text-xs">Idioma</label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="p-1 border rounded text-sm"
            >
              <option value="en">English</option>
              <option value="pt-BR">Português (BR)</option>
              <option value="pt">Português (PT)</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
