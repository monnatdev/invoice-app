'use client';

import Link from 'next/link';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getQuotes, saveQuotes } from '@/lib/mockData';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<any[]>([]);

  useEffect(() => {
    setQuotes(getQuotes());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      const updated = quotes.filter(q => q.id !== id);
      setQuotes(updated);
      saveQuotes(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Quotes</h1>
        <Link
          href="/dashboard/quotes/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          <Plus size={20} />
          New Quote
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Quote</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Expiry Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotes.map(quote => (
                <tr key={quote.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 font-medium text-slate-900">{quote.number}</td>
                  <td className="px-6 py-4 text-slate-600">{quote.clientName}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(quote.amount)}</td>
                  <td className="px-6 py-4 text-slate-600">{formatDate(quote.expiryDate)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Link href={`/dashboard/quotes/${quote.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition">
                      <Edit2 size={16} />
                    </Link>
                    <button onClick={() => handleDelete(quote.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition">
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