'use client';

import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { sendEmail, getEmailTemplate } from '@/lib/emailService';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'invoice' | 'quote';
  data: any;
}

export default function EmailModal({ isOpen, onClose, type, data }: EmailModalProps) {
  const [email, setEmail] = useState(data.clientEmail || '');
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!email) {
      alert('Please enter an email address');
      return;
    }

    setSending(true);
    const result = await sendEmail(type, data, email);
    setSending(false);

    if (result.success) {
      alert(result.message);
      onClose();
    } else {
      alert(result.message);
    }
  };

  const template = getEmailTemplate(type, data);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="text-blue-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Send {type === 'invoice' ? 'Invoice' : 'Quote'}
              </h2>
              <p className="text-sm text-slate-600">{data.number}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@example.com"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Preview Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="preview"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="preview" className="text-sm text-slate-700 cursor-pointer">
              Show email preview
            </label>
          </div>

          {/* Email Preview */}
          {showPreview && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <p className="text-xs font-medium text-slate-600">Email Preview</p>
              </div>
              <div 
                className="p-4 bg-white max-h-96 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: template }}
              />
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> This is a simulated email system. In production, 
              this will send real emails via an email service (SendGrid, AWS SES, etc.)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex gap-3">
          <button
            onClick={handleSend}
            disabled={sending || !email}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {sending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Email
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}