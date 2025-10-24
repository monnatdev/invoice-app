'use client';

import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getInvoices, saveInvoices } from '@/lib/mockData';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);

  useEffect(() => {
    setInvoices(getInvoices());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      const updated = invoices.filter(i => i.id !== id);
      setInvoices(updated);
      saveInvoices(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
        <Link
          href="/dashboard/invoices/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          <Plus size={20} />
          New Invoice
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Invoice</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{invoice.number}</td>
                  <td className="px-6 py-4 text-slate-600">{invoice.clientName}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(invoice.amount)}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/dashboard/invoices/${invoice.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(invoice.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}