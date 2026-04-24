import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatting
export const formatDate = (date: Date | string | number): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Currency formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Status color mapping
import { DonorStats, TrendData } from '@/types/donation';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-green-500 hover:bg-green-500/80';
    case 'failed': return 'bg-destructive hover:bg-destructive/80';
    default: return 'bg-yellow-500 hover:bg-yellow-500/80';
  }
};

export const calcGrowthRate = (current: number, previous: number): number => {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

export const formatForChart = (trends: TrendData[]): any[] => {
  return trends.map(t => ({ date: t.date, amount: t.amount, count: t.count }));
};

export const exportToCSV = (data: any[], filename: string) => {
  const headers = Object.keys(data[0] || {});
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
  ].join('\\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export const getDonorTags = (stats: DonorStats): string[] => {
  const tags: string[] = [];
  if (stats.totalAmount > 5000) tags.push('High Value');
  if (stats.totalAmount > 10000) tags.push('Corporate');
  if (stats.frequency === 'recurring') tags.push('Recurring');
  if (stats.donationCount === 1) tags.push('First-time donor');
  return tags;
};

