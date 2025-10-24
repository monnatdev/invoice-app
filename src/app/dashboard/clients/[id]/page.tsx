'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { getClients, saveClients } from '@/lib/mockData';
import { useState, useEffect } from 'react';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const clients = getClients();
    const found = clients.find((c: any) => c.id === params.id);
    if (found) {
      setClient(found);
    }
  }, [params.id]);

  if (!client) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 mb-4">Client not found</p>
        <Link href="/dashboard/clients" className="text-blue-600 hover:underline">
          Back to clients
        </Link>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Delete this client?')) {
      const clients = getClients();
      const updated = clients.filter((c: any) => c.id !== params.id);
      saveClients(updated);
      router.push('/dashboard/clients');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Link href="/dashboard/clients" className="p-2 hover:bg-slate-100 rounded">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{client.name}</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition">
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="text-blue-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Email</p>
                <a href={`mailto:${client.email}`} className="text-slate-900 hover:text-blue-600">
                  {client.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="text-blue-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Phone</p>
                <a href={`tel:${client.phone}`} className="text-slate-900 hover:text-blue-600">
                  {client.phone}
                </a>
              </div></div>

            <div className="flex items-start gap-3">
              <MapPin className="text-blue-500 mt-1" size={20} />
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="text-slate-900">{client.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">Statistics</h3>
            <div className="space-y-3">
              <div>
                <p className="text-slate-600 text-sm">Total Invoices</p>
                <p className="text-2xl font-bold text-slate-900">3</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Outstanding Amount</p>
                <p className="text-2xl font-bold text-red-600">฿ 11,700</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Quick Actions</h3>
            <Link
              href={`/dashboard/invoices/create?clientId=${client.id}`}
              className="w-full px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition block text-center"
            >
              Create Invoice
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}