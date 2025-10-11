import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useState } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Check,
  Globe,
  Smartphone,
  CreditCard,
  Clock,
  BarChart3,
  Settings,
  ArrowRight,
  Sparkles,
  Menu,
} from "lucide-react";

const HomePage = () => {
  const navigate = useNavigate();
  const { locale, setLocale } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const plans = [
    {
      name: "Simple Booking",
      price: { USD: 29, EUR: 27, BRL: 149 },
      period: "month",
      description:
        "Perfect for solo professionals starting their booking journey",
      badge: "Most Popular",
      badgeColor: "bg-blue-500",
      features: [
        "Unlimited appointments",
        "Team member management",
        "Basic calendar view",
        "SMS notifications",
        "Mobile responsive",
        "Email support",
      ],
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      recommended: true,
    },
    {
      name: "Individual",
      price: { USD: 49, EUR: 45, BRL: 249 },
      period: "month",
      description: "For independent professionals who work alone",
      features: [
        "Everything in Simple",
        "Advanced analytics",
        "Custom branding",
        "Payment integration",
        "Automated reminders",
        "Priority support",
        "Commission tracking",
      ],
      icon: Users,
      gradient: "from-violet-500 to-purple-500",
      recommended: false,
    },
    {
      name: "Business",
      price: { USD: 99, EUR: 89, BRL: 499 },
      period: "month",
      description: "Complete solution for growing businesses",
      badge: "Best Value",
      badgeColor: "bg-emerald-500",
      features: [
        "Everything in Individual",
        "Unlimited team members",
        "Multi-location support",
        "Advanced reports",
        "API access",
        "White-label option",
        "Dedicated account manager",
        "Custom integrations",
      ],
      icon: TrendingUp,
      gradient: "from-emerald-500 to-teal-500",
      recommended: false,
    },
  ];

  const getCurrency = () => {
    switch (locale) {
      case "pt-BR":
      case "pt":
        return { symbol: "R$", code: "BRL" };
      case "en":
        return { symbol: "$", code: "USD" };
      case "es":
        return { symbol: "€", code: "EUR" };
      default:
        return { symbol: "$", code: "USD" };
    }
  };

  const currency = getCurrency();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Header / Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 font-bold text-xl sm:text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                Schedfy
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                About
              </a>
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as any)}
                className="text-sm border rounded-md px-3 py-1.5 bg-background"
              >
                <option value="en">🇺🇸 English</option>
                <option value="pt-BR">🇧🇷 Português</option>
                <option value="es">🇵🇹 Português (PT)</option>
              </select>
              <ThemeToggle />
              <Button variant="ghost" onClick={() => navigate("/login")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/create-business")}>
                Get Started
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex md:hidden items-center gap-2">
              <ThemeToggle />
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col gap-6 mt-8">
                    <a
                      href="#features"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#pricing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      Pricing
                    </a>
                    <a
                      href="#about"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium hover:text-primary transition-colors"
                    >
                      About
                    </a>
                    
                    <div className="pt-4 border-t">
                      <label className="text-sm font-medium mb-2 block">Language</label>
                      <select
                        value={locale}
                        onChange={(e) => setLocale(e.target.value as any)}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                      >
                        <option value="en">🇺🇸 English</option>
                        <option value="pt-BR">🇧🇷 Português</option>
                        <option value="es">🇵🇹 Português (PT)</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/login");
                        }}
                        className="w-full"
                      >
                        Sign In
                      </Button>
                      <Button 
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate("/create-business");
                        }}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <Badge className="mx-auto" variant="secondary">
              <Sparkles className="w-3 h-3 mr-1" />
              Trusted by 10,000+ businesses worldwide
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Simplify Scheduling.
              </span>
              <br />
              <span className="text-foreground">Amplify Growth.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The all-in-one booking platform designed for modern businesses.
              Manage appointments, team, and payments in one beautiful
              interface.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate("/create-business")}
                className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/50 transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/book-appointment")}
                className="text-lg px-8 py-6"
              >
                Book a Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mx-auto">
              <Globe className="w-3 h-3 mr-1" />
              Available Worldwide
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to streamline your business operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description:
                  "Intelligent calendar that prevents double bookings and optimizes your time",
                color: "text-blue-500",
              },
              {
                icon: Smartphone,
                title: "Mobile First",
                description:
                  "Beautiful experience on any device. Manage your business on the go",
                color: "text-purple-500",
              },
              {
                icon: CreditCard,
                title: "Payment Integration",
                description:
                  "Accept payments online with Stripe, PayPal, and local payment methods",
                color: "text-emerald-500",
              },
              {
                icon: Clock,
                title: "Automated Reminders",
                description:
                  "Reduce no-shows with automated SMS and email reminders",
                color: "text-orange-500",
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description:
                  "Track revenue, bookings, and performance with detailed reports",
                color: "text-pink-500",
              },
              {
                icon: Settings,
                title: "Easy Setup",
                description:
                  "Get started in minutes with our intuitive onboarding process",
                color: "text-cyan-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all border-2 hover:border-primary/20"
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} to-${feature.color}/60 flex items-center justify-center`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="secondary" className="mx-auto">
              Simple Pricing
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Choose your{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                perfect plan
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Start free, upgrade as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <Card
                  key={index}
                  className={`relative overflow-hidden ${
                    plan.recommended
                      ? "border-2 border-primary shadow-2xl scale-105 z-10"
                      : "border-2"
                  }`}
                >
                  {plan.badge && (
                    <div className="absolute top-0 right-0">
                      <Badge
                        className={`${plan.badgeColor} rounded-tl-none rounded-br-none`}
                      >
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  <CardContent className="p-8 space-y-6">
                    <div>
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4`}
                      >
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <p className="text-muted-foreground text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-bold">
                          {currency.symbol}
                          {plan.price[currency.code as keyof typeof plan.price]}
                        </span>
                        <span className="text-muted-foreground">
                          /{plan.period}
                        </span>
                      </div>
                    </div>

                    <Button
                      className={`w-full ${
                        plan.recommended
                          ? `bg-gradient-to-r ${plan.gradient} hover:shadow-lg`
                          : ""
                      }`}
                      variant={plan.recommended ? "default" : "outline"}
                      size="lg"
                      onClick={() => navigate("/create-business")}
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="space-y-3 pt-4">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-primary/5 to-background">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to transform your business?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of businesses already using Schedfy
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/create-business")}
            className="text-lg px-12 py-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-xl hover:shadow-primary/30 transition-all"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="font-bold text-xl mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Schedfy
              </div>
              <p className="text-sm text-muted-foreground">
                Making scheduling simple for businesses worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-primary">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-primary">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#about" className="hover:text-primary">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Schedfy. All rights reserved. Made with ❤️ worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
