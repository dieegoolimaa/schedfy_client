# 🗓️ Schedfy - Sistema Completo de Agendamentos

Sistema completo de gerenciamento de agendamentos com funcionalidades avançadas de negócio, incluindo vouchers, promoções, análises e comissões.

## 🎯 **Funcionalidades Implementadas**

### 📋 **Core System**
- ✅ **Sistema de Login** com diferentes roles (admin/professional)
- ✅ **Layout Responsivo** com header fixo e avatares
- ✅ **Notificações Toast** com Sonner
- ✅ **Roteamento Completo** com proteção por role

### 👤 **Para Clientes**
- ✅ **Agendamento Online** (`/book-appointment`)
  - Seleção de serviços
  - Escolha de profissionais
  - Calendário interativo
  - Horários disponíveis
  - Formulário de contato

### 👨‍💼 **Para Profissionais**
- ✅ **Dashboard Profissional** (`/professional/dashboard`)
  - Visão geral dos agendamentos
  - Estatísticas do dia/mês
  - Calendário pessoal
  - Gestão de status dos appointments
  - Performance e comissões

### 🔧 **Para Administradores**
- ✅ **Gerenciamento de Agendamentos** (`/admin/appointments`)
  - Filtros avançados (status, data, profissional)
  - Ações em massa
  - Controle completo de appointments
  - Estatísticas gerais

- ✅ **Dashboard de Análises** (`/admin/analytics`)
  - Gráficos interativos (Recharts)
  - KPIs principais
  - Performance por profissional
  - Tendências de crescimento
  - Insights e recomendações
  - Metas e objetivos

- ✅ **Gerenciamento de Promoções** (`/admin/promotions`)
  - Criação de campanhas promocionais
  - Tipos: Happy Hour, Sazonal, Primeira Vez, Fidelidade
  - Restrições por dia/horário
  - Tracking de resultados

- ✅ **Gerenciamento de Vouchers** (`/admin/vouchers`)
  - Códigos de desconto personalizados
  - Regras complexas de aplicação
  - Limites de uso
  - Geração automática de códigos
  - Tracking detalhado de utilizações

## 🏗️ **Arquitetura do Sistema**

### 📁 **Estrutura de Pastas**
```
src/
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Componentes do Shadcn UI
│   ├── AppointmentCard.tsx
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ProfessionalCard.tsx
│   └── login-form.tsx
├── interfaces/          # TypeScript interfaces
│   ├── appointment.interface.ts
│   ├── analytics.interface.ts
│   ├── promotion.interface.ts
│   ├── service.interface.ts
│   └── user.interface.ts
├── mock-data/          # Dados de exemplo
│   ├── appointments.ts
│   ├── professional.ts
│   └── user.ts
├── pages/              # Páginas da aplicação
│   ├── AnalyticsPage.tsx
│   ├── AppointmentManagementPage.tsx
│   ├── BookAppointmentPage.tsx
│   ├── LoginPage.tsx
│   ├── ProfessionalDashboard.tsx
│   ├── PromotionManagementPage.tsx
│   └── VoucherManagementPage.tsx
└── lib/                # Utilitários
    └── utils.ts
```

### 🔗 **Rotas do Sistema**

#### **Públicas**
- `/` - Login
- `/book-appointment` - Agendamento para clientes

#### **Profissionais**
- `/professional/dashboard` - Dashboard do profissional
- `/appointments/:id` - Agendamentos específicos

#### **Administrativas**
- `/admin/appointments` - Gerenciamento de agendamentos
- `/admin/analytics` - Análises e relatórios
- `/admin/promotions` - Gerenciamento de promoções
- `/admin/vouchers` - Gerenciamento de vouchers
- `/professionals` - Lista de profissionais

## 💼 **Funcionalidades de Negócio**

### 💰 **Sistema Financeiro**
- **Comissões**: Divisão automática entre profissional e estabelecimento
- **Descontos**: Aplicação de vouchers e promoções
- **Preços**: Original vs Final com tracking de descontos
- **Pagamentos**: Múltiplos métodos com controle de status

