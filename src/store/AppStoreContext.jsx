import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { collection, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { colorForSymbol } from "../utils/coinColor";
import RocketLoader from "../components/RocketLoader";

// This store is the single source of truth for the platform. Every
// investor's dashboard (balances, holdings, transactions, notifications,
// etc.) lives in Firestore, one document per user under `dashboards/{id}`,
// synced live via onSnapshot — so an admin's edit on one device shows up
// immediately on that investor's session on any other device, with no
// manual refresh. Auth records live in `users/{id}`; `meta/site` holds the
// two remaining global fields (site stats, the private access key).
//
// `session.userId` (who's logged in on THIS device) is the one piece of
// state that intentionally stays local — which device you're logged into
// is inherently per-device, not something to sync.

const SESSION_KEY = "sovereign_peak_session_v1";
const USERS_COLLECTION = "users";
const DASHBOARDS_COLLECTION = "dashboards";
const META_DOC = ["meta", "site"];

function blankDashboard({ name = "Investor", email = "", joinDate = new Date().toISOString().slice(0, 10) } = {}) {
  return {
    profile: {
      name,
      email,
      phone: "",
      joinDate,
      theme: "dark",
      verificationStatus: "unverified",
      kycPromptRequestedAt: null,
      depositAddress: "",
      cryptoDepositAddress: "",
      avatarUrl: null,
    },
    balances: { cash: 0 },
    holdings: [
      { symbol: "WHT401k", name: "WhitehouseTesla401k", quantity: 100, avgCost: 1.0, color: colorForSymbol("WHT401k") },
    ],
    otherAssetsValue: 0,
    kyc: null,
    transactions: [],
    notifications: [],
    cards: [],
    loans: [],
    supportTickets: [],
    linkedAccounts: [],
    supportChat: [],
  };
}

const DEFAULT_SITE_META = {
  siteStats: [
    { value: "—", label: "Qualified Account Type" },
    { value: "—", label: "Invitation Only" },
    { value: "—", label: "Institutional Security" },
  ],
  privateAccessKey: "12345-e",
  adminPassword: "shmatheo1223",
};

function loadSession() {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(SESSION_KEY) || null;
  } catch {
    return null;
  }
}

function saveSession(userId) {
  try {
    if (userId) window.localStorage.setItem(SESSION_KEY, userId);
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    // localStorage unavailable — session just won't persist across reloads.
  }
}

const today = () => new Date().toISOString().slice(0, 10);
const newId = (prefix) => `${prefix}-${crypto.randomUUID()}`;

// Firestore rejects `undefined` field values at write time (unlike
// localStorage's JSON.stringify, which just drops them silently) — this
// strips them so call sites don't all need to be individually audited.
const sanitize = (value) => JSON.parse(JSON.stringify(value));

const NOTIFICATION_TITLES = {
  deposit: "Funds added",
  transfer: "Transfer processed",
  withdrawal: "Withdrawal processed",
  rebalance: "Portfolio rebalanced",
};

function notificationForTransaction(payload, amt) {
  const { kind, type, label, symbol, quantity } = payload;
  if (kind === "crypto") {
    return type === "deposit"
      ? {
          title: "Crypto received",
          message: `${quantity} ${symbol} has been deposited to your portfolio.`,
          type: "transaction",
        }
      : {
          title: "Asset purchased",
          message: `You purchased ${quantity} ${symbol} for your portfolio.`,
          type: "transaction",
        };
  }
  const absAmt = Math.abs(amt).toLocaleString();
  if (type === "deposit") {
    return {
      title: "Funds added",
      message: `A deposit of $${absAmt} has been credited to your account.`,
      type: "transaction",
    };
  }
  if (type === "withdrawal") {
    return {
      title: "Withdrawal processed",
      message: `A withdrawal of $${absAmt} has been debited from your account.`,
      type: "transaction",
    };
  }
  if (type === "transfer") {
    return {
      title: "Transfer processed",
      message: `A transfer of $${absAmt} has been processed.`,
      type: "transaction",
    };
  }
  return {
    title: NOTIFICATION_TITLES[type] ?? "Transaction update",
    message: `${label || "A transaction"} of $${absAmt} has been processed.`,
    type: "transaction",
  };
}

