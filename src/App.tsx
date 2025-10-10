import './App.css'
import { Routes, Route } from "react-router";
import LoginPage from './pages/LoginPage';
import Appointments from './pages/Appointments';
import { Toaster } from "@/components/ui/sonner";
import ProfessionalsPage from './pages/ProfessionalPage';
import { Layout } from "@/components/Layout";
import OnGoingServicesPage from './pages/OnGoingServicesPage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import ProfessionalDashboard from './pages/ProfessionalDashboard';
import AppointmentManagementPage from './pages/AppointmentManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PromotionManagementPage from './pages/PromotionManagementPage';
import VoucherManagementPage from './pages/VoucherManagementPage';
import ServiceCompletionDemo from './pages/ServiceCompletionDemo';
import ProfessionalAppointmentDemo from './pages/ProfessionalAppointmentDemo';
import CreateBusinessPage from './pages/CreateBusinessPage';
import CreateUserPage from './pages/CreateUserPage';
import CreateProfessionalProfilePage from './pages/CreateProfessionalProfilePage';
import ProfessionalAnalyticsPage from './pages/ProfessionalAnalyticsPage';

function App() {


  return (
    <>
      <Routes>
        {/* Página de Login - sem layout */}
        <Route path="/" element={<LoginPage />} />

        {/* Fluxo de Criação de Conta - sem layout */}
        <Route path="/create-business" element={<CreateBusinessPage />} />
        <Route path="/create-user" element={<CreateUserPage />} />
        <Route path="/create-professional-profile" element={<CreateProfessionalProfilePage />} />

        {/* Páginas Públicas/Clientes */}
        <Route path="/book-appointment" element={<BookAppointmentPage />} />
        
        {/* Páginas de demonstração */}
        <Route path="/professional-demo" element={
          <Layout>
            <ProfessionalAppointmentDemo />
          </Layout>
        } />
        <Route path="/service-completion-demo" element={<ServiceCompletionDemo />} />

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
            <Layout>
              <PromotionManagementPage />
            </Layout>
          }
        />
        <Route
          path="/admin/vouchers"
          element={
            <Layout>
              <VoucherManagementPage />
            </Layout>
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
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-gray-600 mb-4">Página não encontrada</p>
              <a href="/" className="text-blue-600 hover:underline">Voltar ao início</a>
            </div>
          </div>
        } />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
