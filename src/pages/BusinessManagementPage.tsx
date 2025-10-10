import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Package, Gift, Ticket, Percent } from "lucide-react";

const BusinessManagementPage = () => {
  const [activeTab, setActiveTab] = useState("services");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">
            Gerenciamento de Negócios
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Gerencie serviços, vouchers, promoções e comissões do seu negócio
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Serviços</span>
            </TabsTrigger>
            <TabsTrigger value="vouchers" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              <span className="hidden sm:inline">Vouchers</span>
            </TabsTrigger>
            <TabsTrigger value="promotions" className="flex items-center gap-2">
              <Ticket className="h-4 w-4" />
              <span className="hidden sm:inline">Promoções</span>
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Comissão</span>
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Serviços</CardTitle>
                    <CardDescription>
                      Gerencie os serviços oferecidos pelo seu negócio
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Serviço
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-[var(--color-muted-foreground)]">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum serviço cadastrado ainda.</p>
                  <p className="text-sm mt-2">
                    Clique em "Novo Serviço" para começar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vouchers Tab */}
          <TabsContent value="vouchers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vouchers</CardTitle>
                    <CardDescription>
                      Crie e gerencie vouchers para seus clientes
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Novo Voucher
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-[var(--color-muted-foreground)]">
                  <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum voucher cadastrado ainda.</p>
                  <p className="text-sm mt-2">
                    Clique em "Novo Voucher" para começar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Promotions Tab */}
          <TabsContent value="promotions" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Promoções</CardTitle>
                    <CardDescription>
                      Configure promoções e descontos especiais
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Promoção
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-[var(--color-muted-foreground)]">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma promoção cadastrada ainda.</p>
                  <p className="text-sm mt-2">
                    Clique em "Nova Promoção" para começar.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commission Tab */}
          <TabsContent value="commission" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Comissões</CardTitle>
                    <CardDescription>
                      Configure as comissões dos profissionais
                    </CardDescription>
                  </div>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Regra
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Padrão Estabelecimento
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[var(--color-primary)]">
                          30%
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
                          Percentual padrão do estabelecimento
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">
                          Padrão Profissional
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-[var(--color-primary)]">
                          70%
                        </div>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
                          Percentual padrão do profissional
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center py-8 text-[var(--color-muted-foreground)]">
                    <Percent className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>
                      Configure regras de comissão personalizadas por serviço ou
                      profissional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default BusinessManagementPage;
