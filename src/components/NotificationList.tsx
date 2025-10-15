import React, { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import type {
  Notification,
  CreateNotificationDto,
  NotificationFilter,
} from "../services/notificationService";

interface NotificationListProps {
  filter?: NotificationFilter;
  showStats?: boolean;
  showFilters?: boolean;
  className?: string;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  filter,
  showStats = true,
  showFilters = true,
  className = "",
}) => {
  const {
    notifications,
    loading,
    error,
    stats,
    totalCount,
    currentPage,
    totalPages,
    fetchNotifications,
    sendNotification,
  } = useNotifications({ initialFilter: filter });

  const [currentFilter, setCurrentFilter] = useState<NotificationFilter>(
    filter || {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
  );

  const handleFilterChange = (newFilter: Partial<NotificationFilter>) => {
    const updatedFilter = { ...currentFilter, ...newFilter, page: 1 };
    setCurrentFilter(updatedFilter);
    fetchNotifications(updatedFilter);
  };

  const handlePageChange = (page: number) => {
    const updatedFilter = { ...currentFilter, page };
    setCurrentFilter(updatedFilter);
    fetchNotifications(updatedFilter);
  };

  const getStatusColor = (status: Notification["status"]): string => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800",
      SENT: "bg-blue-100 text-blue-800",
      DELIVERED: "bg-green-100 text-green-800",
      FAILED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    };
    return colors[status];
  };

  const getPriorityColor = (priority: Notification["priority"]): string => {
    const colors = {
      LOW: "bg-gray-100 text-gray-600",
      NORMAL: "bg-blue-100 text-blue-600",
      HIGH: "bg-orange-100 text-orange-600",
      URGENT: "bg-red-100 text-red-600",
    };
    return colors[priority];
  };

  const getChannelIcon = (channel: Notification["channel"]): string => {
    const icons = {
      EMAIL: "📧",
      SMS: "💬",
      WHATSAPP: "📱",
    };
    return icons[channel];
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className={`notification-list ${className}`}>
      {/* Estatísticas */}
      {showStats && stats && (
        <div className="stats-grid grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="stat-card bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-gray-500">Total</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-yellow-600">Pendentes</h3>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-blue-600">Enviadas</h3>
            <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-green-600">Entregues</h3>
            <p className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </p>
          </div>
          <div className="stat-card bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm text-red-600">Falharam</h3>
            <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
          </div>
        </div>
      )}

      {/* Filtros */}
      {showFilters && (
        <div className="filters bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={currentFilter.status || ""}
                onChange={(e) =>
                  handleFilterChange({
                    status:
                      (e.target.value as Notification["status"]) || undefined,
                  })
                }
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="SENT">Enviada</option>
                <option value="DELIVERED">Entregue</option>
                <option value="FAILED">Falhou</option>
                <option value="CANCELLED">Cancelada</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canal
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={currentFilter.channel || ""}
                onChange={(e) =>
                  handleFilterChange({
                    channel:
                      (e.target.value as Notification["channel"]) || undefined,
                  })
                }
              >
                <option value="">Todos</option>
                <option value="EMAIL">E-mail</option>
                <option value="SMS">SMS</option>
                <option value="WHATSAPP">WhatsApp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridade
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={currentFilter.priority || ""}
                onChange={(e) =>
                  handleFilterChange({
                    priority:
                      (e.target.value as Notification["priority"]) || undefined,
                  })
                }
              >
                <option value="">Todas</option>
                <option value="LOW">Baixa</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta</option>
                <option value="URGENT">Urgente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Itens por página
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg"
                value={currentFilter.limit || 10}
                onChange={(e) =>
                  handleFilterChange({
                    limit: parseInt(e.target.value),
                  })
                }
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Carregando notificações...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="error-message bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Lista de Notificações */}
      {!loading && notifications.length === 0 && (
        <div className="empty-state text-center py-8">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-500">Nenhuma notificação encontrada</p>
        </div>
      )}

      {!loading && notifications.length > 0 && (
        <div className="notifications-container">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className="notification-card bg-white rounded-lg shadow p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">
                      {getChannelIcon(notification.channel)}
                    </span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Para:{" "}
                        {notification.recipientName ||
                          notification.email ||
                          notification.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        notification.priority
                      )}`}
                    >
                      {notification.priority}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        notification.status
                      )}`}
                    >
                      {notification.status}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-3">
                  {notification.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="space-x-4">
                    <span>
                      Criado: {formatDateTime(notification.createdAt)}
                    </span>
                    {notification.sentAt && (
                      <span>
                        Enviado: {formatDateTime(notification.sentAt)}
                      </span>
                    )}
                    {notification.deliveredAt && (
                      <span>
                        Entregue: {formatDateTime(notification.deliveredAt)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {notification.retryCount > 0 && (
                      <span className="text-orange-600">
                        Tentativas: {notification.retryCount}
                      </span>
                    )}

                    {notification.status === "PENDING" && (
                      <button
                        onClick={() => sendNotification(notification._id)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Enviar Agora
                      </button>
                    )}
                  </div>
                </div>

                {notification.errors && notification.errors.length > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
                    <p className="text-sm text-red-700">
                      Erros: {notification.errors.join(", ")}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="pagination flex items-center justify-between mt-6">
              <p className="text-sm text-gray-700">
                Mostrando {(currentPage - 1) * (currentFilter.limit || 10) + 1}{" "}
                a{" "}
                {Math.min(
                  currentPage * (currentFilter.limit || 10),
                  totalCount
                )}{" "}
                de {totalCount} resultados
              </p>

              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>

                <span className="px-3 py-2 text-sm">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para criar nova notificação
export const CreateNotificationForm: React.FC<{
  onSuccess?: (notification: Notification) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const { createNotification, loading } = useNotifications();
  const [formData, setFormData] = useState<CreateNotificationDto>({
    type: "OTHER",
    channel: "EMAIL",
    title: "",
    content: "",
    priority: "NORMAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const notification = await createNotification(formData);
    if (notification) {
      onSuccess?.(notification);
      // Reset form
      setFormData({
        type: "OTHER",
        channel: "EMAIL",
        title: "",
        content: "",
        priority: "NORMAL",
      });
    }
  };

  const handleChange = (field: keyof CreateNotificationDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="create-notification-form bg-white rounded-lg shadow p-6"
    >
      <h2 className="text-xl font-bold mb-4">Nova Notificação</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="APPOINTMENT_REMINDER">
              Lembrete de Agendamento
            </option>
            <option value="APPOINTMENT_CONFIRMATION">
              Confirmação de Agendamento
            </option>
            <option value="PAYMENT_CONFIRMATION">
              Confirmação de Pagamento
            </option>
            <option value="BUSINESS_ANNOUNCEMENT">Anúncio da Empresa</option>
            <option value="SYSTEM_ALERT">Alerta do Sistema</option>
            <option value="OTHER">Outros</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Canal *
          </label>
          <select
            required
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.channel}
            onChange={(e) => handleChange("channel", e.target.value)}
          >
            <option value="EMAIL">E-mail</option>
            <option value="SMS">SMS</option>
            <option value="WHATSAPP">WhatsApp</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título *
        </label>
        <input
          type="text"
          required
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Título da notificação"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Conteúdo *
        </label>
        <textarea
          required
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-lg"
          value={formData.content}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Conteúdo da notificação"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.email || ""}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="destinatario@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="tel"
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+55 11 99999-9999"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="LOW">Baixa</option>
            <option value="NORMAL">Normal</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar Notificação"}
        </button>
      </div>
    </form>
  );
};

export default NotificationList;
