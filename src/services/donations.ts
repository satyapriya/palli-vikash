import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';
import { Donation } from '@/types/donation';
import type { DonationStatus } from '@/types/donation';

export interface AdminStats {
  totalDonations: number;
  totalAmount: number;
}

export const saveDonation = async (donationData: Omit<Donation, 'id' | 'timestamp'>) => {
  // Existing saveDonation code - unchanged
};

export const getRecentDonations = async (limitNum = 20) => {
  const q = query(
    collection(db, 'payments'), 
    orderBy('createdAt', 'desc'),
    limit(limitNum)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      razorpayPaymentId: data.razorpay_payment_id || '',
      razorpayOrderId: data.razorpay_order_id || '',
      amount: Number(data.amount) || 0,
      donorName: data.name || 'Anonymous',
      donorEmail: data.email || '',
      timestamp: data.createdAt?.toDate() || new Date(),
      status: (data.status || 'completed') as DonationStatus,
    };
  });
};

export const getAdminStats = async () => {
  const q = query(
    collection(db, 'payments'),
    where('status', '==', 'success'),
    limit(1000)
  );
  const snapshot = await getDocs(q);
  const payments = snapshot.docs.map(doc => doc.data());
  const totalDonations = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
  
  return { totalDonations, totalAmount } as AdminStats;
};

export const getDonations = async () => getRecentDonations(50);

