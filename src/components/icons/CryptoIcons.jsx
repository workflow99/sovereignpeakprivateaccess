export function BitcoinIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="18"
        fontWeight="700"
        fill="#fff"
      >
        ₿
      </text>
    </svg>
  );
}

export function EthereumIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0D0D14" />
      <polygon points="16,5 23.5,16.2 16,20.5 8.5,16.2" fill="#8C9EFF" fillOpacity="0.85" />
      <polygon points="16,5 16,20.5 8.5,16.2" fill="#627EEA" />
      <polygon points="16,22 23.5,17.7 16,27 8.5,17.7" fill="#8C9EFF" fillOpacity="0.55" />
      <polygon points="16,22 16,27 8.5,17.7" fill="#627EEA" fillOpacity="0.75" />
    </svg>
  );
}

export function SolanaIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0D0D14" />
      <defs>
        <linearGradient id="solGrad" x1="6" y1="9" x2="26" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9945FF" />
          <stop offset="1" stopColor="#14F195" />
        </linearGradient>
      </defs>
      <polygon points="9,9.5 25,9.5 21.5,13 5.5,13" fill="url(#solGrad)" />
      <polygon points="10.5,14.3 26.5,14.3 23,17.8 7,17.8" fill="url(#solGrad)" fillOpacity="0.85" />
      <polygon points="9,19.1 25,19.1 21.5,22.6 5.5,22.6" fill="url(#solGrad)" />
    </svg>
  );
}

export function WHT401kIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0B1220" />
      <circle cx="16" cy="16" r="14" stroke="#D4AF37" strokeWidth="1.5" />
      <text x="16" y="19" textAnchor="middle" fontFamily="Georgia, serif" fontSize="14" fontWeight="700" fill="#FFFFFF">
        W
      </text>
      <text x="16" y="24" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="5" fontWeight="700" fill="#D4AF37">
        401k
      </text>
    </svg>
  );
}

export const CRYPTO_ICONS = {
  BTC: BitcoinIcon,
  ETH: EthereumIcon,
  SOL: SolanaIcon,
  WHT401k: WHT401kIcon,
};

// Last-resort fallback if a symbol has no bespoke SVG above and no market
// logo could be found (e.g. fully offline) — a stable, colored letter
// badge so an unrecognized symbol never resolves to `undefined` and
// crashes the render tree.
export function GenericCoinIcon({ size = 28, symbol = "?" }) {
  return (
    <span
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-white/10 font-semibold text-white"
      aria-hidden="true"
    >
      {symbol.slice(0, 1)}
    </span>
  );
}

// The real logo for ANY coin (all ~50 in the market list), sourced from
// live market data (`coins`, from useMarketCoins — call that hook once per
// page and pass its list down rather than re-fetching per icon). Falls
// back to the hand-drawn SVGs for BTC/ETH/SOL, then the letter badge, if
// the market data hasn't loaded yet.
export function CoinIcon({ symbol, size = 28, coins = [] }) {
  const coin = coins.find((c) => c.symbol === symbol);
  if (coin?.image) {
    return (
      <img
        src={coin.image}
        alt=""
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full"
      />
    );
  }
  const Fallback = CRYPTO_ICONS[symbol];
  if (Fallback) return <Fallback size={size} />;
  return <GenericCoinIcon size={size} symbol={symbol} />;
}
