'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Download, ArrowRight } from 'lucide-react';
import { getQuotes, saveQuotes, getInvoices, saveInvoices } from '@/lib/mockData';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/formatters';
import { useState, useEffect } from 'react';
import { generatePDF } from '@/lib/pdfGenerator';
import { Edit2 } from 'lucide-react';
import { Mail } from 'lucide-react';
import EmailModal from '@/components/common/EmailModal';
import { Eye } from 'lucide-react';
import TemplatePreviewModal from '@/components/common/TemplatePreviewModal';

export default function QuoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [status, setStatus] = useState('draft');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);


  useEffect(() => {
    const quotes = getQuotes();
    const found = quotes.find((q: any) => q.id === params.id);
    if (found) {
      setQuote(found);
      setStatus(found.status);
    }
  }, [params.id]);

  if (!quote) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Quote not found</p>
        <Link href="/dashboard/quotes" className="text-blue-600 hover:underline">
          Back to quotes
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this quote?')) {
      const quotes = getQuotes();
      const updated = quotes.filter((q: any) => q.id !== params.id);
      saveQuotes(updated);
      router.push('/dashboard/quotes');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const quotes = getQuotes();
    const updated = quotes.map((q: any) => 
      q.id === params.id ? { ...q, status: newStatus } : q
    );
    saveQuotes(updated);
    setQuote({ ...quote, status: newStatus });
  };

  const handleConvertToInvoice = () => {
    const invoices = getInvoices();
    const newInvoice = {
      id: String(Date.now()),
      number: `INV-${String(invoices.length + 1).padStart(3, '0')}`,
      clientName: quote.clientName,
      amount: quote.amount,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: quote.items,
      createdAt: new Date().toISOString(),
    };
    
    const updatedInvoices = [...invoices, newInvoice];
    saveInvoices(updatedInvoices);
    
    alert('Quote converted to invoice successfully!');
    router.push('/dashboard/invoices');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/quotes" className="p-2 hover:bg-slate-100 rounded">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{quote.number}</h1>
            <p className="text-slate-600 text-sm">Created on {formatDate(quote.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowEmailModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            <Mail size={18} />
            Send Email
          </button>
          <button 
            onClick={handleConvertToInvoice} 
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            <ArrowRight size={18} />
            Convert to Invoice
          </button>
          <Link
            href={`/dashboard/quotes/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <Edit2 size={18} />
            Edit
          </Link>
          <button 
            onClick={() => generatePDF(quote, 'quote', quote.template || 'modern')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Download size={18} />
            Download PDF
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
          >
            <Eye size={18} />
            Preview
          </button>
          <button 
            onClick={handleDelete} 
            className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Client Information</h2>
            <p className="text-slate-900 font-medium">{quote.clientName}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="text-left py-2 text-slate-700">Description</th>
                    <th className="text-right py-2 text-slate-700">Qty</th>
                    <th className="text-right py-2 text-slate-700">Rate</th>
                    <th className="text-right py-2 text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map((item: any, i: number) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3">{item.description}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">{formatCurrency(item.rate)}</td>
                      <td className="text-right font-medium">{formatCurrency(item.quantity * item.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Status</h3>
            <select
              value={status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none text-sm font-medium ${getStatusColor(status)}`}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(quote.amount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="font-medium text-slate-900">Total:</span>
                <span className="font-bold text-lg text-slate-900">{formatCurrency(quote.amount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Expiry Date</h3>
            <p className="text-lg font-bold text-slate-900">{formatDate(quote.expiryDate)}</p>
          </div>
        </div>
      </div>
      <TemplatePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        data={quote}
        type="quote"
        template={quote.template || 'modern'}
      />
      {/* Email Modal */}
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          type="quote"
          data={quote}
        />
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Template</h3>
          <p className="text-lg font-bold text-slate-900 capitalize">
            {quote.template || 'Modern'}
          </p>
        </div>
    </div>
  );
}