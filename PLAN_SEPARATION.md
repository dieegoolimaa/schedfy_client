# Plan Separation Documentation

## Overview

O sistema Schedfy agora suporta 3 tipos de planos distintos, cada um com funcionalidades específicas:

1. **Simple Booking** - Agendamento simples sem recursos financeiros
2. **Individual** - Para profissionais autônomos com gestão financeira
3. **Business** - Para estabelecimentos com equipe e gestão completa

## Planos e Recursos

### 1. Simple Booking (simple_booking)

**Público-alvo:** Pequenos negócios que apenas precisam de agendamento

**Recursos HABILITADOS:**

- ✅ Agendamento de serviços
- ✅ Gestão de clientes
- ✅ Usuários atendentes (gerenciam agendamentos)
- ✅ Visualização de agenda

**Recursos DESABILITADOS:**

- ❌ Processamento de pagamento
- ❌ Gestão de comissões
- ❌ Relatórios financeiros
- ❌ Vouchers e promoções
- ❌ Programa de fidelidade
- ❌ Múltiplos profissionais
- ❌ Análises avançadas

**Páginas específicas:**

- `/simple/appointments` - Gerenciar agendamentos
- `/simple/services` - Gerenciar serviços (apenas nome, descrição, duração)

**Estrutura de dados:**

```typescript
interface SimpleService {
  id: string;
  name: string;
  description: string;
  duration: number; // minutos
  isActive: boolean;
  // SEM: price, commission, discounts
}
```

### 2. Individual (individual)

**Público-alvo:** Profissionais autônomos (barbeiros, terapeutas, consultores, etc)

**Recursos HABILITADOS:**

- ✅ Tudo do Simple Booking +
- ✅ Processamento de pagamento
- ✅ Relatórios financeiros
- ✅ Vouchers e promoções
- ✅ Programa de fidelidade
- ✅ Análises avançadas

**Recursos DESABILITADOS:**

- ❌ Gestão de comissões (apenas 1 profissional)
- ❌ Múltiplos profissionais
- ❌ Gestão de equipe
- ❌ API access

**Páginas específicas:**

- `/business-management` - Acesso PARCIAL (sem comissões)
- Acesso a todas páginas financeiras

### 3. Business (business)

**Público-alvo:** Estabelecimentos com equipe (salões, clínicas, academias)

**Recursos HABILITADOS:**

- ✅ TODOS os recursos
- ✅ Múltiplos profissionais
- ✅ Gestão de comissões
- ✅ Gestão de equipe e funções
- ✅ Atendentes (gerenciam agendamentos)
- ✅ Branding personalizado
- ✅ API access

**Páginas específicas:**

- `/business-management` - Acesso COMPLETO (incluindo comissões)
- Todas as páginas disponíveis

## Implementação Técnica

### 1. Interfaces (`plan.interface.ts`)

```typescript
export type PlanType = "simple_booking" | "individual" | "business";

export interface PlanFeatures {
  hasAppointmentScheduling: boolean;
  hasClientManagement: boolean;
  hasPaymentProcessing: boolean;
  hasCommissionManagement: boolean;
  hasFinancialReports: boolean;
  hasVouchers: boolean;
  hasPromotions: boolean;
  hasLoyaltyProgram: boolean;
  hasMultipleProfessionals: boolean;
  hasAttendants: boolean;
  hasRoleManagement: boolean;
  hasAnalytics: boolean;
  hasCustomBranding: boolean;
  hasApiAccess: boolean;
}
```

### 2. Context (`PlanContext.tsx`)

Fornece acesso global ao plano atual e features:

```typescript
const { currentPlan, features, canAccess, user } = usePlan();

// Verificar feature
if (canAccess("hasPaymentProcessing")) {
  // Mostrar seção de pagamento
}
```

### 3. Componentes de Proteção

#### RequirePlan (proteção de rotas)

```tsx
<Route
  path="/simple/appointments"
  element={
    <RequirePlan plans={["simple_booking"]}>
      <SimpleBookingAppointmentsPage />
    </RequirePlan>
  }
/>
```

#### RequireFeature (renderização condicional)

```tsx
<RequireFeature feature="hasPaymentProcessing">
  <PaymentSection />
</RequireFeature>
```

#### PlanGate (alternativa sem redirect)

```tsx
<PlanGate showFor={["business", "individual"]} fallback={<SimpleVersion />}>
  <AdvancedVersion />
</PlanGate>
```

### 4. Roles vs Plans

**Roles (funções):**

- `owner` - Dono do negócio
- `admin` - Administrador
- `professional` - Profissional que presta serviços
- `attendant` - Atendente que gerencia agendamentos (simple_booking)
- `customer` - Cliente

**Plans (planos):**

- `simple_booking` - Tipo de conta
- `individual` - Tipo de conta
- `business` - Tipo de conta

