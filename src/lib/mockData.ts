// Initial mock data
export const initialInvoices = [
  {
    id: '1',
    number: 'INV-001',
    clientName: 'Acme Corp',
    amount: 5000,
    dueDate: '2024-11-30',
    status: 'paid',
    items: [{ description: 'Web Development', quantity: 1, rate: 5000 }],
    createdAt: '2024-10-01',
  },
  {
    id: '2',
    number: 'INV-002',
    clientName: 'Tech Startup',
    amount: 8500,
    dueDate: '2024-10-25',
    status: 'overdue',
    items: [{ description: 'UI Design', quantity: 5, rate: 1700 }],
    createdAt: '2024-09-20',
  },
  {
    id: '3',
    number: 'INV-003',
    clientName: 'Design Co',
    amount: 3200,
    dueDate: '2024-11-05',
    status: 'sent',
    items: [{ description: 'Mobile App Dev', quantity: 1, rate: 3200 }],
    createdAt: '2024-10-10',
  },
];

export const initialQuotes = [
  {
    id: '1',
    number: 'QT-001',
    clientName: 'Acme Corp',
    amount: 12000,
    expiryDate: '2024-11-30',
    status: 'draft',
    items: [{ description: 'Full Stack Dev', quantity: 2, rate: 6000 }],
    createdAt: '2024-10-15',
  },
];

export const initialClients = [
  {
    id: '1',
    name: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '+66812345678',
    address: '123 Business St, Bangkok',
  },
  {
    id: '2',
    name: 'Tech Startup',
    email: 'hello@techstartup.com',
    phone: '+66898765432',
    address: '456 Tech Park, Bangkok',
  },
  {
    id: '3',
    name: 'Design Co',
    email: 'info@designco.com',
    phone: '+66899999999',
    address: '789 Creative Ave, Bangkok',
  },
];

// Helper functions to manage localStorage
export const getInvoices = () => {
  if (typeof window === 'undefined') return initialInvoices;
  const stored = localStorage.getItem('invoices');
  return stored ? JSON.parse(stored) : initialInvoices;
};

export const saveInvoices = (invoices: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('invoices', JSON.stringify(invoices));
  }
};

export const getQuotes = () => {
  if (typeof window === 'undefined') return initialQuotes;
  const stored = localStorage.getItem('quotes');
  return stored ? JSON.parse(stored) : initialQuotes;
};

export const saveQuotes = (quotes: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }
};

export const getClients = () => {
  if (typeof window === 'undefined') return initialClients;
  const stored = localStorage.getItem('clients');
  return stored ? JSON.parse(stored) : initialClients;
};

export const saveClients = (clients: any[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('clients', JSON.stringify(clients));
  }
};