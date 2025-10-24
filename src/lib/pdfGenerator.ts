// Simple PDF generation using browser print
export const generatePDF = (data: any, type: 'invoice' | 'quote') => {
  const title = type === 'invoice' ? 'Invoice' : 'Quote';
  const dateLabel = type === 'invoice' ? 'Due Date' : 'Expiry Date';
  const dateValue = type === 'invoice' ? data.dueDate : data.expiryDate;

  // Create a new window with the content
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  const itemsHTML = data.items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.description}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">฿${item.rate.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">฿${(item.quantity * item.rate).toLocaleString()}</td>
    </tr>
  `).join('');

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} ${data.number}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            padding: 40px;
            color: #1e293b;
          }
          .header { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #3b82f6;
          }
          .logo { 
            font-size: 32px; 
            font-weight: bold; 
            color: #3b82f6;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            color: #64748b;
          }
          .info-section { 
            margin-bottom: 30px;
          }
          .info-label {
            font-size: 14px;
            color: #64748b;
            margin-bottom: 4px;
          }
          .info-value {
            font-size: 16px;
            font-weight: 600;
          }
          table { 
            width: 100%; 
            border-collapse: collapse;
            margin: 30px 0;
          }
          th { 
            background: #f1f5f9;
            padding: 12px;
            text-align: left;
            font-size: 14px;
            color: #475569;
            border-bottom: 2px solid #cbd5e1;
          }
          th:last-child, td:last-child { text-align: right; }
          .total-section {
            margin-top: 20px;
            text-align: right;
          }
          .total-label {
            font-size: 18px;
            color: #64748b;
          }
          .total-value {
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
          }
          .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            background: #e0f2fe;
            color: #0369a1;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">INVOICE</div>
            <p style="color: #64748b; margin-top: 8px;">Simple invoicing solution</p>
          </div>
          <div style="text-align: right;">
            <div class="title">${title}</div>
            <p style="font-size: 20px; font-weight: 600; margin-top: 8px;">${data.number}</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
          <div class="info-section">
            <div class="info-label">Bill To:</div>
            <div class="info-value">${data.clientName}</div>
          </div>
          <div style="text-align: right;">
            <div class="info-section">
              <div class="info-label">${dateLabel}:</div>
              <div class="info-value">${new Date(dateValue).toLocaleDateString('th-TH')}</div>
            </div>
            <div class="info-section" style="margin-top: 16px;">
              <div class="info-label">Status:</div>
              <div class="status">${data.status}</div>
            </div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Qty</th>
              <th style="text-align: right;">Rate</th>
              <th style="text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="total-section">
          <div class="total-label">Total Amount</div>
          <div class="total-value">฿${data.amount.toLocaleString()}</div>
        </div>

        <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 14px;">
          <p>Thank you for your business!</p>
          <p style="margin-top: 8px;">Generated on ${new Date().toLocaleDateString('th-TH')}</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Wait for content to load then print
  setTimeout(() => {
    printWindow.print();
  }, 250);
};