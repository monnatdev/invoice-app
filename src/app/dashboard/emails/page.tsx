'use client';

import { useState, useEffect } from 'react';
import { getEmailLogs, EmailLog } from '@/lib/emailService';
import { Mail, FileText, Clock } from 'lucide-react';
import { formatDate } from '@/lib/formatters';

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<EmailLog[]>([]);

  useEffect(() => {
    setLogs(getEmailLogs());
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Email Logs</h1>
        <div className="flex items-center gap-2 text-slate-600">
          <Mail size={20} />
          <span className="font-medium">{logs.length} emails sent</span>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Mail className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600 mb-2">No emails sent yet</p>
          <p className="text-sm text-slate-500">
            Email logs will appear here when you send invoices or quotes
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="divide-y divide-slate-200">
            {logs.map(log => (
              <div key={log.id} className="p-6 hover:bg-slate-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      log.type === 'invoice' 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-purple-100 text-purple-600'
                    }`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900">{log.subject}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        To: <span className="font-medium">{log.recipient}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatDate(log.sentAt)}
                        </span>
                        <span className="capitalize px-2 py-1 bg-slate-100 rounded">
                          {log.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    log.status === 'sent' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}