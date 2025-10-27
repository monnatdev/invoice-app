'use client';

import Link from 'next/link';
import { Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCurrency, formatDate, getStatusColor, getStatusLabel } from '@/lib/formatters';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch invoices from API
    const fetchInvoices = async () => {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      setInvoices(data);
    };
    fetchInvoices();
  }, []);

  // Filter + Search Logic
  useEffect(() => {
    let filtered = [...invoices];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to page 1 when filter changes
  }, [invoices, searchTerm, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInvoices = filteredInvoices.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        const updated = invoices.filter(i => i.id !== id);
        setInvoices(updated);
      }
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Filters */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by invoice number or client name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-slate-600">
          Showing {currentInvoices.length} of {filteredInvoices.length} invoices
          {searchTerm && ` (filtered from ${invoices.length} total)`}
        </div>
      </div>

      {/* Table */}
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
              {currentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-600">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'No invoices found matching your filters'
                      : 'No invoices yet. Create your first invoice!'}
                  </td>
                </tr>
              ) : (
                currentInvoices.map(invoice => (
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="hidden md:flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}