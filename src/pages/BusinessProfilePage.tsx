import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Star,
  Calendar,
  Share2,
  Instagram,
  Facebook,
} from "lucide-react";
import businesses from "@/mock-data/business";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const BusinessProfilePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Encontrar o negócio pelo slug
  const business = businesses.find((b) => b.slug === slug);

  if (!business) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Negócio não encontrado
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            O negócio que você está procurando não existe ou foi removido.
          </p>
          <Button onClick={() => navigate("/")}>Voltar para o início</Button>
        </div>
      </div>
    );
  }

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
  };

  const getDayName = (day: string) => {
    const days: Record<string, string> = {
      monday: "Segunda",
      tuesday: "Terça",
      wednesday: "Quarta",
      thursday: "Quinta",
      friday: "Sexta",
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return days[day] || day;
  };

  const formatTime = (time: string) => {
    return time;
  };

  const shareProfile = () => {
    const url = window.location.href;
    const text = `Confira ${business.name} no Schedfy!`;

    return { url, text };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Cover Image */}
      {business.coverImage && (
        <div
          className="h-64 md:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${business.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        <div className="max-w-5xl mx-auto">
          {/* Header Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Logo */}
                <Avatar className="size-32 shrink-0 border-4 border-white dark:border-gray-800 shadow-lg">
                  <AvatarImage src={business.logo} alt={business.name} />
                  <AvatarFallback className="text-3xl">
                    {business.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {business.name}
                      </h1>
                      <Badge variant="secondary" className="mb-3">
                        {business.category}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`size-5 ${
                                i < Math.floor(business.rating.average)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-lg font-semibold">
                          {formatRating(business.rating.average)}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          ({business.rating.count} avaliações)
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        size="lg"
                        onClick={() =>
                          navigate(`/book-appointment?business=${business.id}`)
                        }
                        className="gap-2"
                      >
                        <Calendar className="h-5 w-5" />
                        Agendar Horário
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="lg" variant="outline" className="gap-2">
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          <DropdownMenuItem
                            onClick={() => {
                              const { url, text } = shareProfile();
                              window.location.href = `mailto:?subject=${encodeURIComponent(
                                text
                              )}&body=${encodeURIComponent(url)}`;
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Compartilhar por Email
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              const { url, text } = shareProfile();
                              window.open(
                                `https://wa.me/?text=${encodeURIComponent(
                                  `${text} ${url}`
                                )}`,
                                "_blank"
                              );
                            }}
                          >
                            <svg
                              className="h-4 w-4 mr-2"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Compartilhar por WhatsApp
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {business.description}
                  </p>

                  {/* Social Media */}
                  {business.socialMedia && (
                    <div className="flex gap-3">
                      {business.socialMedia.instagram && (
                        <a
                          href={`https://instagram.com/${business.socialMedia.instagram.replace(
                            "@",
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-pink-600 transition-colors"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {business.socialMedia.facebook && (
                        <a
                          href={`https://facebook.com/${business.socialMedia.facebook}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Reviews */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Avaliações</h2>
                  <div className="space-y-6">
                    {business.reviews.map((review) => (
                      <div key={review.id}>
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage
                              src={review.customerAvatar}
                              alt={review.customerName}
                            />
                            <AvatarFallback>
                              {review.customerName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">
                                {review.customerName}
                              </h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`size-4 ${
                                      i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.serviceType && (
                              <Badge variant="secondary" className="mb-2">
                                {review.serviceType}
                              </Badge>
                            )}
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                              {review.comment}
                            </p>
                            <span className="text-sm text-gray-500">
                              {new Date(review.date).toLocaleDateString(
                                "pt-BR"
                              )}
                            </span>

                            {/* Business Response */}
                            {review.response && (
                              <div className="mt-4 pl-4 border-l-2 border-primary">
                                <p className="text-sm font-semibold mb-1">
                                  Resposta do estabelecimento:
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                  {review.response.text}
                                </p>
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    review.response.date
                                  ).toLocaleDateString("pt-BR")}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Separator className="mt-6" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4">Contato</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Phone className="size-5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Telefone
                        </p>
                        <a
                          href={`tel:${business.phone}`}
                          className="font-medium hover:text-primary"
                        >
                          {business.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="size-5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Email
                        </p>
                        <a
                          href={`mailto:${business.email}`}
                          className="font-medium hover:text-primary break-all"
                        >
                          {business.email}
                        </a>
                      </div>
                    </div>

                    {business.website && (
                      <div className="flex items-start gap-3">
                        <Globe className="size-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Website
                          </p>
                          <a
                            href={business.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:text-primary break-all"
                          >
                            {business.website.replace("https://", "")}
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-gray-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Endereço
                        </p>
                        <p className="font-medium">
                          {business.address.street}, {business.address.number}
                          {business.address.complement &&
                            ` - ${business.address.complement}`}
                        </p>
                        <p className="text-sm">
                          {business.address.neighborhood} -{" "}
                          {business.address.city}, {business.address.state}
                        </p>
                        <p className="text-sm">{business.address.zipCode}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Clock className="size-5" />
                    Horário de Funcionamento
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(business.businessHours).map(
                      ([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {getDayName(day)}
                          </span>
                          <span className="font-medium">
                            {"closed" in hours
                              ? "Fechado"
                              : `${formatTime(hours.open)} - ${formatTime(
                                  hours.close
                                )}`}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
