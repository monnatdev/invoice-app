'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getInvoices, getQuotes } from '@/lib/mockData';

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotes, setQuotes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token,"token")
    console.log('xxxx')
    if (!token) {
      console.warn("No token found, redirecting to sign-in");
      router.push('/auth/signin');
    } else {
      console.log("Token found, loading dashboard");
      setInvoices(getInvoices());
      setQuotes(getQuotes());
    }
  }, [router]);

  const overdueInvoices = invoices.filter(i => i.status === 'overdue');
  const totalOverdue = overdueInvoices.reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <Link
          href="/dashboard/invoices/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          <Plus size={20} />
          New Invoice
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Total Invoices</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Total Quotes</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{quotes.length}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Paid</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-slate-600 text-sm font-medium">Overdue</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{overdueInvoices.length}</p>
        </div>
      </div>

      {/* Overdue Card */}
      {overdueInvoices.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Overdue</h2>
          <div className="flex justify-between items-end">
            <p className="text-3xl font-bold text-slate-900">{overdueInvoices.length} invoices</p>
            <p className="text-2xl font-bold text-red-600">฿ {totalOverdue.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Recent Invoices */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Invoices</h2>
          <Link href="/dashboard/invoices" className="text-blue-600 hover:text-blue-700 font-medium">
            View all
          </Link>
        </div>
        <div className="p-6">
          {invoices.length === 0 ? (
            <p className="text-slate-600 text-center py-8">No invoices yet</p>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map(invoice => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-lg transition"
                >
                  <div>
                    <p className="font-medium text-slate-900">{invoice.number}</p>
                    <p className="text-sm text-slate-600">{invoice.clientName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">฿ {invoice.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}