import React from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 text-foreground">
      <header className="max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold shadow-lg">
            S
          </div>
          <div>
            <div className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Schedfy
            </div>
            <div className="text-xs text-muted-foreground">
              {t("home.tagline") || "Simple scheduling for businesses"}
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Login"
          >
            <LogIn className="h-5 w-5" />
          </button>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <section className="space-y-6">
          <h1 className="text-4xl font-extrabold leading-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text">
            {t("home.hero_title") ||
              "Schedfy — easier scheduling for your business"}
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            {t("home.hero_description") ||
              "Manage services, professionals and bookings from a simple and intuitive interface. Speed up service, reduce no-shows and offer integrated payment."}
          </p>

          <div className="flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => navigate("/create-business")}
              className="bg-gradient-to-r from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all"
            >
              {t("home.cta_business") || "Create my business"}
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
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-primary/5">
              <h3 className="font-semibold">
                {t("home.feature1_title") || "Simple Booking"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("home.feature1_description") ||
                  "Pure appointment system - quick and direct scheduling without business complexity."}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-primary/5">
              <h3 className="font-semibold">
                {t("home.feature2_title") || "Professional Management"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("home.feature2_description") ||
                  "Control schedules, commissions and availability of your team."}
              </p>
            </div>
            <div className="p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:border-primary/50 transition-colors bg-gradient-to-br from-card to-primary/5">
              <h3 className="font-semibold">
                {t("home.feature3_title") || "Customer Feedback"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("home.feature3_description") ||
                  "Collect satisfaction surveys and improve your service quality."}
              </p>
            </div>
          </div>
        </section>

        <aside className="hidden lg:flex items-center justify-center">
          <div className="w-full max-w-md p-8 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl text-primary-foreground shadow-2xl">
            <div className="text-sm uppercase font-medium opacity-90">
              {t("home.platform_badge") || "Complete Platform"}
            </div>
            <h2 className="text-2xl font-bold mt-2">
              {t("home.platform_title") || "Manage your business"}
            </h2>
            <p className="mt-3 text-primary-foreground/90">
              {t("home.platform_description") ||
                "Complete appointment system with professional management, services and analytics."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 rounded-lg bg-primary-foreground text-primary font-semibold hover:bg-primary-foreground/90 transition-colors shadow-md"
              >
                {t("home.cta_access") || "Access System"}
              </button>
            </div>
          </div>
        </aside>
      </main>

      <footer className="max-w-7xl mx-auto p-6 text-sm text-muted-foreground border-t border-border mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <strong>Schedfy</strong> — © {new Date().getFullYear()} •{" "}
            {t("home.rights") || "All rights reserved"}
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs">
              {t("home.language") || "Language"}
            </label>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="p-2 border rounded-md text-sm bg-card text-foreground border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
