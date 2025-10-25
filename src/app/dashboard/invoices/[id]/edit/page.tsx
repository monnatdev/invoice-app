'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getClients, getInvoices, saveInvoices } from '@/lib/mockData';
import TemplateSelector from '@/components/common/TemplateSelector';
import { TemplateType } from '@/lib/invoiceTemplates';

export default function EditInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const clients = getClients();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    clientId: '',
    dueDate: '',
    items: [{ description: '', quantity: 1, rate: 0 }],
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('modern');

  useEffect(() => {
    const invoices = getInvoices();
    const invoice = invoices.find((i: any) => i.id === params.id);
    if (invoice) {
      setFormData({
        clientId: clients.find(c => c.name === invoice.clientName)?.id || '',
        dueDate: invoice.dueDate,
        items: invoice.items,
      });
      setSelectedTemplate(invoice.template || 'modern');  // ← เพิ่มบรรทัดนี้
    }
    setLoading(false);
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const total = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
    const client = clients.find(c => c.id === formData.clientId);
    const invoices = getInvoices();
    
    const updatedInvoices = invoices.map((i: any) => 
      i.id === params.id 
        ? {
            ...i,
            clientName: client?.name || i.clientName,
            amount: total,
            dueDate: formData.dueDate,
            items: formData.items,
            template: selectedTemplate,  // ← เพิ่มบรรทัดนี้
          }
        : i
    );
    
    saveInvoices(updatedInvoices);
    alert('Invoice updated successfully!');
    router.push(`/dashboard/invoices/${params.id}`);
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    (newItems[index] as any)[field] = field === 'description' ? value : Number(value);
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      setFormData({
        ...formData,
        items: formData.items.filter((_, i) => i !== index),
      });
    }
  };

  const total = formData.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href={`/dashboard/invoices/${params.id}`} className="p-2 hover:bg-slate-100 rounded">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">Edit Invoice</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Invoice Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Client</label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Line Items</h2>
          <div className="space-y-3 mb-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  className="col-span-5 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="col-span-2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  className="col-span-4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="col-span-1 px-2 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition text-sm"
                  disabled={formData.items.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addItem} className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition">
            + Add Item
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-700 font-medium">Total:</span>
            <span className="text-2xl font-bold text-slate-900">฿ {total.toLocaleString()}</span>
          </div>
        </div>

        {/* Template Selection */}
        <div className="bg-white rounded-xl shadow p-6">
          <TemplateSelector
            selected={selectedTemplate}
            onChange={setSelectedTemplate}
          />
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition">
            Update Invoice
          </button>
          <Link href={`/dashboard/invoices/${params.id}`} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition text-center">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}