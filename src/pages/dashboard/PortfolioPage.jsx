import { useState } from "react";
import useHoldingsWithLivePrices from "../../hooks/useHoldingsWithLivePrices";
import { useAppStore } from "../../store/AppStoreContext";
import PageHeader from "../../components/dashboard/PageHeader";
import PortfolioValueCard from "../../components/dashboard/PortfolioValueCard";
import PortfolioOverviewChart from "../../components/dashboard/PortfolioOverviewChart";
import AllocationDonut from "../../components/dashboard/AllocationDonut";
import HoldingsTable from "../../components/dashboard/HoldingsTable";
import AddAssetModal from "../../components/dashboard/AddAssetModal";
import { buildAllocationSegments } from "../../utils/allocation";

export default function PortfolioPage() {
  const { state } = useAppStore();
  const { holdings, totalValue, changeAmount, changePercent, liveStatus } = useHoldingsWithLivePrices();
  const [assetOpen, setAssetOpen] = useState(false);

  const allocationSegments = buildAllocationSegments(holdings, state.otherAssetsValue, totalValue);

  return (
    <>
      <PageHeader title="My Portfolio" description="A full view of your holdings and allocation." />

      <div className="mt-6 flex flex-col gap-6 px-6 sm:px-8">
        <PortfolioValueCard
          totalValue={totalValue}
          changePercent={changePercent}
          changeAmount={changeAmount}
          liveStatus={liveStatus}
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

      <AddAssetModal open={assetOpen} onClose={() => setAssetOpen(false)} />
    </>
  );
}
