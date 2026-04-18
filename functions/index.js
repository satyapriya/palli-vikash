const { onRequest } = require("firebase-functions/v2/https");
const { defineString } = require("firebase-functions/params");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require("razorpay");
const cors = require("cors")({ origin: true });
const crypto = require("crypto");

// ========================
// 🔐 ENV PARAMS (NEW WAY)
// ========================
const RAZORPAY_KEY_ID = defineString("RAZORPAY_KEY_ID");
const RAZORPAY_KEY_SECRET = defineString("RAZORPAY_KEY_SECRET");
const RAZORPAY_WEBHOOK_SECRET = defineString("RAZORPAY_WEBHOOK_SECRET");

// Init Firebase
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

// ========================
// 🔁 Lazy Razorpay Init (prevents deploy crash)
// ========================
let razorpay;

function getRazorpay() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID.value(),
      key_secret: RAZORPAY_KEY_SECRET.value()
    });
  }
  return razorpay;
}

// ========================
// ✅ CREATE ORDER
// ========================
exports.createOrder = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
      }

      const { amount, name, email } = req.body;

      if (!amount || !name || !email) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const razorpay = getRazorpay();

      const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        notes: { name, email }
      });

      console.log("✅ Order created:", order.id);

      return res.status(200).json(order);
    } catch (err) {
      console.error("❌ Create order error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
});

// ========================
// ✅ VERIFY PAYMENT (Fallback)
// ========================
exports.verifyPayment = onRequest(async (req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
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
        .createHmac("sha256", RAZORPAY_KEY_SECRET.value())
        .update(body)
        .digest("hex");

      if (expectedSignature === razorpay_signature) {
        const existing = await db
          .collection("payments")
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

          console.log("✅ Payment saved via verify:", razorpay_payment_id);
        }

        return res.json({ success: true });
      }

      return res.status(400).json({ success: false, error: "Invalid signature" });
    } catch (err) {
      console.error("❌ Verify error:", err);
      return res.status(500).json({ error: err.message });
    }
  });
});

// ========================
// ✅ WEBHOOK (MAIN SOURCE)
// ========================
exports.razorpayWebhook = onRequest(
  { rawBody: true },
  async (req, res) => {
    try {
      console.log("🔥 Webhook HIT");

      if (req.method !== "POST") {
        return res.status(405).send("Method not allowed");
      }

      const secret = RAZORPAY_WEBHOOK_SECRET.value();
      const signature = req.headers["x-razorpay-signature"];

      if (!secret || !signature) {
        console.log("❌ Missing secret or signature");
        return res.status(400).send("Missing headers");
      }

      const digest = crypto
        .createHmac("sha256", secret)
        .update(req.rawBody)
        .digest("hex");

      if (digest !== signature) {
        console.log("❌ Invalid signature");
        return res.status(400).send("Invalid signature");
      }

      const event = JSON.parse(req.rawBody.toString());
      console.log("Event:", event.event);

      const payment = event.payload?.payment?.entity;

      if (payment?.status === "captured") {
        console.log("💰 Payment captured:", payment.id);

        const existing = await db
          .collection("payments")
          .where("razorpay_payment_id", "==", payment.id)
          .limit(1)
          .get();

        if (existing.empty) {
          await db.collection("payments").add({
            name: payment.notes?.name || "Anonymous",
            email: payment.email || payment.notes?.email || null,
            amount: payment.amount / 100,
            razorpay_payment_id: payment.id,
            razorpay_order_id: payment.order_id,
            status: "success",
            webhook: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          console.log("✅ Saved via webhook:", payment.id);
        } else {
          console.log("⚠️ Duplicate ignored:", payment.id);
        }
      }

      return res.status(200).send("OK");
    } catch (err) {
      console.error("❌ Webhook error:", err);
      return res.status(500).send(err.message);
    }
  }
);

// ========================
// ✅ ADMIN FUNCTION
// ========================
exports.makeAdmin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new Error("Must be logged in");
  }

  const callerDoc = await db.collection("users").doc(context.auth.uid).get();

  if (!callerDoc.exists || !callerDoc.data().isAdmin) {
    throw new Error("Admin only");
  }

  const { uid } = data;

  await db.collection("users").doc(uid).set(
    {
      isAdmin: true,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  return { success: true };
});

// ========================
  // ✅ LIST ADMINS (HTTP + CORS)
  // ========================
 exports.listAdmins = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new Error("Not authenticated");
    }

    const uid = context.auth.uid;

    const callerDoc = await db.collection("users").doc(uid).get();

    if (!callerDoc.exists || !callerDoc.data().isAdmin) {
      throw new Error("Admin only");
    }

    const snapshot = await db
      .collection("users")
      .where("isAdmin", "==", true)
      .get();

    const admins = snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data()
    }));

    return { admins };
  } catch (err) {
    console.error("listAdmins error:", err);
    throw new functions.https.HttpsError("internal", err.message);
  }
});


// ========================
  // ✅ REMOVE ADMIN (HTTP + CORS)
  // ========================
 exports.removeAdmin = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new Error("Not authenticated");
    }

    const uid = context.auth.uid;

    const callerDoc = await db.collection("users").doc(uid).get();

    if (!callerDoc.exists || !callerDoc.data().isAdmin) {
      throw new Error("Admin only");
    }

    const { uid: targetUid } = data;

    if (!targetUid) {
      throw new Error("Missing uid");
    }

    await db.collection("users").doc(targetUid).set(
      {
        isAdmin: false,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      },
      { merge: true }
    );

    return { success: true, message: "Admin role removed" };
  } catch (err) {
    throw new functions.https.HttpsError("internal", err.message);
  }
});



