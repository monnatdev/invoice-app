// Mock Email Service
import { generateInvoiceHTML } from './invoiceTemplates';
export interface EmailLog {
  id: string;
  type: 'invoice' | 'quote';
  documentNumber: string;
  recipient: string;
  subject: string;
  sentAt: string;
  status: 'sent' | 'failed';
}

export const sendEmail = async (
  type: 'invoice' | 'quote',
  data: any,
  recipientEmail: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    const emailLog: EmailLog = {
      id: String(Date.now()),
      type,
      documentNumber: data.number,
      recipient: recipientEmail,
      subject: `${type === 'invoice' ? 'Invoice' : 'Quote'} ${data.number} from Invoice App`,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    const logs = getEmailLogs();
    logs.unshift(emailLog);
    localStorage.setItem('emailLogs', JSON.stringify(logs));

    return {
      success: true,
      message: `Email sent successfully to ${recipientEmail}`,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to send email. Please try again.',
    };
  }
};

// แก้ getEmailTemplate ให้ใช้ generateInvoiceHTML
export const getEmailTemplate = (type: 'invoice' | 'quote', data: any): string => {
  return generateInvoiceHTML(data, type, data.template || 'modern');
};


export const getEmailLogs = (): EmailLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('emailLogs');
  return stored ? JSON.parse(stored) : [];
};