import { saveDonation } from './donations';
import type { Donation } from '@/types/donation';
// import { verifyPaymentSignature } from './razorpay'; // future

export async function POST(request: Request) {
  try {
    const data = await request.json() as Omit<Donation, 'id' | 'timestamp'>;
    
    // TODO: Verify Razorpay signature here
    // await verifyPaymentSignature(data);
    
    const donationId = await saveDonation(data);
    
    return new Response(JSON.stringify({ 
      success: true, 
      donationId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to save donation' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

