export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  }).format(amount);
};

export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
    sent: 'bg-blue-100 text-blue-700',
    draft: 'bg-slate-100 text-slate-700',
  };
  return colors[status] || 'bg-slate-100 text-slate-700';
};

export const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    paid: 'ชำระแล้ว',
    pending: 'รอชำระ',
    overdue: 'เกินกำหนด',
    sent: 'ส่งแล้ว',
    draft: 'ร่าง',
  };
  return labels[status] || status;
};