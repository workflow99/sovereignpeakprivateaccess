export const PROVIDER_TYPES = [
  "Bank Account",
  "Brokerage Account",
  "Crypto Exchange",
  "Retirement Account (401k / IRA)",
  "Credit Union",
  "Digital Wallet",
];

const SHORT_LABEL = {
  "Bank Account": "Bank",
  "Brokerage Account": "Brokerage",
  "Crypto Exchange": "Crypto Exchange",
  "Retirement Account (401k / IRA)": "401k / IRA",
  "Credit Union": "Credit Union",
  "Digital Wallet": "Digital Wallet",
};

export function shortAccountType(provider) {
  return SHORT_LABEL[provider] ?? provider;
}
