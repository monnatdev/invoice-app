export type TemplateType = 'modern' | 'classic' | 'creative' | 'bold';

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export const templates: Record<TemplateType, TemplateConfig> = {
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and minimal design',
    primaryColor: '#3b82f6',
    secondaryColor: '#1e293b',
    accentColor: '#f1f5f9',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Professional business style',
    primaryColor: '#1e40af',
    secondaryColor: '#334155',
    accentColor: '#e0e7ff',
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Colorful and bold design',
    primaryColor: '#ec4899',
    secondaryColor: '#7c3aed',
    accentColor: '#fce7f3',
  },
  bold: {
    id: 'bold',
    name: 'Bold',
    description: 'Strong and impactful',
    primaryColor: '#dc2626',
    secondaryColor: '#0f172a',
    accentColor: '#fee2e2',
  },
};

export const generateInvoiceHTML = (
  data: any,
  type: 'invoice' | 'quote',
  template: TemplateType = 'modern'
): string => {
  const config = templates[template];
  const title = type === 'invoice' ? 'Invoice' : 'Quote';
  const dateLabel = type === 'invoice' ? 'Due Date' : 'Expiry Date';
  const dateValue = type === 'invoice' ? data.dueDate : data.expiryDate;

  const itemsHTML = data.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid ${config.accentColor};">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid ${config.accentColor}; text-align: right;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid ${config.accentColor}; text-align: right;">฿${item.rate.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid ${config.accentColor}; text-align: right; font-weight: 600;">฿${(
        item.quantity * item.rate
      ).toLocaleString()}</td>
    </tr>
  `
    )
    .join('');

  // Base styles
  const baseStyles = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      color: ${config.secondaryColor};
      line-height: 1.6;
    }
  `;

  // Template-specific layouts
  const templateLayouts = {
    modern: `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px; background: white;">
        <!-- Header with gradient -->
        <div style="background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%); color: white; padding: 40px; border-radius: 12px 12px 0 0; margin-bottom: 40px;">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
              <h1 style="font-size: 42px; font-weight: 700; margin-bottom: 8px;">INVOICE APP</h1>
              <p style="opacity: 0.9;">Modern invoicing solution</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; opacity: 0.8; margin-bottom: 4px;">${title.toUpperCase()}</div>
              <div style="font-size: 32px; font-weight: 700;">${data.number}</div>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div>
            <div style="font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Bill To</div>
            <div style="font-size: 20px; font-weight: 600; color: ${config.secondaryColor};">${data.clientName}</div>
          </div>
          <div style="text-align: right;">
            <div style="margin-bottom: 12px;">
              <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">${dateLabel}</div>
              <div style="font-size: 16px; font-weight: 600;">${new Date(dateValue).toLocaleDateString('th-TH')}</div>
            </div>
            <div>
              <div style="font-size: 12px; color: #64748b; margin-bottom: 4px;">Status</div>
              <span style="display: inline-block; padding: 6px 16px; background: ${config.accentColor}; color: ${config.primaryColor}; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${data.status}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background: ${config.accentColor};">
              <th style="padding: 16px; text-align: left; font-weight: 600; font-size: 14px; color: ${config.secondaryColor};">Description</th>
              <th style="padding: 16px; text-align: right; font-weight: 600; font-size: 14px; color: ${config.secondaryColor};">Qty</th>
              <th style="padding: 16px; text-align: right; font-weight: 600; font-size: 14px; color: ${config.secondaryColor};">Rate</th>
              <th style="padding: 16px; text-align: right; font-weight: 600; font-size: 14px; color: ${config.secondaryColor};">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <!-- Total -->
        <div style="text-align: right; margin-bottom: 60px;">
          <div style="display: inline-block; text-align: right; padding: 24px 32px; background: ${config.accentColor}; border-radius: 12px;">
            <div style="font-size: 14px; color: #64748b; margin-bottom: 8px;">Total Amount</div>
            <div style="font-size: 48px; font-weight: 700; color: ${config.primaryColor};">฿${data.amount.toLocaleString()}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 30px; border-top: 2px solid ${config.accentColor};">
          <p style="color: #94a3b8; font-size: 14px;">Thank you for your business!</p>
          <p style="color: #cbd5e1; font-size: 12px; margin-top: 8px;">Generated on ${new Date().toLocaleDateString('th-TH')}</p>
        </div>
      </div>
    `,
    classic: `
      <div style="max-width: 800px; margin: 0 auto; padding: 60px; background: white;">
        <!-- Header -->
        <div style="border-bottom: 3px solid ${config.primaryColor}; padding-bottom: 30px; margin-bottom: 40px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h1 style="font-size: 36px; font-weight: 700; color: ${config.secondaryColor}; margin-bottom: 8px;">INVOICE APP</h1>
              <p style="color: #64748b; font-size: 14px;">Professional Invoicing Solution</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 14px; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 1px;">${title}</div>
              <div style="font-size: 28px; font-weight: 700; color: ${config.primaryColor};">${data.number}</div>
            </div>
          </div>
        </div>

        <!-- Info Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 50px;">
          <div>
            <div style="font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 12px;">Billed To</div>
            <div style="font-size: 18px; font-weight: 600; color: ${config.secondaryColor}; margin-bottom: 4px;">${data.clientName}</div>
          </div>
          <div>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">${title} Date:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${new Date(data.createdAt).toLocaleDateString('th-TH')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">${dateLabel}:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${new Date(dateValue).toLocaleDateString('th-TH')}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-size: 14px; color: #64748b;">Status:</td>
                <td style="padding: 8px 0; text-align: right;"><span style="background: ${config.accentColor}; color: ${config.primaryColor}; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${data.status}</span></td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Items Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; border: 1px solid #e2e8f0;">
          <thead>
            <tr style="background: ${config.primaryColor}; color: white;">
              <th style="padding: 16px; text-align: left; font-weight: 600;">Item Description</th>
              <th style="padding: 16px; text-align: center; font-weight: 600;">Quantity</th>
              <th style="padding: 16px; text-align: right; font-weight: 600;">Unit Price</th>
              <th style="padding: 16px; text-align: right; font-weight: 600;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${data.items.map((item: any, i: number) => `
              <tr style="background: ${i % 2 === 0 ? 'white' : '#f8fafc'};">
                <td style="padding: 16px; border: 1px solid #e2e8f0;">${item.description}</td>
                <td style="padding: 16px; text-align: center; border: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 16px; text-align: right; border: 1px solid #e2e8f0;">฿${item.rate.toLocaleString()}</td>
                <td style="padding: 16px; text-align: right; font-weight: 600; border: 1px solid #e2e8f0;">฿${(item.quantity * item.rate).toLocaleString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Total -->
        <div style="text-align: right; margin-bottom: 60px;">
          <table style="display: inline-block; min-width: 300px;">
            <tr>
              <td style="padding: 12px 24px; text-align: right; font-size: 14px; color: #64748b;">Subtotal:</td>
              <td style="padding: 12px 24px; text-align: right; font-weight: 600; font-size: 16px;">฿${data.amount.toLocaleString()}</td>
            </tr>
            <tr style="border-top: 2px solid ${config.primaryColor};">
              <td style="padding: 16px 24px; text-align: right; font-size: 18px; font-weight: 600; color: ${config.secondaryColor};">Total:</td>
              <td style="padding: 16px 24px; text-align: right; font-size: 28px; font-weight: 700; color: ${config.primaryColor};">฿${data.amount.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding-top: 40px; border-top: 1px solid #e2e8f0;">
          <p style="color: #475569; font-size: 16px; margin-bottom: 8px;">Thank you for your business</p>
          <p style="color: #94a3b8; font-size: 13px;">For questions, please contact us at support@invoiceapp.com</p>
        </div>
      </div>
    `,
    creative: `
      <div style="max-width: 800px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #fce7f3 0%, #e0e7ff 100%);">
        <!-- Header Card -->
        <div style="background: white; padding: 40px; border-radius: 24px; margin-bottom: 30px; box-shadow: 0 20px 60px rgba(0,0,0,0.1);">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
            <div>
              <div style="display: inline-block; background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); padding: 16px 28px; border-radius: 16px; margin-bottom: 12px;">
                <h1 style="color: white; font-size: 32px; font-weight: 800; margin: 0;">INVOICE APP</h1>
              </div>
              <p style="color: #64748b; font-size: 14px; margin-left: 4px;">Creative Solutions</p>
            </div>
            <div style="text-align: right;">
              <div style="background: ${config.accentColor}; padding: 20px; border-radius: 16px;">
                <div style="font-size: 12px; color: ${config.primaryColor}; font-weight: 600; text-transform: uppercase; margin-bottom: 4px;">${title}</div>
                <div style="font-size: 28px; font-weight: 800; background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${data.number}</div>
              </div>
            </div>
          </div>

          <!-- Info Cards -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
            <div style="background: ${config.accentColor}; padding: 20px; border-radius: 16px;">
              <div style="font-size: 12px; color: ${config.primaryColor}; font-weight: 600; margin-bottom: 8px;">CLIENT</div>
              <div style="font-size: 20px; font-weight: 700; color: ${config.secondaryColor};">${data.clientName}</div>
            </div>
            <div style="background: ${config.accentColor}; padding: 20px; border-radius: 16px;">
              <div style="font-size: 12px; color: ${config.primaryColor}; font-weight: 600; margin-bottom: 8px;">${dateLabel.toUpperCase()}</div>
              <div style="font-size: 20px; font-weight: 700; color: ${config.secondaryColor};">${new Date(dateValue).toLocaleDateString('th-TH')}</div>
            </div>
          </div>

          <!-- Items -->
          <div style="margin-bottom: 30px;">
            ${data.items.map((item: any) => `
              <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid ${config.primaryColor};">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <div style="font-weight: 600; color: ${config.secondaryColor}; margin-bottom: 4px;">${item.description}</div>
                    <div style="font-size: 14px; color: #64748b;">${item.quantity} × ฿${item.rate.toLocaleString()}</div>
                  </div>
                  <div style="font-size: 24px; font-weight: 700; color: ${config.primaryColor};">฿${(item.quantity * item.rate).toLocaleString()}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Total -->
          <div style="background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor}); padding: 30px; border-radius: 20px; text-align: center; color: white;">
            <div style="font-size: 16px; opacity: 0.9; margin-bottom: 8px; font-weight: 500;">Total Amount</div>
            <div style="font-size: 56px; font-weight: 900;">฿${data.amount.toLocaleString()}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: ${config.secondaryColor};">
          <p style="font-size: 16px; font-weight: 600; margin-bottom: 4px;">✨ Thanks for choosing us!</p>
          <p style="font-size: 13px; opacity: 0.7;">Generated with love on ${new Date().toLocaleDateString('th-TH')}</p>
        </div>
      </div>
    `,
    bold: `
      <div style="max-width: 800px; margin: 0 auto; background: ${config.secondaryColor}; padding: 0;">
        <!-- Header -->
        <div style="background: ${config.primaryColor}; padding: 50px 60px; position: relative; overflow: hidden;">
          <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
          <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
            <div>
              <h1 style="color: white; font-size: 48px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px;">INVOICE</h1>
              <div style="color: white; font-size: 14px; opacity: 0.9; margin-top: 8px; font-weight: 500;">Professional Services</div>
            </div>
            <div style="text-align: right;">
              <div style="background: white; color: ${config.primaryColor}; padding: 16px 24px; border-radius: 8px; display: inline-block;">
                <div style="font-size: 32px; font-weight: 900; line-height: 1;">${data.number}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div style="background: white; padding: 50px 60px;">
          <!-- Info Bar -->
          <div style="display: flex; justify-content: space-between; padding: 30px; background: ${config.accentColor}; border-left: 6px solid ${config.primaryColor}; margin-bottom: 40px;">
            <div>
              <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">CLIENT</div>
              <div style="font-size: 24px; font-weight: 900; color: ${config.secondaryColor};">${data.clientName}</div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">${dateLabel}</div>
              <div style="font-size: 20px; font-weight: 700; color: ${config.secondaryColor};">${new Date(dateValue).toLocaleDateString('th-TH')}</div>
            </div>
          </div>

          <!-- Items -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
            <thead>
              <tr>
                <th style="padding: 20px; text-align: left; background: ${config.secondaryColor}; color: white; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Description</th>
                <th style="padding: 20px; text-align: center; background: ${config.secondaryColor}; color: white; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Qty</th>
                <th style="padding: 20px; text-align: right; background: ${config.secondaryColor}; color: white; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Rate</th>
                <th style="padding: 20px; text-align: right; background: ${config.secondaryColor}; color: white; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map((item: any) => `
                <tr style="border-bottom: 2px solid ${config.accentColor};">
                  <td style="padding: 20px; font-weight: 600; color: ${config.secondaryColor};">${item.description}</td>
                  <td style="padding: 20px; text-align: center; font-weight: 700;">${item.quantity}</td>
                  <td style="padding: 20px; text-align: right; font-weight: 600;">฿${item.rate.toLocaleString()}</td>
                  <td style="padding: 20px; text-align: right; font-weight: 900; font-size: 18px; color: ${config.primaryColor};">฿${(item.quantity * item.rate).toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Total -->
          <div style="background: ${config.secondaryColor}; padding: 40px; border-radius: 0; margin: 0 -60px; text-align: center;">
            <div style="color: white; font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; opacity: 0.8;">Grand Total</div>
            <div style="color: ${config.primaryColor}; font-size: 72px; font-weight: 900; line-height: 1;">฿${data.amount.toLocaleString()}</div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: ${config.secondaryColor}; padding: 30px 60px; text-align: center;">
          <p style="color: white; font-size: 14px; opacity: 0.8; margin: 0;">THANK YOU FOR YOUR BUSINESS</p>
        </div>
      </div>
    `,
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} ${data.number}</title>
        <style>${baseStyles}</style>
      </head>
      <body>
        ${templateLayouts[template]}
      </body>
    </html>
  `;
};