### 🎟️ **Sistema de Vouchers**
- **Tipos**: Percentual, Valor Fixo, Compre X Leve Y, Serviço Grátis
- **Regras**: Valor mínimo, dias da semana, horários
- **Limites**: Total e por cliente
- **Tracking**: Utilização detalhada com histórico

### 🎉 **Sistema de Promoções**
- **Campanhas**: Happy Hour, Sazonais, Primeira Vez, Fidelidade
- **Automação**: Aplicação automática baseada em regras
- **Analytics**: ROI e efetividade das campanhas
- **Flexibilidade**: Configuração granular de restrições

### 📊 **Sistema de Análises**
- **Dashboards**: Visuais interativos com Recharts
- **KPIs**: Receita, conversão, ticket médio, comissões
- **Insights**: Recomendações automáticas de otimização
- **Relatórios**: Exportação em PDF/CSV

## 🛠️ **Tecnologias Utilizadas**

### **Frontend**
- **React 18** - Framework principal
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento SPA
- **Tailwind CSS** - Estilização

### **UI Components**
- **Shadcn UI** - Biblioteca de componentes
- **Radix UI** - Componentes primitivos
- **Lucide React** - Ícones
- **Recharts** - Gráficos e charts
- **Sonner** - Notificações toast

### **Funcionalidades Específicas**
- **date-fns** - Manipulação de datas
- **React Hook Form** - Formulários
- **Zod** - Validação de schemas

## 🚀 **Como Executar**

### **Instalação**
```bash
# Clone o repositório
git clone [repository-url]

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev
```

### **Usuários de Teste**
```javascript
// Admin
Email: admin@gmail.com
Senha: P@ssw0rd

// Profissional
Email: professional@gmail.com
Senha: P@ssw0rd

// Profissional Específico
Email: jose.silva@example.com
Senha: P@ssw0rd
```

## 📱 **Fluxos de Uso**

### **Cliente - Agendamento**
1. Acessa `/book-appointment`
2. Escolhe serviço desejado
3. Seleciona profissional
4. Escolhe data e horário
5. Preenche informações de contato
6. Confirma agendamento

### **Profissional - Gestão**
1. Faz login como profissional
2. Acessa dashboard pessoal
3. Visualiza agendamentos do dia
4. Atualiza status dos appointments
5. Acompanha performance e comissões

### **Admin - Gestão Completa**
1. Faz login como admin
2. Acessa análises para insights
3. Gerencia appointments globalmente
4. Cria promoções e vouchers
5. Acompanha métricas de negócio

## 🎨 **Interface e UX**

### **Design System**
- **Colors**: Azul (#3b82f6), Verde (#22c55e), Vermelho (#ef4444)
- **Typography**: Sistema de fontes Tailwind
- **Spacing**: Grid 4px base
- **Shadows**: Elevação sutil com Tailwind

### **Responsividade**
- **Mobile First**: Design otimizado para mobile
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Header adaptativo com menu colapsível

### **Acessibilidade**
- **ARIA Labels**: Componentes semanticamente corretos
- **Keyboard Navigation**: Navegação por teclado
- **Color Contrast**: Ratios adequados para legibilidade
- **Screen Readers**: Suporte a leitores de tela

## 🔮 **Próximas Funcionalidades**

### **Curto Prazo**
- [ ] Sistema de notificações em tempo real
- [ ] Integração com calendários externos (Google, Outlook)
- [ ] Chat entre profissional e cliente
- [ ] Sistema de avaliações expandido

### **Médio Prazo**
- [ ] App móvel React Native
- [ ] Integração com gateways de pagamento
- [ ] Sistema de fidelidade com pontos
- [ ] Relatórios financeiros avançados

### **Longo Prazo**
- [ ] IA para otimização de agendamentos
- [ ] Marketplace multi-estabelecimentos
- [ ] API pública para integrações
- [ ] Sistema de franquias

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ usando React, TypeScript e Shadcn UI**