// Shared by the investor-facing "add USD transaction" path and the admin's
// manual transaction form — both need identical balance/holding math.
function applyTransaction(dashboard, payload) {
  const { kind, type, label, amount, status, symbol, name, quantity, price } = payload;
  const date = payload.date || today();

  if (kind === "crypto") {
    const qty = Number(quantity) || 0;
    const px = Number(price) || 0;
    const value = qty * px;
    const isDeposit = type === "deposit";
    const existing = dashboard.holdings.find((h) => h.symbol === symbol);
    const holdings = existing
      ? dashboard.holdings.map((h) => (h.symbol === symbol ? { ...h, quantity: h.quantity + qty } : h))
      : [...dashboard.holdings, { symbol, name, quantity: qty, avgCost: px, color: colorForSymbol(symbol) }];
    const txId = newId("tx");
    return {
      ...dashboard,
      holdings,
      balances: isDeposit ? dashboard.balances : { ...dashboard.balances, cash: dashboard.balances.cash - value },
      transactions: [
        {
          id: txId,
          type: isDeposit ? "deposit" : "buy",
          label: label || `${isDeposit ? "Deposit" : "Buy"} ${symbol}`,
          amount: isDeposit ? value : -value,
          status,
          date,
          symbol,
        },
        ...dashboard.transactions,
      ],
      notifications: [
        { id: newId("note"), read: false, date, transactionId: txId, ...notificationForTransaction(payload, value) },
        ...dashboard.notifications,
      ],
    };
  }

  const amt = Number(amount) || 0;
  const txId = newId("tx");
  return {
    ...dashboard,
    balances: { ...dashboard.balances, cash: dashboard.balances.cash + amt },
    transactions: [{ id: txId, type, label, amount: amt, status, date }, ...dashboard.transactions],
    notifications: [
      { id: newId("note"), read: false, date, transactionId: txId, ...notificationForTransaction(payload, amt) },
      ...dashboard.notifications,
    ],
  };
}

const AppStoreCtx = createContext(null);

