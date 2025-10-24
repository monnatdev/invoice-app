'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Download } from 'lucide-react';
import { getInvoices, saveInvoices } from '@/lib/mockData';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/formatters';
import { useState, useEffect } from 'react';
import { generatePDF } from '@/lib/pdfGenerator';
import { Edit2 } from 'lucide-react';


export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const [status, setStatus] = useState('draft');

  useEffect(() => {
    const invoices = getInvoices();
    const found = invoices.find((i: any) => i.id === params.id);
    if (found) {
      setInvoice(found);
      setStatus(found.status);
    }
  }, [params.id]);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Invoice not found</p>
        <Link href="/dashboard/invoices" className="text-blue-600 hover:underline">
          Back to invoices
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this invoice?')) {
      const invoices = getInvoices();
      const updated = invoices.filter((i: any) => i.id !== params.id);
      saveInvoices(updated);
      router.push('/dashboard/invoices');
    }
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    const invoices = getInvoices();
    const updated = invoices.map((i: any) => 
      i.id === params.id ? { ...i, status: newStatus } : i
    );
    saveInvoices(updated);
    setInvoice({ ...invoice, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-slate-100 rounded">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{invoice.number}</h1>
            <p className="text-slate-600 text-sm">Created on {formatDate(invoice.createdAt)}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/invoices/${params.id}/edit`}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition"
          >
            <Edit2 size={18} />
            Edit
          </Link>
          <button 
            onClick={() => generatePDF(invoice, 'invoice')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Download size={18} />
            Download PDF
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
            <p className="text-slate-900 font-medium">{invoice.clientName}</p>
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
                  {invoice.items.map((item: any, i: number) => (
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
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <span className="font-medium text-slate-900">{formatCurrency(invoice.amount)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                <span className="font-medium text-slate-900">Total:</span>
                <span className="font-bold text-lg text-slate-900">{formatCurrency(invoice.amount)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Due Date</h3>
            <p className="text-lg font-bold text-slate-900">{formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}