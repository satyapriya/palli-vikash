import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, where, limit } from 'firebase/firestore';
import { Donation, DonationStatus, DonationType, PaymentMethod, DonorStats, TrendData, Filters } from '@/types/donation';

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



export const getDonationsFiltered = async (filters: Filters = {}): Promise<Donation[]> => {
  let q = query(
    collection(db, 'payments'),
    orderBy('createdAt', 'desc')
  );

  if (filters.dateFrom) {
    q = query(q, where('createdAt', '>=', filters.dateFrom));
  }
  if (filters.dateTo) {
    q = query(q, where('createdAt', '<=', filters.dateTo));
  }
  // Note: status/type/paymentMethod not in backend yet - client filter below
  // location similar

  const snapshot = await getDocs(q);
  let donations: Donation[] = snapshot.docs.map(doc => {
    const data = doc.data();
    // Map DB 'success' to 'completed' for consistency
    const dbStatus = data.status || 'completed';
    const mappedStatus: DonationStatus = dbStatus === 'success' ? 'completed' : dbStatus;

    const donation: Donation = {
      id: doc.id,
      razorpayPaymentId: data.razorpay_payment_id || '',
      razorpayOrderId: data.razorpay_order_id || '',
      amount: Number(data.amount) || 0,
      donorName: data.name || 'Anonymous',
      donorEmail: data.email || '',
      timestamp: data.createdAt?.toDate() || new Date(),
      status: mappedStatus,
      type: ('one-time' as DonationType),
      paymentMethod: ('card' as PaymentMethod),
      location: data.location || '',
    };
    return donation;
  });

  // Client-side filters for fields not reliably stored in DB
  if (filters.status) {
    donations = donations.filter(d => d.status === filters.status);
  }
  if (filters.type) {
    donations = donations.filter(d => d.type === filters.type);
  }
  if (filters.paymentMethod) {
    donations = donations.filter(d => d.paymentMethod === filters.paymentMethod);
  }

  return donations;
};

const inferPaymentMethod = (paymentId: string): PaymentMethod => {
  if (!paymentId) return 'card';
  if (paymentId.includes('upi')) return 'UPI';
  return 'card'; // default
};

export const getAllDonors = async (filters?: Filters): Promise<DonorStats[]> => {
  const donations = await getDonationsFiltered(filters);
  const donorMap = new Map<string, DonorStats>();

  donations.forEach(d => {
    let stats: DonorStats = donorMap.get(d.donorEmail) || {
      email: d.donorEmail,
      name: d.donorName,
      totalAmount: 0,
      donationCount: 0,
      avgAmount: 0,
      lastDonation: new Date(0),
      firstDonation: new Date(),
      frequency: 'one-time',
      tags: [],
      notes: '',
    };

    stats.totalAmount += d.amount;
    stats.donationCount += 1;
    stats.lastDonation = new Date(Math.max(stats.lastDonation.getTime(), d.timestamp.getTime()));
    stats.firstDonation = new Date(Math.min(stats.firstDonation.getTime(), d.timestamp.getTime()));

    if (stats.donationCount === 1) {
      donorMap.set(d.donorEmail, stats);
    } else {
      donorMap.set(d.donorEmail, stats);
    }
  });

  return Array.from(donorMap.values()).map(stats => ({
    ...stats,
    avgAmount: stats.donationCount > 0 ? Math.round(stats.totalAmount / stats.donationCount) : 0,
    frequency: (stats.donationCount === 1 ? 'one-time' : stats.donationCount <= 3 ? 'occasional' : 'recurring') as DonorStats['frequency'],
    tags: getDefaultTags(stats),
  })).sort((a, b) => b.totalAmount - a.totalAmount);
};

const getDefaultTags = (stats: DonorStats): string[] => {
  const tags: string[] = [];
  if (stats.totalAmount > 5000) tags.push('High Value');
  return tags;
};

export const getDonorStats = async (email: string, filters?: Filters): Promise<DonorStats | null> => {
  const donors = await getAllDonors(filters);
  return donors.find(d => d.email === email) || null;
};

export const getTrends = async (period: 'day' | 'week' | 'month' = 'day'): Promise<TrendData[]> => {
  const now = new Date();
  const days = period === 'day' ? 7 : period === 'week' ? 30 : 90;
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const donations = await getDonationsFiltered({ dateFrom: cutoff });
  const trendMap = new Map<string, TrendData>();

  donations.forEach(d => {
    const dateKey = getTrendDateKey(d.timestamp, period);
    let trend = trendMap.get(dateKey) || { date: dateKey, amount: 0, count: 0 };
    trend.amount += d.amount;
    trend.count += 1;
    trendMap.set(dateKey, trend);
  });

  return Array.from(trendMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

const getTrendDateKey = (date: Date, period: 'day' | 'week' | 'month'): string => {
  const d = new Date(date);
  if (period === 'week') d.setDate(d.getDate() - (d.getDay() || 7) + 1); // Week start
  if (period === 'month') d.setDate(1);
  return d.toISOString().split('T')[0];
};

export const getDonationsForExport = async (filters?: Filters) => getDonationsFiltered(filters);

