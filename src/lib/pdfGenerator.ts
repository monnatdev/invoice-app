// Simple PDF generation using browser print
import { generateInvoiceHTML, TemplateType } from './invoiceTemplates';

export const generatePDF = (
  data: any,
  type: 'invoice' | 'quote',
  template: TemplateType = 'modern'
) => {
  const htmlContent = generateInvoiceHTML(data, type, template);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to download PDF');
    return;
  }

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  setTimeout(() => {
    printWindow.print();
  }, 250);
};