'use client';

import Link from 'next/link';
import { Plus, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getClients, saveClients } from '@/lib/mockData';

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    setClients(getClients());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure?')) {
      const updated = clients.filter(c => c.id !== id);
      setClients(updated);
      saveClients(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Clients</h1>
        <Link
          href="/dashboard/clients/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
        >
          <Plus size={20} />
          Add Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <p className="text-slate-600 mb-4">No clients yet</p>
          <Link
            href="/dashboard/clients/create"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Create your first client
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-slate-900">{client.name}</h3>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                    {client.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-blue-500" />
                  <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                    {client.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-blue-500" />
                  <span>{client.address}</span>
                </div>
              </div>

              <Link
                href={`/dashboard/clients/${client.id}`}
                className="text-blue-600 hover:underline text-sm font-medium mt-4 block"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}