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
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed': return 'bg-green-500 hover:bg-green-500/80';
    case 'failed': return 'bg-destructive hover:bg-destructive/80';
    default: return 'bg-yellow-500 hover:bg-yellow-500/80';
  }
};

