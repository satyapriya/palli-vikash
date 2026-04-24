export interface Donation {
  id: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  amount: number;
  currency?: string;
  donorName: string;
  donorEmail: string;
  timestamp: Date;
  status: DonationStatus;
  type?: DonationType;
  paymentMethod?: PaymentMethod;
  location?: string;
}

export type DonationStatus = 'pending' | 'completed' | 'failed';

export type DonationType = 'one-time' | 'recurring';
export type PaymentMethod = 'UPI' | 'card' | 'netbanking' | 'wallet';

export interface DonorStats {
  email: string;
  name: string;
  totalAmount: number;
  donationCount: number;
  avgAmount: number;
  lastDonation: Date;
  firstDonation: Date;
  frequency: 'one-time' | 'occasional' | 'recurring';
  tags: string[];
  notes?: string;
}

export interface TrendData {
  date: string;
  amount: number;
  count: number;
}

export interface Filters {
  dateFrom?: Date;
  dateTo?: Date;
  type?: DonationType;
  paymentMethod?: PaymentMethod;
  status?: DonationStatus;
}

