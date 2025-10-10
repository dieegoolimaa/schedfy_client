# Guia de Testes - Schedfy Client

## 🚀 Início Rápido

### Executar a Aplicação
```bash
npm run dev
```
O servidor será iniciado em `http://localhost:5173` (ou 5174 se a porta estiver ocupada).

### Build para Produção
```bash
npm run build
```

---

## 👥 Usuários Mock Disponíveis

Todos os usuários têm a senha: `P@ssw0rd`

| Email | Role | Acesso |
|-------|------|--------|
| `owner@example.com` | owner | Acesso completo (Business tier) |
| `admin@gmail.com` | admin | Acesso completo (Business tier) |
| `jose.silva@example.com` | professional | Dashboard profissional + agendamentos |
| `simple@example.com` | simple | Análises, serviços, agendamentos (Simple tier) |

---

## 🧪 Fluxos de Teste

### 1. Fluxo Público de Agendamento
1. Acesse a **HomePage** (`/`)
2. Clique em **"Agende agora"** ou **"Book now"**
3. Siga o fluxo multi-step:
   - **Passo 1**: Selecione um serviço
   - **Passo 2**: Escolha um profissional
   - **Passo 3**: Selecione data e horário
   - **Passo 4**: Insira nome e telefone
   - **Passo 5**: Confirme os dados
4. Será redirecionado para `/book-appointment` com dados pré-preenchidos
5. Confirme o agendamento
6. Complete o pagamento mock
7. ✅ Agendamento salvo em `localStorage.mock_appointments`

**Verificação:**
```javascript
// No console do navegador
JSON.parse(localStorage.getItem('mock_appointments'))
```

---

### 2. Fluxo Profissional Multi-Data
1. Faça login com `jose.silva@example.com`
2. Acesse `/book-appointment`
3. Preencha serviço, profissional e horário
4. Na seção **Data**, você verá:
   - Botão **"Adicionar outra data"** (ou **"Add another date"** em inglês)
   - Botão **"Limpar datas"** (ou **"Clear dates"**)
5. Clique em **"Adicionar outra data"** para adicionar múltiplas datas
6. Preencha os campos de contato
7. Confirme o agendamento
8. Complete o pagamento mock
9. ✅ **Múltiplos agendamentos** criados (um para cada data selecionada)

**Verificação:**
```javascript
// No console do navegador
JSON.parse(localStorage.getItem('mock_appointments'))
// Deve conter um agendamento para cada data selecionada
```

---

### 3. Teste de Visibilidade por Role

#### Owner / Admin (Business Tier)
**Login:** `owner@example.com` ou `admin@gmail.com`

**Menu disponível:**
- ✅ Gerenciar Negócio
- ✅ Horários
- ✅ Serviços
- ✅ Vouchers
- ✅ Promoções
- ✅ Comissão
- ✅ Agendamentos
- ✅ Análises
- ✅ Profissionais
- ✅ Agendar (público)

**Rotas protegidas acessíveis:**
- `/admin/horarios`
- `/admin/services`
- `/admin/commission`
- `/admin/vouchers`
- `/admin/promotions`

---

#### Professional
**Login:** `jose.silva@example.com`

**Menu disponível:**
- ✅ Dashboard
- ✅ Agendamentos
- ✅ Agendar (com suporte multi-data)

**Diferencial:**
- Pode agendar múltiplas datas de uma vez
- Dados do profissional pré-preenchidos

---

#### Simple Admin
**Login:** `simple@example.com`

**Menu disponível:**
- ✅ Análises
- ✅ Serviços
- ✅ Agendamentos
- ✅ Agendar

**Limitações:**
- ❌ Não acessa Vouchers, Promoções, Comissão
- ❌ Não acessa Gerenciar Negócio

---

### 4. Teste de i18n (Internacionalização)

1. Acesse a **HomePage** (`/`)
2. No rodapé, altere o idioma:
   - 🇺🇸 **English**
   - 🇧🇷 **Português (BR)**
   - 🇵🇹 **Português (PT)**
   - 🇪🇸 **Español**
3. Verifique se os textos mudam:
   - Botões de CTA
   - Labels de formulários
   - Mensagens do fluxo de agendamento

**Chaves traduzidas incluem:**
- `home.*` (HomePage CTAs)
- `book.*` (Formulários de agendamento)
- `booking.addAnotherDate`, `booking.clearDates` (Multi-data)
- `payment.*` (Métodos de pagamento)

---

### 5. Teste de Estilo e Design Tokens

