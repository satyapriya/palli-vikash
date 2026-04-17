const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE ORDER
exports.createOrder = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      const { amount, name, email } = req.body;

      if (!amount || !name || !email) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const order = await razorpay.orders.create({
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { name, email }
      });

      res.status(200).json(order);
    } catch (err) {
      console.error('Create order error:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

// VERIFY PAYMENT
exports.verifyPayment = onRequest(async (req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        name,
        email,
        amount
      } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        // Idempotency: Check if already exists
        const existing = await db.collection("payments")
          .where("razorpay_payment_id", "==", razorpay_payment_id)
          .limit(1)
          .get();
          
        if (existing.empty) {
          await db.collection("payments").add({
            name,
            email,
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            status: "success",
            verified: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          console.log("✅ Verified & saved payment:", razorpay_payment_id);
        } else {
          console.log("⚠️ Payment already exists:", razorpay_payment_id);
        }

        return res.json({ success: true });
      }

      return res.status(400).json({ success: false, error: 'Invalid signature' });
    } catch (err) {
      console.error('Verify payment error:', err);
      res.status(500).json({ error: err.message });
    }
  });
});

// RAZORPAY WEBHOOK - Production save
exports.razorpayWebhook = onRequest({ rawBody: true }, async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (!secret || !signature) {
      return res.status(400).send("Missing headers");
    }

    const digest = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    if (digest !== signature) {
      console.log("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(req.rawBody.toString());
    const payment = event.payload?.payment?.entity;

    if (payment?.status === "captured") {
      // Idempotency check
      const existing = await db.collection("payments")
        .where("razorpay_payment_id", "==", payment.id)
        .limit(1)
        .get();
        
      if (existing.empty) {
        await db.collection("payments").add({
          name: payment.contact || "Anonymous",
          email: payment.email || null,
          amount: payment.amount / 100,
          razorpay_payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          status: "success",
          webhook: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log("✅ Webhook saved payment:", payment.id);
      } else {
        console.log("⚠️ Webhook duplicate ignored:", payment.id);
      }
    }

    return res.status(200).send("OK");
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).send(err.message);
  }
});
