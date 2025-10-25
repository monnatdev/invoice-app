'use client';

import { X } from 'lucide-react';
import { generateInvoiceHTML, TemplateType } from '@/lib/invoiceTemplates';
import { useEffect, useRef } from 'react';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  type: 'invoice' | 'quote';
  template: TemplateType;
}

export default function TemplatePreviewModal({
  isOpen,
  onClose,
  data,
  type,
  template,
}: TemplatePreviewModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (isOpen && iframeRef.current) {
      const htmlContent = generateInvoiceHTML(data, type, template);
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(htmlContent);
        iframeDoc.close();
      }
    }
  }, [isOpen, data, type, template]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Template Preview</h2>
            <p className="text-sm text-slate-600 mt-1">
              {data.number} - {template.charAt(0).toUpperCase() + template.slice(1)} Template
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Preview */}
        <div className="flex-1 overflow-auto bg-slate-100 p-6">
          <iframe
            ref={iframeRef}
            className="w-full h-full bg-white rounded-lg shadow-xl"
            style={{ minHeight: '800px' }}
            title="Template Preview"
          />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}