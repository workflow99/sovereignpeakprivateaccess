import useLivePrices from "./useLivePrices";
import useMarketCoins from "./useMarketCoins";
import { useAppStore } from "../store/AppStoreContext";
import { holdings as fallbackHoldings } from "../data/mockPortfolio";

const FALLBACK_PRICE = Object.fromEntries(
  fallbackHoldings.map((h) => [h.symbol, { price: h.price, change24h: h.changePercent }])
);

export default function useHoldingsWithLivePrices() {
  const { state } = useAppStore();
  const { prices, status } = useLivePrices();
  const { coins: marketCoins } = useMarketCoins();
  const livePrices = prices ?? FALLBACK_PRICE;
  // useLivePrices only polls BTC/ETH/SOL; anything else a user buys from the
  // full market list (e.g. XRP) needs its price from the broader market
  // snapshot instead of freezing at the purchase-time avgCost forever.
  const marketPrices = Object.fromEntries(
    marketCoins.map((c) => [c.symbol, { price: c.current_price, change24h: c.price_change_percentage_24h }])
  );

  const rawHoldings = state.holdings.map((h) => {
    const live =
      livePrices[h.symbol] ?? marketPrices[h.symbol] ?? FALLBACK_PRICE[h.symbol] ?? { price: h.avgCost, change24h: 0 };
    const price = live.price;
    const marketValue = price * h.quantity;
    return {
      ...h,
      price,
      dayChangePercent: live.change24h ?? 0,
      marketValue,
      totalGainLoss: (price - h.avgCost) * h.quantity,
      costBasis: h.avgCost * h.quantity,
    };
  });

  const holdingsTotal = rawHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalValue = holdingsTotal + state.otherAssetsValue + state.balances.cash;

  const holdings = rawHoldings.map((h) => ({
    ...h,
    allocationPercent: totalValue ? (h.marketValue / totalValue) * 100 : 0,
  }));

  const costBasisTotal =
    rawHoldings.reduce((sum, h) => sum + h.costBasis, 0) + state.otherAssetsValue + state.balances.cash;
  const changeAmount = totalValue - costBasisTotal;
  const changePercent = costBasisTotal ? (changeAmount / costBasisTotal) * 100 : 0;

  return { holdings, totalValue, changeAmount, changePercent, liveStatus: status, livePrices };
}
