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
import HomePage from "./pages/HomePage";
import RequireRole from './components/RequireRole';
import AdminServicesPage from './pages/admin/services';
import AdminCommissionPage from './pages/admin/commission';
import AdminHorariosPage from './pages/admin/horarios';
import BusinessManagementPage from './pages/BusinessManagementPage';

function App() {
  return (
    <>
      <Routes>
        {/* Home page pública */}
        <Route path="/" element={<HomePage />} />

        {/* Página de Login - sem layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* Fluxo de Criação de Conta - sem layout */}
        <Route path="/create-business" element={<CreateBusinessPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route
          path="/create-professional-profile"
          element={<CreateProfessionalProfilePage />}
        />
        <Route path="/public-booking" element={<PublicBookingLanding />} />

        {/* Business Management - Protected route */}
        <Route
          path="/business-management"
          element={
            <RequireRole roles={['admin', 'owner']}>
              <BusinessManagementPage />
            </RequireRole>
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
        <Route
          path="/admin/promotions"
          element={
            <RequireRole roles={["admin","owner"]}>
              <Layout>
                <PromotionManagementPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/admin/vouchers"
          element={
            <RequireRole roles={["admin","owner"]}>
              <Layout>
                <VoucherManagementPage />
              </Layout>
            </RequireRole>
          }
        />
        <Route
          path="/admin/services"
          element={
            <RequireRole roles={["admin","owner"]}>
              <AdminServicesPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/commission"
          element={
            <RequireRole roles={["admin","owner"]}>
              <AdminCommissionPage />
            </RequireRole>
          }
        />
        <Route
          path="/admin/horarios"
          element={
            <RequireRole roles={["admin","owner"]}>
              <AdminHorariosPage />
            </RequireRole>
          }
        />
        <Route
          path="/professionals"
          element={
            <Layout>
              <ProfessionalsPage />
            </Layout>
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
    </>
  );
}

export default App;
