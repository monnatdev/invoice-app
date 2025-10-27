'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchClient();
  }, [params.id]);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/clients?id=${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch client');
      const data = await res.json();
      setFormData(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load client data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/clients?id=${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Update failed');
      alert('Client updated successfully!');
      router.push(`/dashboard/clients/${params.id}`);
    } catch (err) {
      console.error(err);
      alert('Error updating client.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/clients/${params.id}`} className="p-2 hover:bg-slate-100 rounded">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Client</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
              submitting
                ? 'bg-blue-300 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {submitting ? 'Updating...' : 'Update Client'}
          </button>

          <Link
            href={`/dashboard/clients/${params.id}`}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}