// Mock Email Service
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
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    // Mock email sending (replace with real API later)
    const emailLog: EmailLog = {
      id: String(Date.now()),
      type,
      documentNumber: data.number,
      recipient: recipientEmail,
      subject: `${type === 'invoice' ? 'Invoice' : 'Quote'} ${data.number} from Invoice App`,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };

    // Save to localStorage
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

export const getEmailLogs = (): EmailLog[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('emailLogs');
  return stored ? JSON.parse(stored) : [];
};

export const getEmailTemplate = (type: 'invoice' | 'quote', data: any): string => {
  const title = type === 'invoice' ? 'Invoice' : 'Quote';
  const dateLabel = type === 'invoice' ? 'Due Date' : 'Expiry Date';
  const dateValue = type === 'invoice' ? data.dueDate : data.expiryDate;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">INVOICE APP</h1>
      </div>
      
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b; margin-top: 0;">New ${title} Notification</h2>
        <p style="color: #64748b;">You have received a new ${type} from Invoice App.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">${title} Number:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.number}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Client:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${data.clientName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">Amount:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold; color: #3b82f6;">฿${data.amount.toLocaleString()}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">${dateLabel}:</td>
              <td style="padding: 10px 0; text-align: right; font-weight: bold;">${new Date(dateValue).toLocaleDateString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="#" style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View ${title}
          </a>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center;">
          This is an automated notification from Invoice App.
        </p>
      </div>
    </div>
  `;
};