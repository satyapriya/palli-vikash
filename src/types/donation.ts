export interface Donation {
  id: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: string;
  donorName: string;
  donorEmail: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

export type DonationStatus = 'pending' | 'completed' | 'failed';

