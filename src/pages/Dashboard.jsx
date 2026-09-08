import { useState } from "react";
import useHoldingsWithLivePrices from "../hooks/useHoldingsWithLivePrices";
import PortfolioValueCard from "../components/dashboard/PortfolioValueCard";
import LinkedAccountsBadge from "../components/dashboard/LinkedAccountsBadge";
import StatsRow from "../components/dashboard/StatsRow";
import PortfolioOverviewChart from "../components/dashboard/PortfolioOverviewChart";
import AllocationDonut from "../components/dashboard/AllocationDonut";
import HoldingsTable from "../components/dashboard/HoldingsTable";
import RightRail from "../components/dashboard/RightRail";
import AddFundsModal from "../components/dashboard/AddFundsModal";
import AddAssetModal from "../components/dashboard/AddAssetModal";
import { useAppStore } from "../store/AppStoreContext";
import { buildAllocationSegments } from "../utils/allocation";

export default function Dashboard() {
  const { state } = useAppStore();
  const { holdings, totalValue, changeAmount, changePercent, liveStatus } =
    useHoldingsWithLivePrices();

  const [fundsOpen, setFundsOpen] = useState(false);
  const [assetOpen, setAssetOpen] = useState(false);

  const allocationSegments = buildAllocationSegments(holdings, state.otherAssetsValue, totalValue);

  return (
    <>
      <div className="mx-6 mt-6 sm:mx-8">
        <h1 className="font-serif text-2xl text-white sm:text-3xl">
          Welcome back, {state.profile.name.split(" ")[0]}!
        </h1>
        <p className="mt-1.5 text-sm text-[#B3B3B3]">Here&apos;s your portfolio overview and performance.</p>
      </div>

      <div className="mx-6 mt-4 flex flex-col gap-4 sm:mx-8 sm:flex-row">
        <PortfolioValueCard
          totalValue={totalValue}
          changePercent={changePercent}
          changeAmount={changeAmount}
          liveStatus={liveStatus}
        />
        <LinkedAccountsBadge linkedAccounts={state.linkedAccounts} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 px-6 sm:px-8 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <StatsRow
            changePercent={changePercent}
            changeAmount={changeAmount}
            buyingPower={state.balances.cash}
            onAddFunds={() => setFundsOpen(true)}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
            <PortfolioOverviewChart />
            <AllocationDonut segments={allocationSegments} />
          </div>

          <HoldingsTable
            holdings={holdings}
            totalValue={totalValue}
            otherAssetsValue={state.otherAssetsValue}
            onAddAsset={() => setAssetOpen(true)}
          />
        </div>

        <RightRail
          totalValue={totalValue}
          buyingPower={state.balances.cash}
          holdings={holdings}
          transactions={state.transactions}
        />
      </div>

      <AddFundsModal open={fundsOpen} onClose={() => setFundsOpen(false)} />
      <AddAssetModal open={assetOpen} onClose={() => setAssetOpen(false)} />
    </>
  );
}