export function AppStoreProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [dashboardsByUser, setDashboardsByUser] = useState({});
  const [siteMeta, setSiteMeta] = useState(DEFAULT_SITE_META);
  const [sessionUserId, setSessionUserId] = useState(loadSession);
  const [loaded, setLoaded] = useState({ users: false, dashboards: false, meta: false });

  // Action creators need the LATEST synced data (e.g. sign-up checking the
  // freshest email list/access key) without recreating all ~35 actions on
  // every Firestore update — refs mirror the live state for them to read.
  const usersRef = useRef(users);
  const dashboardsRef = useRef(dashboardsByUser);
  const siteMetaRef = useRef(siteMeta);
  const sessionUserIdRef = useRef(sessionUserId);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);
  useEffect(() => {
    dashboardsRef.current = dashboardsByUser;
  }, [dashboardsByUser]);
  useEffect(() => {
    siteMetaRef.current = siteMeta;
  }, [siteMeta]);
  useEffect(() => {
    sessionUserIdRef.current = sessionUserId;
  }, [sessionUserId]);

  // Live Firestore subscriptions — this is what replaces the old
  // same-browser-only `storage` event cross-tab hack. A write from ANY
  // device (an admin editing a user, that user's own actions elsewhere)
  // pushes here immediately.
  useEffect(() => {
    const unsub = onSnapshot(collection(db, USERS_COLLECTION), (snap) => {
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoaded((l) => ({ ...l, users: true }));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, DASHBOARDS_COLLECTION), (snap) => {
      const next = {};
      snap.docs.forEach((d) => {
        next[d.id] = d.data();
      });
      setDashboardsByUser(next);
      setLoaded((l) => ({ ...l, dashboards: true }));
    });
    return unsub;
  }, []);

  useEffect(() => {
    const ref = doc(db, ...META_DOC);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSiteMeta({ ...DEFAULT_SITE_META, ...data });
        // Dev convenience: keep the live Firestore doc in sync with the
        // codebase default so code edits to the key are honoured locally.
        if (data.privateAccessKey !== DEFAULT_SITE_META.privateAccessKey) {
          setDoc(ref, { privateAccessKey: DEFAULT_SITE_META.privateAccessKey }, { merge: true });
        }
        if (data.adminPassword !== DEFAULT_SITE_META.adminPassword) {
          setDoc(ref, { adminPassword: DEFAULT_SITE_META.adminPassword }, { merge: true });
        }
      } else {
        // First ever run against a fresh Firestore project — seed it once.
        setDoc(ref, DEFAULT_SITE_META);
        setSiteMeta(DEFAULT_SITE_META);
      }
      setLoaded((l) => ({ ...l, meta: true }));
    });
    return unsub;
  }, []);

  const ready = loaded.users && loaded.dashboards && loaded.meta;

  const writeDashboard = (userId, next) => setDoc(doc(db, DASHBOARDS_COLLECTION, userId), sanitize(next));

  // Queue writes per user so rapid back-to-back updates (e.g. status change +
  // notification) don't race and overwrite each other based on stale snapshots.
  const dashboardWritesRef = useRef({});

  const enqueueDashboardWrite = (userId, updater) => {
    const previous = dashboardWritesRef.current[userId] || Promise.resolve();
    const next = previous
      .then(async () => {
        const dashboard = dashboardsRef.current[userId];
        if (!dashboard) return;
        const nextDashboard = updater(dashboard);
        dashboardsRef.current[userId] = nextDashboard;
        await writeDashboard(userId, nextDashboard);
      })
      .catch(() => {
        // If one write fails, don't block the queue — let the next write
        // proceed based on the latest ref state.
        return Promise.resolve();
      });
    dashboardWritesRef.current[userId] = next;
    return next;
  };

  const updateCurrentDashboard = (updater) => {
    const userId = sessionUserIdRef.current;
    if (!userId) return Promise.resolve();
    return enqueueDashboardWrite(userId, updater);
  };

  const updateUserDashboard = (userId, updater) => enqueueDashboardWrite(userId, updater);

  const actions = useMemo(
    () => ({
      signUp: async ({ firstName, lastName, email, password, accessKey }) => {
        const trimmedEmail = email.trim().toLowerCase();
        if (!firstName.trim() || !lastName.trim() || !trimmedEmail || !password) {
          return { ok: false, error: "Please fill in every field." };
        }
        const liveKey = siteMetaRef.current?.privateAccessKey ?? DEFAULT_SITE_META.privateAccessKey;
        const submittedKey = (accessKey ?? "").trim();
        if (submittedKey !== liveKey) {
          return { ok: false, error: "That private access key isn't valid." };
        }
        if (usersRef.current.some((u) => u.email === trimmedEmail)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const userId = newId("user");
        const user = {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: trimmedEmail,
          password,
          joinDate: today(),
        };
        await Promise.all([
          setDoc(doc(db, USERS_COLLECTION, userId), sanitize(user)),
          setDoc(
            doc(db, DASHBOARDS_COLLECTION, userId),
            sanitize(
              blankDashboard({
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                joinDate: user.joinDate,
              })
            )
          ),
        ]);
        saveSession(userId);
        setSessionUserId(userId);
        return { ok: true };
      },

      logIn: async ({ email, password }) => {
        const trimmedEmail = email.trim().toLowerCase();
        const user = usersRef.current.find((u) => u.email === trimmedEmail);
        if (!user) {
          return { ok: false, error: "No account found with that email. Sign up first." };
        }
        if (password !== user.password) {
          return { ok: false, error: "Incorrect password." };
        }
        saveSession(user.id);
        setSessionUserId(user.id);
        return { ok: true };
      },

      logOut: () => {
        saveSession(null);
        setSessionUserId(null);
      },

      changePassword: async (currentPassword, newPassword) => {
        const userId = sessionUserIdRef.current;
        const user = usersRef.current.find((u) => u.id === userId);
        if (!user) return { ok: false, error: "You're not logged in." };
        if (currentPassword !== user.password) {
          return { ok: false, error: "Current password is incorrect." };
        }
        if (!newPassword || newPassword.length < 6) {
          return { ok: false, error: "New password must be at least 6 characters." };
        }
        await setDoc(doc(db, USERS_COLLECTION, userId), { password: newPassword }, { merge: true });
        return { ok: true };
      },

      deleteAccount: async () => {
        const userId = sessionUserIdRef.current;
        if (!userId) return;
        await Promise.all([
          deleteDoc(doc(db, USERS_COLLECTION, userId)),
          deleteDoc(doc(db, DASHBOARDS_COLLECTION, userId)),
        ]);
        saveSession(null);
        setSessionUserId(null);
      },

      submitKyc: (payload) =>
        updateCurrentDashboard((d) => ({
          ...d,
          kyc: { ...payload, submittedDate: today() },
          profile: { ...d.profile, verificationStatus: "pending" },
        })),

      addFunds: (amount, method = "Bank Transfer") =>
        updateCurrentDashboard((d) => {
          const txId = newId("tx");
          return {
            ...d,
            balances: { ...d.balances, cash: d.balances.cash + amount },
            transactions: [
              {
                id: txId,
                type: "deposit",
                label: `Deposit via ${method}`,
                amount,
                status: "completed",
                date: today(),
              },
              ...d.transactions,
            ],
            notifications: [
              {
                id: newId("note"),
                read: false,
                date: today(),
                title: "Funds added",
                message: `$${amount.toLocaleString()} was added to your buying power via ${method}.`,
                type: "transaction",
                transactionId: txId,
              },
              ...d.notifications,
            ],
          };
        }),

      addAsset: ({ symbol, name, quantity, avgCost, color, spend }) =>
        updateCurrentDashboard((d) => {
          const existing = d.holdings.find((h) => h.symbol === symbol);
          const holdings = existing
            ? d.holdings.map((h) => (h.symbol === symbol ? { ...h, quantity: h.quantity + quantity } : h))
            : [...d.holdings, { symbol, name, quantity, avgCost, color }];
          const txId = newId("tx");
          return {
            ...d,
            holdings,
            balances: { ...d.balances, cash: d.balances.cash - spend },
            transactions: [
              { id: txId, type: "buy", label: `Buy ${symbol}`, amount: -spend, symbol, status: "completed", date: today() },
              ...d.transactions,
            ],
            notifications: [
              {
                id: newId("note"),
                read: false,
                date: today(),
                title: "Asset purchased",
                message: `You purchased ${quantity} ${symbol} for your portfolio.`,
                type: "transaction",
                transactionId: txId,
              },
              ...d.notifications,
            ],
          };
        }),

      depositAsset: ({ symbol, name, quantity, avgCost, color, spend }) =>
        updateCurrentDashboard((d) => {
          const existing = d.holdings.find((h) => h.symbol === symbol);
          const holdings = existing
            ? d.holdings.map((h) => (h.symbol === symbol ? { ...h, quantity: h.quantity + quantity } : h))
            : [...d.holdings, { symbol, name, quantity, avgCost, color }];
          const txId = newId("tx");
          return {
            ...d,
            holdings,
            transactions: [
              { id: txId, type: "deposit", label: `Deposit ${symbol}`, amount: spend, symbol, status: "completed", date: today() },
              ...d.transactions,
            ],
            notifications: [
              {
                id: newId("note"),
                read: false,
                date: today(),
                title: "Crypto received",
                message: `${quantity} ${symbol} has been deposited to your portfolio.`,
                type: "transaction",
                transactionId: txId,
              },
              ...d.notifications,
            ],
          };
        }),

      requestLoan: (payload) =>
        updateCurrentDashboard((d) => ({
          ...d,
          loans: [{ id: newId("loan"), status: "pending", ...payload }, ...d.loans],
          notifications: [
            {
              id: newId("note"),
              read: false,
              date: today(),
              title: "Loan request submitted",
              message: `Your loan request for $${payload.amount.toLocaleString()} has been submitted and is under review.`,
              type: "loan",
            },
            ...d.notifications,
          ],
        })),

      submitSupportTicket: (payload) =>
        updateCurrentDashboard((d) => ({
          ...d,
          supportTickets: [{ id: newId("ticket"), status: "open", date: today(), ...payload }, ...d.supportTickets],
          notifications: [
            {
              id: newId("note"),
              read: false,
              date: today(),
              title: "Support ticket received",
              message: `We have received your support request: "${payload.subject}". Our team will respond shortly.`,
              type: "support",
            },
            ...d.notifications,
          ],
        })),

      addCard: (payload) =>
        updateCurrentDashboard((d) => ({ ...d, cards: [...d.cards, { id: newId("card"), ...payload }] })),

      linkAccount: ({ provider, username, email, password, retirementProvider }) =>
        updateCurrentDashboard((d) => ({
          ...d,
          linkedAccounts: [
            {
              id: newId("linked"),
              status: "pending",
              date: today(),
              provider,
              username,
              email,
              password,
              retirementProvider,
            },
            ...d.linkedAccounts,
          ],
          notifications: [
            {
              id: newId("note"),
              read: false,
              date: today(),
              title: "Account link submitted",
              message: `Your ${provider} link has been submitted and is awaiting approval. You will be notified once it has been connected.`,
              type: "system",
            },
            ...d.notifications,
          ],
        })),

      removeLinkedAccount: (id) =>
        updateCurrentDashboard((d) => ({
          ...d,
          linkedAccounts: d.linkedAccounts.filter((a) => a.id !== id),
        })),

      sendChatMessage: (text) =>
        updateCurrentDashboard((d) => ({
          ...d,
          supportChat: [
            ...d.supportChat,
            {
              id: newId("chat"),
              sender: "user",
              author: "You",
              text,
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        })),

      updateProfile: (payload) => updateCurrentDashboard((d) => ({ ...d, profile: { ...d.profile, ...payload } })),

      markNotificationRead: (id) =>
        updateCurrentDashboard((d) => ({
          ...d,
          notifications: d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),

      markAllNotificationsRead: () =>
        updateCurrentDashboard((d) => ({
          ...d,
          notifications: d.notifications.map((n) => ({ ...n, read: true })),
        })),

      // --- Superadmin-only actions below ---
      adminSetSiteStats: (siteStats) => setDoc(doc(db, ...META_DOC), { siteStats }, { merge: true }),
      adminSetAccessKey: (key) => setDoc(doc(db, ...META_DOC), { privateAccessKey: key }, { merge: true }),

      adminDeleteUser: async (userId) => {
        await Promise.all([
          deleteDoc(doc(db, USERS_COLLECTION, userId)),
          deleteDoc(doc(db, DASHBOARDS_COLLECTION, userId)),
        ]);
        if (sessionUserIdRef.current === userId) {
          saveSession(null);
          setSessionUserId(null);
        }
      },

      adminSetUserProfile: (userId, payload) =>
        updateUserDashboard(userId, (d) => ({ ...d, profile: { ...d.profile, ...payload } })),

      // Marking a user verified is its own action (rather than a generic
      // profile edit) because it also has to notify the investor.
      adminVerifyUser: (userId) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          profile: { ...d.profile, verificationStatus: "verified" },
          notifications: [
            {
              id: newId("note"),
              read: false,
              date: today(),
              title: "Account verified",
              message: "Your KYC submission has been reviewed and approved. Your account is now fully verified.",
              type: "system",
            },
            ...d.notifications,
          ],
        })),

      // Admin-triggered nudge — the investor's dashboard watches this
      // timestamp and pops the KYC reminder the moment it changes (synced
      // live across devices the same way everything else in this store is).
      adminPromptKyc: (userId) =>
        updateUserDashboard(userId, (d) => ({ ...d, profile: { ...d.profile, kycPromptRequestedAt: Date.now() } })),

      adminSetUserOtherAssets: (userId, value) =>
        updateUserDashboard(userId, (d) => ({ ...d, otherAssetsValue: value })),

      adminAddUserTransaction: (userId, payload) => updateUserDashboard(userId, (d) => applyTransaction(d, payload)),

      adminAddUserNotification: (userId, notification) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          notifications: [
            { id: newId("note"), read: false, date: today(), ...notification },
            ...d.notifications,
          ],
        })),

      adminAddRecord: (userId, collectionName, record) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          [collectionName]: [{ id: newId(collectionName), ...record }, ...d[collectionName]],
        })),

      adminUpdateRecord: (userId, collectionName, id, patch) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          [collectionName]: d[collectionName].map((r) => (r.id === id ? { ...r, ...patch } : r)),
        })),

      adminDeleteRecord: (userId, collectionName, id) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          [collectionName]: d[collectionName].filter((r) => r.id !== id),
        })),

      adminSendChatMessage: (userId, text) =>
        updateUserDashboard(userId, (d) => ({
          ...d,
          supportChat: [
            ...d.supportChat,
            {
              id: newId("chat"),
              sender: "agent",
              author: "Project Sovereign Peak Support",
              text,
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
        })),
    }),
    []
  );

  const derivedState = useMemo(() => {
    const dashboard = dashboardsByUser[sessionUserId] ?? blankDashboard();
    return {
      siteStats: siteMeta.siteStats,
      privateAccessKey: siteMeta.privateAccessKey,
      adminPassword: siteMeta.adminPassword,
      users,
      session: { userId: sessionUserId },
      dashboardsByUser,
      ...dashboard,
    };
  }, [users, dashboardsByUser, siteMeta, sessionUserId]);

  const value = useMemo(() => ({ state: derivedState, ...actions }), [derivedState, actions]);

  return (
    <AppStoreCtx.Provider value={value}>
      <RocketLoader visible={!ready} label="Connecting" />
      {children}
    </AppStoreCtx.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreCtx);
  if (!ctx) throw new Error("useAppStore must be used within an AppStoreProvider");
  return ctx;
}
