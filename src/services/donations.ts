import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Donation } from '@/types/donation';

export const saveDonation = async (donationData: Omit<Donation, 'id' | 'timestamp'>) => {
  try {
    const docRef = await addDoc(collection(db, 'donations'), {
      ...donationData,
      timestamp: serverTimestamp(),
      status: 'completed' as const,
    });
    console.log('Donation saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving donation:', error);
    throw error;
  }
};

export const getDonations = async () => {
  const q = query(collection(db, 'payments'), 
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      razorpayPaymentId: data.razorpay_payment_id || '',
      razorpayOrderId: data.razorpay_order_id,
      amount: data.amount || 0,
      donorName: data.name || 'Anonymous',
      donorEmail: data.email || '',
      timestamp: data.createdAt?.toDate() || new Date(),
      status: (data.status || 'completed') as DonationStatus,
    };
  });
};

