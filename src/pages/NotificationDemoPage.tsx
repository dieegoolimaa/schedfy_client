import React, { useState } from "react";
import {
  NotificationList,
  CreateNotificationForm,
} from "../components/NotificationList";
import { useNotificationTesting } from "../hooks/useNotifications";
import type { Notification } from "../services/notificationService";

const NotificationDemoPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { testing, testResults, testEmail, testSms, testWhatsApp, resetTests } =
    useNotificationTesting();

  const [testData, setTestData] = useState({
    email: "",
    phone: "",
    subject: "Teste de Notificação - Schedfy",
    message:
      "Esta é uma mensagem de teste do sistema Schedfy. Se você recebeu esta notificação, o sistema está funcionando corretamente.",
  });

  const handleNotificationCreated = (notification: Notification) => {
    console.log("Notificação criada:", notification);
    setShowCreateForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTestEmail = async () => {
    if (!testData.email) {
      alert("Por favor, insira um e-mail");
      return;
    }

    const success = await testEmail(
      testData.email,
      testData.subject,
      testData.message
    );
    if (success) {
      alert("E-mail de teste enviado com sucesso!");
    } else {
      alert("Falha ao enviar e-mail de teste. Verifique a configuração.");
    }
  };

  const handleTestSms = async () => {
    if (!testData.phone) {
      alert("Por favor, insira um telefone");
      return;
    }

    const success = await testSms(testData.phone, testData.message);
    if (success) {
      alert("SMS de teste enviado com sucesso!");
    } else {
      alert(
        "Falha ao enviar SMS de teste. Verifique a configuração do Twilio."
      );
    }
  };

  const handleTestWhatsApp = async () => {
    if (!testData.phone) {
      alert("Por favor, insira um telefone");
      return;
    }

    const success = await testWhatsApp(testData.phone, testData.message);
    if (success) {
      alert("WhatsApp de teste enviado com sucesso!");
    } else {
      alert(
        "Falha ao enviar WhatsApp de teste. Verifique a configuração do Twilio."
      );
    }
  };

  return (
    <div className="notification-demo-page max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Sistema de Notificações - Demonstração
        </h1>
        <p className="text-gray-600">
          Gerencie e teste o sistema completo de notificações multi-canal
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Seção de Testes */}
        <div className="test-section xl:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">🧪 Testes de Envio</h2>

            {/* Configurações de Teste */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail para teste:
                </label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={testData.email}
                  onChange={(e) =>
                    setTestData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone para teste:
                </label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={testData.phone}
                  onChange={(e) =>
                    setTestData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="+55 11 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assunto (E-mail):
                </label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={testData.subject}
                  onChange={(e) =>
                    setTestData((prev) => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem:
                </label>
                <textarea
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  value={testData.message}
                  onChange={(e) =>
                    setTestData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Botões de Teste */}
            <div className="space-y-3">
              <button
                onClick={handleTestEmail}
                disabled={testing || !testData.email}
                className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {testing ? "⏳" : "📧"} Testar E-mail
                {testResults.email !== undefined && (
                  <span className="ml-2">
                    {testResults.email ? "✅" : "❌"}
                  </span>
                )}
              </button>

              <button
                onClick={handleTestSms}
                disabled={testing || !testData.phone}
                className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {testing ? "⏳" : "💬"} Testar SMS
                {testResults.sms !== undefined && (
                  <span className="ml-2">{testResults.sms ? "✅" : "❌"}</span>
                )}
              </button>

              <button
                onClick={handleTestWhatsApp}
                disabled={testing || !testData.phone}
                className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {testing ? "⏳" : "📱"} Testar WhatsApp
                {testResults.whatsapp !== undefined && (
                  <span className="ml-2">
                    {testResults.whatsapp ? "✅" : "❌"}
                  </span>
                )}
              </button>
            </div>

            {Object.keys(testResults).length > 0 && (
              <button
                onClick={resetTests}
                className="w-full mt-4 p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Limpar Resultados
              </button>
            )}
          </div>

          {/* Ações Rápidas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">⚡ Ações Rápidas</h3>
            <div className="space-y-3">
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="w-full p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {showCreateForm ? "Cancelar" : "➕ Nova Notificação"}
              </button>

              <button
                onClick={() => setRefreshTrigger((prev) => prev + 1)}
                className="w-full p-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                🔄 Atualizar Lista
              </button>
            </div>
          </div>
        </div>

        {/* Seção Principal */}
        <div className="main-section xl:col-span-2">
          {/* Formulário de Criação */}
          {showCreateForm && (
            <div className="mb-6">
              <CreateNotificationForm
                onSuccess={handleNotificationCreated}
                onCancel={() => setShowCreateForm(false)}
              />
            </div>
          )}

          {/* Lista de Notificações */}
          <NotificationList
            key={refreshTrigger}
            showStats={true}
            showFilters={true}
            className="notification-list-container"
          />
        </div>
      </div>

      {/* Informações e Guias */}
      <div className="info-section mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status dos Canais */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">📊 Status dos Canais</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>E-mail (Nodemailer)</span>
              </div>
              <span className="text-blue-600 font-medium">
                {testResults.email === true
                  ? "Funcionando"
                  : testResults.email === false
                  ? "Com Problemas"
                  : "Não Testado"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div className="flex items-center">
                <span className="mr-2">💬</span>
                <span>SMS (Twilio)</span>
              </div>
              <span className="text-green-600 font-medium">
                {testResults.sms === true
                  ? "Funcionando"
                  : testResults.sms === false
                  ? "Com Problemas"
                  : "Não Testado"}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 rounded">
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span>WhatsApp (Twilio)</span>
              </div>
              <span className="text-green-600 font-medium">
                {testResults.whatsapp === true
                  ? "Funcionando"
                  : testResults.whatsapp === false
                  ? "Com Problemas"
                  : "Não Testado"}
              </span>
            </div>
          </div>
        </div>

        {/* Guia de Uso */}
        <div className="bg-amber-50 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-amber-900">
            📖 Guia de Uso
          </h3>
          <div className="space-y-2 text-amber-800 text-sm">
            <p>
              <strong>Configuração:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Configure SMTP para e-mail no .env</li>
              <li>Configure Twilio para SMS/WhatsApp</li>
              <li>Teste cada canal antes do uso</li>
            </ul>

            <p className="mt-3">
              <strong>Recursos:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Envio automático com cron jobs</li>
              <li>Retry automático em caso de falha</li>
              <li>Templates reutilizáveis</li>
              <li>Notificações em lote</li>
              <li>Agendamento de envios</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDemoPage;
