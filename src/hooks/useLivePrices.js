import { useEffect, useState } from "react";

const COINGECKO_IDS = { BTC: "bitcoin", ETH: "ethereum", SOL: "solana" };
const POLL_INTERVAL = 45000;

export default function useLivePrices() {
  const [prices, setPrices] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    let timer;

    const fetchPrices = async () => {
      try {
        const ids = Object.values(COINGECKO_IDS).join(",");
        const res = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`
        );
        if (!res.ok) throw new Error(`CoinGecko responded ${res.status}`);
        const data = await res.json();

        if (cancelled) return;
        const next = {};
        for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
          if (data[id]) {
            next[symbol] = {
              price: data[id].usd,
              change24h: data[id].usd_24h_change,
            };
          }
        }
        if (Object.keys(next).length > 0) {
          setPrices(next);
          setStatus("live");
        } else {
          throw new Error("Empty price payload");
        }
      } catch {
        if (!cancelled) setStatus((s) => (s === "live" ? s : "fallback"));
      }
    };

    fetchPrices();
    timer = setInterval(fetchPrices, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  return { prices, status };
}