**Exemplo de combinação:**

```typescript
// User com plano simple_booking e role attendant
{
  id: "1",
  name: "Maria Silva",
  role: "attendant",
  planType: "simple_booking"
}

// User com plano business e role owner
{
  id: "2",
  name: "João Santos",
  role: "owner",
  planType: "business"
}
```

## Fluxo de Trabalho

### Simple Booking

1. Cliente acessa página pública de agendamento
2. Seleciona serviço, data e horário
3. Preenche dados
4. Agendamento é criado com status "scheduled"
5. **Atendente** vê agendamento em `/simple/appointments`
6. Atendente pode: confirmar, cancelar, ou marcar como concluído
7. **NÃO há pagamento no sistema** - feito externamente

### Individual

1. Cliente acessa página de agendamento
2. Seleciona serviço (com preço), data e horário
3. Preenche dados
4. Agendamento criado com status "pending"
5. **Profissional** confirma agendamento
6. No dia, profissional marca como "completed"
7. **Dialog de pagamento aparece** - processa pagamento
8. Relatórios financeiros são atualizados

### Business

1. Cliente acessa página de agendamento
2. Seleciona profissional específico, serviço, data
3. Preenche dados
4. Agendamento criado
5. **Estabelecimento** confirma
6. Profissional atende e marca como completed
7. **Pagamento processado + comissão calculada**
8. Dashboard do estabelecimento mostra: total, comissão estabelecimento, comissão profissional

## Migração de Dados

### localStorage Keys

**Global (todos planos):**

- `loggedInUser` - Usuário atual
- `mock_appointments` - Agendamentos

**Simple Booking:**

- `simple_services` - Serviços sem preço

**Individual/Business:**

- `mock_services` - Serviços com preço
- `mock_vouchers` - Vouchers
- `mock_promotions` - Promoções

**Business apenas:**

- `mock_commissions` - Configurações de comissão
- `mock_professionals` - Lista de profissionais

## Próximos Passos

### Implementar

1. ✅ Criar infraestrutura de planos
2. ✅ Criar páginas Simple Booking
3. 🔄 Atualizar Header com menus baseados em plano
4. ⏳ Atualizar BookAppointmentPage com plan awareness
5. ⏳ Criar sistema de gerenciamento de atendentes
6. ⏳ Adicionar seletor de plano na criação de conta
7. ⏳ Implementar upgrade de plano

### Testar

- [ ] Simple Booking: criar serviço, criar agendamento, confirmar
- [ ] Individual: criar serviço com preço, processar pagamento
- [ ] Business: criar equipe, configurar comissões, dividir pagamentos
- [ ] Navegação entre planos (upgrade/downgrade)

## Exemplos de Uso

### 1. Ocultar seção de pagamento (Simple Booking)

```tsx
import { usePlan } from "@/contexts/PlanContext";

function BookingPage() {
  const { canAccess } = usePlan();

  return (
    <>
      <ServiceSelection />
      <DateTimeSelection />

      {canAccess("hasPaymentProcessing") && <PaymentSection />}
    </>
  );
}
```

### 2. Menu condicional

```tsx
function Header() {
  const { currentPlan } = usePlan();

  return (
    <nav>
      <Link to="/appointments">Agendamentos</Link>

      {currentPlan.type === "simple_booking" && (
        <Link to="/simple/services">Serviços</Link>
      )}

      {currentPlan.type !== "simple_booking" && (
        <>
          <Link to="/business-management">Gerenciar Negócio</Link>
          <Link to="/analytics">Análises</Link>
        </>
      )}
    </nav>
  );
}
```

### 3. Proteger rota administrativa

```tsx
<Route
  path="/business-management"
  element={
    <RequireRole roles={["admin", "owner"]}>
      <RequirePlan plans={["business", "individual"]}>
        <BusinessManagementPage />
      </RequirePlan>
    </RequireRole>
  }
/>
```

## Considerações Backend

### Endpoints Sugeridos

```
GET  /api/plans/:planType/features
POST /api/users/:userId/upgrade-plan
GET  /api/services?planType=simple_booking  # Sem price
GET  /api/services?planType=business        # Com price, commission
POST /api/appointments?planType=simple_booking  # Sem payment
POST /api/appointments?planType=business        # Com payment
```

### Validações Backend

- Simple Booking: Rejeitar criação de vouchers, promoções, comissões
- Individual: Rejeitar criação de múltiplos profissionais
- Business: Validar configurações de comissão (soma = 100%)

## Conclusão

A separação de planos permite:

- ✅ Simplicidade para pequenos negócios (Simple Booking)
- ✅ Poder financeiro para autônomos (Individual)
- ✅ Gestão completa para estabelecimentos (Business)
- ✅ Preços diferenciados por complexidade
- ✅ Upgrade path claro (Simple → Individual → Business)
