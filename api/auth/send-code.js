import crypto from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 30 * 1000;

function getDb() {
  const app = getApps()[0] ?? initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
  return getFirestore(app);
}

function verificationId(email, purpose) {
  return crypto.createHash("sha256").update(`${purpose}:${email}`).digest("hex");
}

function codeHash(email, code, purpose) {
  return crypto
    .createHash("sha256")
    .update(`${purpose}:${email}:${code}:${process.env.VERIFICATION_CODE_SECRET}`)
    .digest("hex");
}

function maskEmail(email) {
  const [localPart, domain] = email.split("@");
  const visible = localPart.slice(0, Math.min(2, localPart.length));
  return `${visible}${"*".repeat(Math.max(5, localPart.length - visible.length))}@${domain}`;
}

function json(res, status, body) {
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const purpose = req.body?.purpose === "signup" ? "signup" : "login";
  if (!email || !email.includes("@")) {
    return json(res, 400, { error: "Enter a valid email address." });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.VERIFICATION_CODE_SECRET) {
    return json(res, 500, { error: "Verification service is not configured." });
  }

  try {
    const db = getDb();
    const users = await db.collection("users").where("email", "==", email).limit(1).get();
    if (purpose === "login" && users.empty) {
      return json(res, 400, { error: "No account found with that email. Sign up first." });
    }
    if (purpose === "signup" && !users.empty) {
      return json(res, 400, { error: "An account with this email already exists." });
    }

    const user = users.docs[0];
    const verificationRef = db.collection("loginVerifications").doc(verificationId(email, purpose));
    const existing = await verificationRef.get();
    const existingData = existing.exists ? existing.data() : null;
    if (existingData?.sentAt && Date.now() - existingData.sentAt < RESEND_COOLDOWN_MS) {
      return json(res, 429, { error: "A verification code was just sent. Please wait before requesting another." });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const recipient = process.env.RESEND_TEST_TO_EMAIL || email;
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [recipient],
      subject: "Your login verification code",
      html: `<p>Your verification code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes.</p>`,
    });

    await verificationRef.set({
      email,
      userId: user?.id ?? null,
      purpose,
      codeHash: codeHash(email, code, purpose),
      sentAt: Date.now(),
      expiresAt: Date.now() + CODE_TTL_MS,
      attempts: 0,
    });

    return json(res, 200, { ok: true, maskedEmail: maskEmail(recipient) });
  } catch (error) {
    console.error("Unable to send verification code", error);
    return json(res, 500, { error: "Unable to send a verification code right now." });
  }
}

