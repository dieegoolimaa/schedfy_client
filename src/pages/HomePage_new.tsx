import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  Check,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { locale, setLocale, t } = useI18n();

  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      titleKey: "home.features.scheduling.title",
      descKey: "home.features.scheduling.desc",
    },
    {
      icon: <Users className="h-6 w-6" />,
      titleKey: "home.features.professionals.title",
      descKey: "home.features.professionals.desc",
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      titleKey: "home.features.analytics.title",
      descKey: "home.features.analytics.desc",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      titleKey: "home.features.availability.title",
      descKey: "home.features.availability.desc",
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      titleKey: "home.features.promotions.title",
      descKey: "home.features.promotions.desc",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      titleKey: "home.features.security.title",
      descKey: "home.features.security.desc",
    },
  ];

  const benefits = [
    { textKey: "home.benefits.reduce_noshows" },
    { textKey: "home.benefits.increase_revenue" },
    { textKey: "home.benefits.save_time" },
    { textKey: "home.benefits.improve_experience" },
  ];

  const plans = [
    {
      nameKey: "home.plans.simple.name",
      descKey: "home.plans.simple.desc",
      features: [
        "home.plans.simple.feature1",
        "home.plans.simple.feature2",
        "home.plans.simple.feature3",
      ],
    },
    {
      nameKey: "home.plans.individual.name",
      descKey: "home.plans.individual.desc",
      features: [
        "home.plans.individual.feature1",
        "home.plans.individual.feature2",
        "home.plans.individual.feature3",
        "home.plans.individual.feature4",
      ],
      popular: true,
    },
    {
      nameKey: "home.plans.business.name",
      descKey: "home.plans.business.desc",
      features: [
        "home.plans.business.feature1",
        "home.plans.business.feature2",
        "home.plans.business.feature3",
        "home.plans.business.feature4",
        "home.plans.business.feature5",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--color-background)]/80 backdrop-blur-lg border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold shadow-lg">
              S
            </div>
            <div>
              <div className="text-lg font-bold">{t("home.brand.name")}</div>
              <div className="text-xs text-[var(--color-muted-foreground)]">
                {t("home.brand.tagline")}
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/create-business")}
              className="hidden sm:flex"
            >
              {t("home.nav.create_business")}
            </Button>
            <Button size="sm" onClick={() => navigate("/login")}>
              {t("home.nav.login")}
            </Button>

            {/* Language selector */}
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as any)}
              className="p-2 border rounded text-xs bg-[var(--color-card)] border-[var(--color-border)]"
            >
              <option value="en">🇺🇸</option>
              <option value="pt-BR">🇧🇷</option>
              <option value="pt">🇵🇹</option>
              <option value="es">🇪🇸</option>
            </select>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-accent)]/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm font-medium">
                <Zap className="h-4 w-4" />
                {t("home.hero.badge")}
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                {t("home.hero.title")}
              </h1>

              <p className="text-lg sm:text-xl text-[var(--color-muted-foreground)] max-w-2xl">
                {t("home.hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/create-business")}
                  className="text-base"
                >
                  {t("home.hero.cta_primary")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/login")}
                  className="text-base"
                >
                  {t("home.hero.cta_secondary")}
                </Button>
              </div>

              {/* Social Proof */}
              <div className="pt-8 flex items-center gap-8 text-sm">
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">
                    500+
                  </div>
                  <div className="text-[var(--color-muted-foreground)]">
                    {t("home.hero.stats.businesses")}
                  </div>
                </div>
                <div className="h-12 w-px bg-[var(--color-border)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">
                    50k+
                  </div>
                  <div className="text-[var(--color-muted-foreground)]">
                    {t("home.hero.stats.bookings")}
                  </div>
                </div>
                <div className="h-12 w-px bg-[var(--color-border)]" />
                <div>
                  <div className="text-2xl font-bold text-[var(--color-primary)]">
                    98%
                  </div>
                  <div className="text-[var(--color-muted-foreground)]">
                    {t("home.hero.stats.satisfaction")}
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] p-8 shadow-2xl">
                <div className="h-full w-full bg-[var(--color-card)] rounded-xl flex items-center justify-center">
                  <Calendar className="h-32 w-32 text-[var(--color-primary)] opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-[var(--color-muted)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("home.features.title")}
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {t("home.features.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-[var(--color-muted-foreground)]">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                {t("home.benefits.title")}
              </h2>
              <p className="text-lg text-[var(--color-muted-foreground)] mb-8">
                {t("home.benefits.subtitle")}
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mt-0.5">
                      <Check className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                    <p className="text-[var(--color-foreground)]">
                      {t(benefit.textKey)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center border border-[var(--color-border)]">
                <TrendingUp className="h-24 w-24 text-[var(--color-primary)] opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 sm:py-24 bg-[var(--color-muted)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("home.plans.title")}
            </h2>
            <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
              {t("home.plans.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 rounded-2xl border-2 ${
                  plan.popular
                    ? "border-[var(--color-primary)] bg-[var(--color-card)] shadow-xl scale-105"
                    : "border-[var(--color-border)] bg-[var(--color-card)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium">
                    {t("home.plans.popular")}
                  </div>
                )}

                <h3 className="text-2xl font-bold mb-2">{t(plan.nameKey)}</h3>
                <p className="text-[var(--color-muted-foreground)] mb-6">
                  {t(plan.descKey)}
                </p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((featureKey, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{t(featureKey)}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate("/create-business")}
                >
                  {t("home.plans.get_started")}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {t("home.cta.title")}
            </h2>
            <p className="text-lg opacity-90 mb-8">{t("home.cta.subtitle")}</p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/create-business")}
              className="bg-white text-[var(--color-primary)] hover:bg-gray-100"
            >
              {t("home.cta.button")}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white font-bold">
                  S
                </div>
                <div className="text-lg font-bold">{t("home.brand.name")}</div>
              </div>
              <p className="text-[var(--color-muted-foreground)] max-w-md">
                {t("home.footer.description")}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">
                {t("home.footer.product.title")}
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                <li>
                  <a
                    href="#features"
                    className="hover:text-[var(--color-foreground)]"
                  >
                    {t("home.footer.product.features")}
                  </a>
                </li>
                <li>
                  <a
                    href="#plans"
                    className="hover:text-[var(--color-foreground)]"
                  >
                    {t("home.footer.product.plans")}
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">
                {t("home.footer.company.title")}
              </h4>
              <ul className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
                <li>
                  <a
                    href="#about"
                    className="hover:text-[var(--color-foreground)]"
                  >
                    {t("home.footer.company.about")}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-[var(--color-foreground)]"
                  >
                    {t("home.footer.company.contact")}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[var(--color-border)] mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              © {new Date().getFullYear()} {t("home.brand.name")}.{" "}
              {t("home.footer.rights")}
            </p>
            <div className="flex items-center gap-4 text-sm text-[var(--color-muted-foreground)]">
              <a
                href="#privacy"
                className="hover:text-[var(--color-foreground)]"
              >
                {t("home.footer.privacy")}
              </a>
              <a href="#terms" className="hover:text-[var(--color-foreground)]">
                {t("home.footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
