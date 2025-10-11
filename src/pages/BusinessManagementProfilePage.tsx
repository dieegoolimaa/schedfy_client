import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Upload,
  Star,
  Image as ImageIcon,
  ExternalLink,
  Trash2,
  MessageSquare,
} from "lucide-react";
import businesses from "@/mock-data/business";
import type { Review } from "@/interfaces/business.interface";

const BusinessManagementProfilePage = () => {
  // Mock: pegar o primeiro negócio para demonstração
  const [business] = useState(businesses[0]);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400",
  ]);

  // Form states
  const [formData, setFormData] = useState({
    name: business.name,
    description: business.description,
    category: business.category,
    phone: business.phone,
    email: business.email,
    website: business.website || "",
    instagram: business.socialMedia?.instagram || "",
    facebook: business.socialMedia?.facebook || "",
    street: business.address.street,
    number: business.address.number,
    complement: business.address.complement || "",
    neighborhood: business.address.neighborhood,
    city: business.address.city,
    state: business.address.state,
    zipCode: business.address.zipCode,
  });

  const [reviews, setReviews] = useState<Review[]>(business.reviews);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success("Logo carregado! Clique em 'Salvar' para confirmar.");
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success(
        "Foto de capa carregada! Clique em 'Salvar' para confirmar."
      );
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryImages((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
      toast.success("Imagens adicionadas à galeria!");
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Imagem removida da galeria!");
  };

  const handleSaveInfo = () => {
    // Aqui você faria a chamada ao backend
    toast.success("Informações atualizadas com sucesso!");
    setIsEditingInfo(false);
  };

  const handleRespondReview = (reviewId: string) => {
    if (!responseText.trim()) {
      toast.error("Digite uma resposta antes de enviar.");
      return;
    }

    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              response: {
                text: responseText,
                date: new Date().toISOString(),
              },
            }
          : review
      )
    );

    setRespondingTo(null);
    setResponseText("");
    toast.success("Resposta publicada com sucesso!");
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((review) => review.id !== reviewId));
    toast.success("Avaliação removida com sucesso!");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Perfil do Negócio</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Configure as informações públicas do seu negócio
        </p>
        <Button
          variant="outline"
          className="mt-4 gap-2"
          onClick={() => window.open(`/b/${business.slug}`, "_blank")}
        >
          <ExternalLink className="h-4 w-4" />
          Ver Perfil Público
        </Button>
      </div>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="media">Mídias</TabsTrigger>
          <TabsTrigger value="reviews">Avaliações</TabsTrigger>
          <TabsTrigger value="hours">Horários</TabsTrigger>
        </TabsList>

        {/* Aba de Informações */}
        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Informações principais que aparecerão no perfil público
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Negócio *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    disabled={!isEditingInfo}
                    placeholder="https://seusite.com.br"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={!isEditingInfo}
                  rows={4}
                  placeholder="Descreva seu negócio..."
                />
              </div>

              <div className="flex gap-3">
                {!isEditingInfo ? (
                  <Button onClick={() => setIsEditingInfo(true)}>
                    Editar Informações
                  </Button>
                ) : (
                  <>
                    <Button onClick={handleSaveInfo}>Salvar Alterações</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingInfo(false)}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
              <CardDescription>
                Localização do seu estabelecimento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Rua *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) =>
                      setFormData({ ...formData, street: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) =>
                      setFormData({ ...formData, number: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.complement}
                    onChange={(e) =>
                      setFormData({ ...formData, complement: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) =>
                      setFormData({ ...formData, neighborhood: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    disabled={!isEditingInfo}
                    maxLength={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData({ ...formData, zipCode: e.target.value })
                    }
                    disabled={!isEditingInfo}
                  />
                </div>
              </div>

              {/* Google Maps Preview */}
              <div className="space-y-2">
                <Label>Visualização no Mapa</Label>
                <div className="border rounded-lg overflow-hidden h-64">
                  <iframe
                    title="Google Maps"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodeURIComponent(
                      `${formData.street}, ${formData.number}, ${formData.city}, ${formData.state}`
                    )}`}
                    allowFullScreen
                  />
                </div>
                <p className="text-sm text-gray-500">
                  * Integração com Google Maps - necessário configurar API Key
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Links para suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) =>
                      setFormData({ ...formData, instagram: e.target.value })
                    }
                    disabled={!isEditingInfo}
                    placeholder="@seuusuario"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.facebook}
                    onChange={(e) =>
                      setFormData({ ...formData, facebook: e.target.value })
                    }
                    disabled={!isEditingInfo}
                    placeholder="seuperfil"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Mídias */}
        <TabsContent value="media" className="space-y-6">
          {/* Logo */}
          <Card>
            <CardHeader>
              <CardTitle>Logo do Negócio</CardTitle>
              <CardDescription>
                Logo que aparece no perfil público (recomendado: 200x200px)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6">
                <Avatar className="size-32">
                  <AvatarImage
                    src={logoPreview || business.logo}
                    alt={business.name}
                  />
                  <AvatarFallback className="text-2xl">
                    {business.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Carregar Logo</span>
                    </div>
                    <Input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                    />
                  </Label>
                  <p className="text-sm text-gray-500">PNG, JPG até 5MB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Foto de Capa */}
          <Card>
            <CardHeader>
              <CardTitle>Foto de Capa</CardTitle>
              <CardDescription>
                Imagem de destaque (recomendado: 1200x400px)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="h-48 bg-cover bg-center rounded-lg border-2 border-dashed border-gray-300"
                style={{
                  backgroundImage: `url(${
                    coverPreview || business.coverImage
                  })`,
                }}
              />
              <Label htmlFor="cover-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors w-fit">
                  <Upload className="h-4 w-4" />
                  <span>Carregar Foto de Capa</span>
                </div>
                <Input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverUpload}
                />
              </Label>
            </CardContent>
          </Card>

          {/* Galeria de Fotos */}
          <Card>
            <CardHeader>
              <CardTitle>Galeria de Fotos</CardTitle>
              <CardDescription>
                Fotos do estabelecimento e dos serviços (até 20 fotos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {galleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Galeria ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {/* Add More Button */}
                {galleryImages.length < 20 && (
                  <Label
                    htmlFor="gallery-upload"
                    className="cursor-pointer h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors"
                  >
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Adicionar Fotos
                      </span>
                    </div>
                    <Input
                      id="gallery-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </Label>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Avaliações */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Avaliações dos Clientes</CardTitle>
                  <CardDescription>
                    Gerencie e responda as avaliações do seu negócio
                  </CardDescription>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-3xl font-bold">
                      {business.rating.average.toFixed(1)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {business.rating.count} avaliações
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback>
                            {review.customerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">
                            {review.customerName}
                          </h4>
                          <div className="flex items-center gap-2 my-1">
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
                            {review.serviceType && (
                              <Badge variant="secondary" className="text-xs">
                                {review.serviceType}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {review.comment}
                          </p>
                          <span className="text-sm text-gray-500 mt-1 block">
                            {new Date(review.date).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Resposta existente */}
                    {review.response && (
                      <div className="ml-14 mt-3 pl-4 border-l-2 border-primary bg-gray-50 dark:bg-gray-800 p-3 rounded">
                        <p className="text-sm font-semibold mb-1">
                          Sua resposta:
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {review.response.text}
                        </p>
                        <span className="text-xs text-gray-500">
                          {new Date(review.response.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    )}

                    {/* Formulário de resposta */}
                    {!review.response && (
                      <div className="ml-14 mt-3">
                        {respondingTo === review.id ? (
                          <div className="space-y-2">
                            <Textarea
                              placeholder="Escreva sua resposta..."
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRespondReview(review.id)}
                              >
                                Publicar Resposta
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRespondingTo(null);
                                  setResponseText("");
                                }}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setRespondingTo(review.id)}
                            className="gap-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Responder
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Aba de Horários */}
        <TabsContent value="hours" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure os horários de atendimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(business.businessHours).map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="w-32">
                      <Label className="capitalize">
                        {day === "monday" && "Segunda"}
                        {day === "tuesday" && "Terça"}
                        {day === "wednesday" && "Quarta"}
                        {day === "thursday" && "Quinta"}
                        {day === "friday" && "Sexta"}
                        {day === "saturday" && "Sábado"}
                        {day === "sunday" && "Domingo"}
                      </Label>
                    </div>
                    <div className="flex-1 flex items-center gap-4">
                      <Input
                        type="time"
                        defaultValue={"closed" in hours ? "" : hours.open}
                        disabled={"closed" in hours}
                        className="w-32"
                      />
                      <span>até</span>
                      <Input
                        type="time"
                        defaultValue={"closed" in hours ? "" : hours.close}
                        disabled={"closed" in hours}
                        className="w-32"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          toast.info("Funcionalidade em desenvolvimento");
                        }}
                      >
                        {"closed" in hours ? "Abrir" : "Fechar"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-6">Salvar Horários</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessManagementProfilePage;