#### Verificar backgrounds consistentes:
- **HomePage**: `bg-[var(--color-background)]`
- **PublicBookingLanding**: `bg-[var(--color-background)]`

#### Verificar bordas gradientes:
Na **HomePage**, os seguintes cards devem ter bordas gradiente (primary → accent):
- Card "Agendamento público"
- Card "Gestão de profissionais"
- Card "Pagamentos mock"
- Card de demonstração (grande card à direita)

**CSS utility:** `.gradient-border`

#### Testar Dark Mode:
1. Clique no ícone de tema no Header (sol/lua)
2. Verifique que todas as cores se adaptam usando variáveis CSS
3. Verifique legibilidade de textos e contraste

---

## 🗂️ LocalStorage Keys

| Key | Conteúdo |
|-----|----------|
| `loggedInUser` | Usuário autenticado atual |
| `mock_appointments` | Array de agendamentos |
| `mock_customers` | Array de clientes criados |

---

## 🎨 Design Tokens (CSS Variables)

### Variáveis principais:
```css
--color-background
--color-foreground
--color-card
--color-primary
--color-accent
--color-border
--color-muted-foreground
```

**Localização:** `src/index.css`

---

## 📱 Responsividade

### Breakpoints testados:
- **Mobile**: < 640px (menu mobile com Sheet)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px (menu desktop completo)

**Teste:**
1. Abra DevTools (F12)
2. Ative "Toggle device toolbar" (Ctrl+Shift+M)
3. Teste nos presets: iPhone SE, iPad, Desktop HD

---

## 🐛 Debugging

### Ver agendamentos salvos:
```javascript
console.table(JSON.parse(localStorage.getItem('mock_appointments')))
```

### Ver clientes salvos:
```javascript
console.table(JSON.parse(localStorage.getItem('mock_customers')))
```

### Limpar localStorage:
```javascript
localStorage.clear()
```

### Ver usuário logado:
```javascript
JSON.parse(localStorage.getItem('loggedInUser'))
```

---

## ✅ Checklist de Testes Completos

- [ ] HomePage carrega com CTAs traduzidos
- [ ] Fluxo público multi-step funciona
- [ ] Prefill de query params em BookAppointmentPage
- [ ] Login com cada role (owner, admin, professional, simple)
- [ ] Menu do Header muda por role
- [ ] Profissional pode adicionar múltiplas datas
- [ ] Pagamento mock completa com sucesso
- [ ] Agendamento(s) salvos em localStorage
- [ ] i18n muda textos corretamente
- [ ] Bordas gradientes aparecem nos cards
- [ ] Dark mode funciona em todas as páginas
- [ ] Responsivo em mobile, tablet e desktop
- [ ] RequireRole bloqueia acesso não autorizado

---

## 📝 Notas Técnicas

### Tecnologias:
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (utilitários)
- **react-router-dom v7** (roteamento)
- **date-fns** (manipulação de datas)
- **sonner** (toasts/notificações)

### Estrutura de Pastas:
```
src/
├── components/       # Componentes reutilizáveis + UI
├── pages/           # Páginas da aplicação
├── contexts/        # Context API (Theme, i18n)
├── interfaces/      # TypeScript interfaces
├── mock-data/       # Dados mock
├── i18n/           # Arquivos de tradução (en, pt-BR, pt, es)
└── lib/            # Utilitários (utils.ts)
```

---

## 🚨 Problemas Conhecidos

### Avisos de Build:
- **Chunk size warning**: Bundle > 500KB (normal para app React completo)
  - Solução futura: code-splitting com dynamic imports

### CSS Lint Warnings:
- `@custom-variant`, `@theme`, `@apply` — avisos de Tailwind v4 moderno (pode ignorar)

---

## 🎯 Próximos Passos Sugeridos

1. **Validação de formulários**: adicionar validação mais robusta (zod, yup)
2. **Code-splitting**: reduzir tamanho do bundle principal
3. **Testes automatizados**: Jest + React Testing Library
4. **E2E tests**: Playwright ou Cypress
5. **Backend real**: conectar a API real (substituir localStorage)
6. **PWA**: transformar em Progressive Web App
7. **Autenticação real**: JWT, OAuth, ou similar

---

## 📞 Suporte

Para dúvidas ou problemas, verifique:
- `README.md` (instruções gerais)
- `README_COMPLETE.md` (documentação completa do projeto)
- Este arquivo (`TESTING_GUIDE.md`)

---

**Última atualização:** Outubro 2025
**Versão:** 1.0.0
