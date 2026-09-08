import { useEffect, useState } from "react";

// Broad market coin list (top 50 by market cap), shared by the "Add Asset"
// modal and the Superadmin transaction form so both offer the same full
// dropdown instead of a hardcoded handful of symbols.
const FALLBACK_COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: null, current_price: 68240.15, price_change_percentage_24h: 3.24 },
  { id: "ethereum", symbol: "ETH", name: "Ethereum", image: null, current_price: 3512.4, price_change_percentage_24h: 5.87 },
  { id: "solana", symbol: "SOL", name: "Solana", image: null, current_price: 172.85, price_change_percentage_24h: 7.15 },
  { id: "whitehouse-tesla-401k", symbol: "WHT401k", name: "WhitehouseTesla401k", image: null, current_price: 1.0, price_change_percentage_24h: 0.0 },
];

const WHT401K_COIN = {
  id: "whitehouse-tesla-401k",
  symbol: "WHT401k",
  name: "WhitehouseTesla401k",
  image: null,
  current_price: 1.0,
  price_change_percentage_24h: 0.0,
};

export default function useMarketCoins() {
  const [coins, setCoins] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h"
    )
      .then((res) => {
        if (!res.ok) throw new Error("bad response");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const normalized = data.map((c) => ({
          id: c.id,
          symbol: c.symbol.toUpperCase(),
          name: c.name,
          image: c.image,
          current_price: c.current_price,
          price_change_percentage_24h: c.price_change_percentage_24h,
        }));
        // Always inject the proprietary WHT401k coin so it appears in every
        // dropdown, market snapshot, and allocation regardless of live API data.
        const withWHT = [WHT401K_COIN, ...normalized];
        setCoins(withWHT);
        setStatus("live");
      })
      .catch(() => {
        if (!cancelled) {
          setCoins((c) => c ?? FALLBACK_COINS);
          setStatus("fallback");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { coins: coins ?? FALLBACK_COINS, status };
}
