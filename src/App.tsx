import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Appointments from "./pages/Appointments";
import { Toaster } from "@/components/ui/sonner";
import ProfessionalsPage from "./pages/ProfessionalPage";
import { Layout } from "@/components/Layout";
import OnGoingServicesPage from "./pages/OnGoingServicesPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import AppointmentManagementPage from "./pages/AppointmentManagementPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import PromotionManagementPage from "./pages/PromotionManagementPage";
import VoucherManagementPage from "./pages/VoucherManagementPage";
import ServiceCompletionDemo from "./pages/ServiceCompletionDemo";
import ProfessionalAppointmentDemo from "./pages/ProfessionalAppointmentDemo";
import CreateBusinessPage from "./pages/CreateBusinessPage";
import CreateUserPage from "./pages/CreateUserPage";
import CreateProfessionalProfilePage from "./pages/CreateProfessionalProfilePage";
import ProfessionalAnalyticsPage from "./pages/ProfessionalAnalyticsPage";
import PublicBookingLanding from "./pages/PublicBookingLanding";
import HomePage from "./pages/NewHomePage";
import SuspendedAccountPage from "./pages/SuspendedAccountPage";
import BusinessProfilePage from "./pages/BusinessProfilePage";
import BusinessManagementProfilePage from "./pages/BusinessManagementProfilePage";
import RequireRole from "./components/RequireRole";
import BusinessManagementPage from "./pages/BusinessManagementPage";
import { PlanProvider } from "./contexts/PlanContext";
import { RequirePlan } from "./components/RequirePlan";
import RequirePlanType from "./components/RequirePlanType";
import SimpleBookingAppointmentsPage from "./pages/simple/AppointmentsPage";
import SimpleBookingServicesPage from "./pages/simple/ServicesPage";
import FeedbackPage from "./pages/FeedbackPage";
import BusinessDashboard from "./pages/BusinessDashboard";
import SchedfyAdminDashboard from "./pages/schedfy-admin/DashboardPage";
import SchedfyCompaniesPage from "./pages/schedfy-admin/CompaniesPage";
import SchedfyPlansPage from "./pages/schedfy-admin/PlansPage";
import SchedfyLogsPage from "./pages/schedfy-admin/LogsPage";

function App() {
  return (
    <PlanProvider>
      <Routes>
        {/* Home page pública */}
        <Route path="/" element={<HomePage />} />

        {/* Página de Perfil Público do Negócio */}
        <Route path="/b/:slug" element={<BusinessProfilePage />} />

        {/* Página de Login - sem layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Página de Conta Suspensa - sem layout */}
        <Route path="/account-suspended" element={<SuspendedAccountPage />} />

        {/* Fluxo de Criação de Conta - sem layout */}
        <Route path="/create-business" element={<CreateBusinessPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route
          path="/create-professional-profile"
          element={<CreateProfessionalProfilePage />}
        />
        <Route path="/public-booking" element={<PublicBookingLanding />} />

        {/* Schedfy Admin Routes - Protected for platform_admin */}
        <Route
          path="/schedfy/dashboard"
          element={
            <RequireRole roles={["platform_admin"]}>
              <Layout>
                <SchedfyAdminDashboard />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/schedfy/companies"
          element={
            <RequireRole roles={["platform_admin"]}>
              <Layout>
                <SchedfyCompaniesPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/schedfy/plans"
          element={
            <RequireRole roles={["platform_admin"]}>
              <Layout>
                <SchedfyPlansPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/schedfy/logs"
          element={
            <RequireRole roles={["platform_admin"]}>
              <Layout>
                <SchedfyLogsPage />
              </Layout>
            </RequireRole>
          }
        />

        {/* Business Management - Protected route for business/individual */}
        <Route
          path="/dashboard"
          element={
            <RequireRole roles={["admin", "owner"]}>
              <Layout>
                <BusinessDashboard />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/business-management"
          element={
            <RequireRole roles={["admin", "owner"]}>
              <RequirePlanType
                allowedPlans={["business"]}
                deniedMessage="O gerenciamento de negócio avançado está disponível apenas no plano Business."
              >
                <BusinessManagementPage />
              </RequirePlanType>
            </RequireRole>
          }
        />
        <Route
          path="/business-profile-management"
          element={
            <RequireRole roles={["admin", "owner"]}>
              <Layout>
                <BusinessManagementProfilePage />
              </Layout>
            </RequireRole>
          }
        />

        {/* Simple Booking Routes - Only for simple_booking plan */}
        <Route
          path="/simple/appointments"
          element={
            <RequirePlan plans={["simple_booking"]}>
              <SimpleBookingAppointmentsPage />
            </RequirePlan>
          }
        />
        <Route
          path="/simple/services"
          element={
            <RequirePlan plans={["simple_booking"]}>
              <SimpleBookingServicesPage />
            </RequirePlan>
          }
        />

        {/* Páginas Públicas/Clientes */}
        <Route path="/book-appointment" element={<BookAppointmentPage />} />

        {/* Páginas de demonstração */}
        <Route
          path="/professional-demo"
          element={
            <Layout>
              <ProfessionalAppointmentDemo />
            </Layout>
          }
        />
        <Route
          path="/service-completion-demo"
          element={<ServiceCompletionDemo />}
        />

        {/* Páginas para Profissionais */}
        <Route
          path="/professional/dashboard"
          element={
            <Layout>
              <ProfessionalDashboard />
            </Layout>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <Layout>
              <Appointments />
            </Layout>
          }
        />

        {/* Páginas Administrativas */}
        <Route
          path="/admin/appointments"
          element={
            <Layout>
              <AppointmentManagementPage />
            </Layout>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <Layout>
              <AnalyticsPage />
            </Layout>
          }
        />
        <Route
          path="/admin/analytics/professional/:id"
          element={
            <Layout>
              <ProfessionalAnalyticsPage />
            </Layout>
          }
        />

        {/* Feedback Page - Available for all plans */}
        <Route path="/feedback" element={<FeedbackPage />} />

        <Route
          path="/admin/promotions"
          element={
            <RequireRole roles={["admin", "owner"]}>
              <Layout>
                <PromotionManagementPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/admin/vouchers"
          element={
            <RequireRole roles={["admin", "owner"]}>
              <Layout>
                <VoucherManagementPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/professionals"
          element={
            <RequireRole roles={["admin", "owner", "simple"]}>
              <RequirePlanType
                allowedPlans={["business", "simple_booking"]}
                deniedMessage="A gestão de profissionais/atendentes não está disponível no plano Individual. Você trabalha sozinho!"
              >
                <Layout>
                  <ProfessionalsPage />
                </Layout>
              </RequirePlanType>
            </RequireRole>
          }
        />
        <Route
          path="/ongoing-services"
          element={
            <Layout>
              <OnGoingServicesPage />
            </Layout>
          }
        />

        {/* Página 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Página não encontrada</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Voltar ao início
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      <Toaster />
    </PlanProvider>
  );
}

export default App;
