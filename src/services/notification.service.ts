import type { AppointmentNotification, NotificationType } from "@/types/approval.types";
import { toast } from "sonner";

/**
 * Notification Service
 * Handles sending notifications via Email, SMS, and WhatsApp
 */
class NotificationService {
  /**
   * Send notification to customer
   */
  async sendNotification(notification: AppointmentNotification): Promise<boolean> {
    try {
      // In production, this would call your backend API
      console.log("Sending notification:", notification);

      // Simulate API call
      await this.simulateApiCall();

      // Send via each channel
      const promises = notification.type.map((type) =>
        this.sendViaChannel(type, notification)
      );

      await Promise.all(promises);

      toast.success(`Notificação enviada via ${notification.type.join(", ")}`);
      return true;
    } catch (error) {
      console.error("Failed to send notification:", error);
      toast.error("Erro ao enviar notificação");
      return false;
    }
  }

  /**
   * Send notification via specific channel
   */
  private async sendViaChannel(
    type: NotificationType,
    notification: AppointmentNotification
  ): Promise<void> {
    switch (type) {
      case "email":
        await this.sendEmail(notification);
        break;
      case "sms":
        await this.sendSMS(notification);
        break;
      case "whatsapp":
        await this.sendWhatsApp(notification);
        break;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(notification: AppointmentNotification): Promise<void> {
    // In production, integrate with SendGrid, AWS SES, or similar
    console.log("📧 Sending email to:", notification.recipient.email);

    const message = this.getEmailTemplate(notification);
    console.log("Email content:", message);

    // Simulate sending
    await this.simulateApiCall();
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(notification: AppointmentNotification): Promise<void> {
    // In production, integrate with Twilio, AWS SNS, or similar
    console.log("📱 Sending SMS to:", notification.recipient.phone);

    const message = this.getSMSTemplate(notification);
    console.log("SMS content:", message);

    // Simulate sending
    await this.simulateApiCall();
  }

  /**
   * Send WhatsApp notification
   */
  private async sendWhatsApp(notification: AppointmentNotification): Promise<void> {
    // In production, integrate with WhatsApp Business API or Twilio WhatsApp
    console.log("💬 Sending WhatsApp to:", notification.recipient.phone);

    const message = this.getWhatsAppTemplate(notification);
    console.log("WhatsApp content:", message);

    // Simulate sending
    await this.simulateApiCall();
  }

  /**
   * Get email template based on notification type
   */
  private getEmailTemplate(notification: AppointmentNotification): string {
    const { template, data, recipient } = notification;

    switch (template) {
      case "pending_approval":
        return `
Olá ${recipient.name},

Seu agendamento está aguardando aprovação!

📋 Serviço: ${data.serviceName}
👤 Profissional: ${data.professionalName}
🏢 Local: ${data.businessName}
📅 Data solicitada: ${data.originalDate}

Você receberá uma confirmação assim que o profissional aprovar seu agendamento.

Obrigado,
Equipe ${data.businessName}
        `;

      case "approved":
        return `
Olá ${recipient.name},

✅ Seu agendamento foi APROVADO!

📋 Serviço: ${data.serviceName}
👤 Profissional: ${data.professionalName}
🏢 Local: ${data.businessName}
📅 Data: ${data.originalDate}

Aguardamos você!

Equipe ${data.businessName}
        `;

      case "rejected":
        return `
Olá ${recipient.name},

Infelizmente não conseguimos aprovar seu agendamento.

📋 Serviço: ${data.serviceName}
📅 Data solicitada: ${data.originalDate}
ℹ️ Motivo: ${data.reason || "Horário indisponível"}

Por favor, escolha outro horário ou entre em contato conosco.

Equipe ${data.businessName}
        `;

      case "rescheduled":
        return `
Olá ${recipient.name},

Precisamos remarcar seu agendamento.

📋 Serviço: ${data.serviceName}
❌ Data original: ${data.originalDate}
✅ Nova data sugerida: ${data.newDate}
ℹ️ Motivo: ${data.reason || "Ajuste de agenda"}

Por favor, confirme a nova data ou entre em contato conosco.

Equipe ${data.businessName}
        `;

      default:
        return "";
    }
  }

  /**
   * Get SMS template (shorter version)
   */
  private getSMSTemplate(notification: AppointmentNotification): string {
    const { template, data } = notification;

    switch (template) {
      case "pending_approval":
        return `${data.businessName}: Seu agendamento de ${data.serviceName} para ${data.originalDate} está aguardando aprovação.`;

      case "approved":
        return `${data.businessName}: Agendamento APROVADO! ${data.serviceName} em ${data.originalDate}. Aguardamos você!`;

      case "rejected":
        return `${data.businessName}: Não foi possível aprovar seu agendamento para ${data.originalDate}. ${data.reason || "Entre em contato conosco."}`;

      case "rescheduled":
        return `${data.businessName}: Seu agendamento foi remarcado de ${data.originalDate} para ${data.newDate}. ${data.reason || ""}`;

      default:
        return "";
    }
  }

  /**
   * Get WhatsApp template
   */
  private getWhatsAppTemplate(notification: AppointmentNotification): string {
    const { template, data } = notification;

    switch (template) {
      case "pending_approval":
        return `🔔 *${data.businessName}*\n\nOlá! Seu agendamento está aguardando aprovação.\n\n📋 *Serviço:* ${data.serviceName}\n👤 *Profissional:* ${data.professionalName}\n📅 *Data:* ${data.originalDate}\n\nVocê receberá uma confirmação em breve! ✅`;

      case "approved":
        return `✅ *AGENDAMENTO APROVADO*\n\n${data.businessName}\n\n📋 ${data.serviceName}\n👤 ${data.professionalName}\n📅 ${data.originalDate}\n\nAguardamos você! 🎉`;

      case "rejected":
        return `❌ *${data.businessName}*\n\nInfelizmente não conseguimos aprovar seu agendamento para ${data.originalDate}.\n\n📋 *Serviço:* ${data.serviceName}\nℹ️ *Motivo:* ${data.reason || "Horário indisponível"}\n\nPor favor, escolha outro horário. 🗓️`;

      case "rescheduled":
        return `🔄 *REAGENDAMENTO*\n\n${data.businessName}\n\nPrecisamos remarcar seu agendamento:\n\n📋 *Serviço:* ${data.serviceName}\n❌ *Data original:* ${data.originalDate}\n✅ *Nova data:* ${data.newDate}\nℹ️ *Motivo:* ${data.reason || "Ajuste de agenda"}\n\nPor favor, confirme! 📞`;

      default:
        return "";
    }
  }

  /**
   * Simulate API call delay
   */
  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
}

export const notificationService = new NotificationService();
