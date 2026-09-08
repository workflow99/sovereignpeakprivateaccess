export const portfolioSummary = {
  totalAssets: 8454230.84,
  monthlyChangePercent: 4.82,
};

export const holdings = [
  { symbol: "BTC", name: "Bitcoin", quantity: 62.184, price: 68240.15, changePercent: 3.24 },
  { symbol: "ETH", name: "Ethereum", quantity: 411.62, price: 3512.4, changePercent: 5.87 },
  { symbol: "SOL", name: "Solana", quantity: 3820.7, price: 172.85, changePercent: 7.15 },
  { symbol: "WHT401k", name: "WhitehouseTesla401k", quantity: 4000, price: 1.0, changePercent: 0.0 },
];

export const allocation = [
  { symbol: "BTC", label: "Bitcoin", percent: 45 },
  { symbol: "ETH", label: "Ethereum", percent: 30 },
  { symbol: "SOL", label: "Solana", percent: 20 },
  { symbol: "WHT401k", label: "WhitehouseTesla401k", percent: 5 },
];

// Normalized 0-100 points for the trend line sparkline.
export const chartTrend = [24, 30, 27, 38, 34, 46, 42, 55, 50, 62, 58, 72, 68, 80];

export const whyCards = [
  {
    title: "Sovereign 401(k) Access",
    description:
      "Eligible 401(k) holders receive invitation-only entry to private equity markets previously gated behind a $5 million minimum.",
  },
  {
    title: "Tesla-Directed Allocation",
    description:
      "All capital is strategically allocated toward Tesla stock and related private equity instruments under the $9 trillion fund mandate.",
  },
  {
    title: "Launch Coin Settlement",
    description:
      "Transactions are cleared instantly using Tesla 401(k) Launch Coins, eliminating traditional settlement delays.",
  },
];

export const howItWorks = [
  { step: "01", title: "Verify Your 401(k)", description: "Confirm your existing 401(k) retirement account to establish program eligibility." },
  { step: "02", title: "Receive Access Key", description: "Approved participants are issued a unique Private Access Key to the sovereign investment portal." },
  { step: "03", title: "Activate Launch Coins", description: "Your allocation is converted into Tesla 401(k) Launch Coins for instant transaction processing." },
];

export const eligibilityRequirements = [
  "Active 401(k) Retirement Account",
  "Invitation-Only Access",
  "Private Access Key",
  "Identity Verification",
  "Sovereign Portal Registration",
];

export const securityFeatures = [
  { title: "Encrypted Portal Infrastructure", description: "All 401(k) data and Tesla coin transactions are protected end-to-end." },
  { title: "Private Key Authentication", description: "Access is gated behind sovereign-issued Private Access Keys." },
  { title: "Launch Coin Ledger Security", description: "Tesla 401(k) Launch Coin balances are governed by immutable ledger controls." },
  { title: "Controlled Sovereign Access", description: "Every session is scoped, logged, and monitored by fund administrators." },
];
