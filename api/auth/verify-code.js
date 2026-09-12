import crypto from "node:crypto";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const MAX_ATTEMPTS = 5;

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

function json(res, status, body) {
  res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed." });
  }

  const email = String(req.body?.email ?? "").trim().toLowerCase();
  const code = String(req.body?.code ?? "").trim();
  const purpose = req.body?.purpose === "signup" ? "signup" : "login";
  if (!email || !/^\d{6}$/.test(code)) {
    return json(res, 400, { error: "Enter the six-digit verification code." });
  }

  if (!process.env.VERIFICATION_CODE_SECRET) {
    return json(res, 500, { error: "Verification service is not configured." });
  }

  try {
    const db = getDb();
    const verificationRef = db.collection("loginVerifications").doc(verificationId(email, purpose));
    const snapshot = await verificationRef.get();
    if (!snapshot.exists) {
      return json(res, 400, { error: "That code is invalid or has expired." });
    }

    const verification = snapshot.data();
    if (verification.expiresAt <= Date.now()) {
      await verificationRef.delete();
      return json(res, 400, { error: "That code has expired. Request a new one." });
    }

    if ((verification.attempts ?? 0) >= MAX_ATTEMPTS) {
      await verificationRef.delete();
      return json(res, 429, { error: "Too many attempts. Request a new code." });
    }

    const valid = codeHash(email, code, purpose) === verification.codeHash;
    if (!valid) {
      const attempts = (verification.attempts ?? 0) + 1;
      if (attempts >= MAX_ATTEMPTS) await verificationRef.delete();
      else await verificationRef.set({ attempts }, { merge: true });
      return json(res, 400, { error: "That code is invalid or has expired." });
    }

    await verificationRef.delete();
    return json(res, 200, { ok: true, userId: verification.userId, purpose });
  } catch (error) {
    console.error("Unable to verify login code", error);
    return json(res, 500, { error: "Unable to verify the code right now." });
  }
}
